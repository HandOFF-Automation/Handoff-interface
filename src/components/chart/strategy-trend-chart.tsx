import { CrosshairMode, LineSeries, createChart, type IChartApi, type ISeriesApi, type UTCTimestamp } from 'lightweight-charts'
import { useEffect, useMemo, useRef } from 'react'

type StrategyTrendChartProps = {
  data: Array<{ time: UTCTimestamp; value: number }>
  label?: string
}

export function StrategyTrendChart({ data, label = 'Total Value' }: StrategyTrendChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const tooltipLabelRef = useRef<HTMLDivElement | null>(null)
  const tooltipValueRef = useRef<HTMLDivElement | null>(null)
  const hoverMarkerRef = useRef<HTMLDivElement | null>(null)

  const renderedChartData = useMemo(() => {
    if (data.length < 2) {
      return data
    }

    const firstPoint = data[0]
    const secondPoint = data[1]
    const lastPoint = data[data.length - 1]
    const previousPoint = data[data.length - 2]
    const leadingStep = Math.max(1, secondPoint.time - firstPoint.time)
    const trailingStep = Math.max(1, lastPoint.time - previousPoint.time)

    return [
      {
        time: (firstPoint.time - leadingStep) as UTCTimestamp,
        value: firstPoint.value,
      },
      ...data,
      {
        time: (lastPoint.time + trailingStep) as UTCTimestamp,
        value: lastPoint.value,
      },
    ]
  }, [data])

  useEffect(() => {
    const container = chartContainerRef.current
    const tooltip = tooltipRef.current
    const hoverMarker = hoverMarkerRef.current
    const tooltipLabel = tooltipLabelRef.current
    const tooltipValue = tooltipValueRef.current

    if (!container || !tooltip || !tooltipLabel || !tooltipValue || !hoverMarker) {
      return
    }

    const chart: IChartApi = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { color: 'transparent' },
        textColor: 'transparent',
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false, color: 'transparent' },
        horzLines: { visible: false, color: 'transparent' },
      },
      rightPriceScale: {
        visible: false,
        borderVisible: false,
      },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        visible: false,
        borderVisible: false,
        timeVisible: false,
        secondsVisible: false,
        rightOffset: 0,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: 'var(--canvas-chart-accent-soft)',
          width: 1,
          labelVisible: false,
        },
        horzLine: {
          color: 'var(--canvas-chart-accent-faint)',
          width: 1,
          labelVisible: false,
        },
      },
      handleScroll: false,
      handleScale: false,
    })

    const series: ISeriesApi<'Line'> = chart.addSeries(LineSeries, {
      lineColor: 'var(--canvas-chart-accent)',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerRadius: 0,
      crosshairMarkerBorderColor: 'var(--canvas-chart-accent)',
      crosshairMarkerBackgroundColor: 'var(--canvas-chart-accent)',
    })

    series.setData(renderedChartData)

    const applyChartSizing = (width: number, height: number) => {
      chart.applyOptions({
        width,
        height,
      })

      if (renderedChartData.length >= 2) {
        chart.timeScale().setVisibleLogicalRange({
          from: 1,
          to: renderedChartData.length - 2,
        })
      }
    }

    applyChartSizing(container.clientWidth, container.clientHeight)
    chart.priceScale('right').applyOptions({
      scaleMargins: {
        top: 0,
        bottom: 0,
      },
    })

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      const { width, height } = entry.contentRect
      applyChartSizing(width, height)
    })

    resizeObserver.observe(container)

    const updateTooltipPosition = (nextLeft: number, nextTop: number) => {
      tooltip.style.left = `${nextLeft}px`
      tooltip.style.top = `${nextTop}px`
    }

    chart.subscribeCrosshairMove((param) => {
      if (
        !param.point ||
        !param.time ||
        param.point.x < 0 ||
        param.point.y < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y > container.clientHeight
      ) {
        tooltip.style.opacity = '0'
        hoverMarker.style.opacity = '0'
        return
      }

      const lineData = param.seriesData.get(series)

      if (!lineData || !('value' in lineData)) {
        tooltip.style.opacity = '0'
        hoverMarker.style.opacity = '0'
        return
      }

      const priceValue = lineData.value
      const lineY = series.priceToCoordinate(priceValue)

      if (lineY === null) {
        tooltip.style.opacity = '0'
        hoverMarker.style.opacity = '0'
        return
      }

      const tooltipWidth = 118
      const tooltipHeight = 56
      const margin = 14

      let nextLeft = param.point.x + margin
      let nextTop = lineY - tooltipHeight - margin

      if (nextLeft + tooltipWidth > container.clientWidth) {
        nextLeft = param.point.x - tooltipWidth - margin
      }

      if (nextLeft < 0) {
        nextLeft = margin
      }

      if (nextTop < 0) {
        nextTop = lineY + margin
      }

      if (nextTop + tooltipHeight > container.clientHeight) {
        nextTop = container.clientHeight - tooltipHeight - margin
      }

      tooltipLabel.textContent = label
      tooltipValue.textContent = `$${priceValue.toFixed(2)}`
      tooltip.style.opacity = '1'
      updateTooltipPosition(nextLeft, nextTop)

      hoverMarker.style.opacity = '1'
      hoverMarker.style.left = `${param.point.x}px`
      hoverMarker.style.top = `${lineY}px`
    })

    const handleMouseLeave = () => {
      tooltip.style.opacity = '0'
      hoverMarker.style.opacity = '0'
    }

    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      resizeObserver.disconnect()
      container.removeEventListener('mouseleave', handleMouseLeave)
      chart.remove()
    }
  }, [data, label, renderedChartData])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 18,
          height: 56,
          background: 'radial-gradient(ellipse at center, var(--canvas-chart-accent-glow) 0%, var(--canvas-hover-accent-faint) 48%, rgba(0, 164, 255, 0) 78%)',
          filter: 'blur(16px)',
          pointerEvents: 'none',
        }}
      />
      <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
      <div
        ref={hoverMarkerRef}
        style={{
          position: 'absolute',
          width: 10,
          height: 10,
          borderRadius: '999px',
          background: 'var(--canvas-accent)',
          border: '2px solid var(--canvas-chart-marker-border)',
          boxShadow: '0 0 0 6px var(--canvas-chart-accent-glow)',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 120ms ease',
        }}
      />
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          width: 118,
          minHeight: 56,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 120ms ease',
          borderRadius: 14,
          border: '1px solid var(--canvas-panel-divider)',
          background: 'var(--canvas-surface)',
          boxShadow: 'var(--canvas-shadow-floating)',
          padding: '10px 12px',
          boxSizing: 'border-box',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          ref={tooltipLabelRef}
          style={{
            color: 'var(--canvas-text-secondary)',
            fontSize: 11,
            fontWeight: 600,
            marginBottom: 6,
          }}
        />
        <div
          ref={tooltipValueRef}
          style={{
            color: 'var(--canvas-text-primary)',
            fontSize: 14,
            fontWeight: 700,
          }}
        />
      </div>
    </div>
  )
}
