import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'

export type NodeShellLabelSegment = {
  kind: 'text' | 'badge'
  text: string
  icon?: ReactNode
}

type NodeShellProps = {
  icon: ReactNode
  label: string
  labelBadge?: string
  labelBadges?: string[]
  labelSegments?: NodeShellLabelSegment[]
  inlineControl?: ReactNode
  selected?: boolean
  activeConnectorSide?: CanvasConnectorSide | null
  invalidConnectorSide?: CanvasConnectorSide | null
  connectedConnectorSides?: CanvasConnectorSide[]
  onConnectorPointerDown?: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => void
  onMeasure?: (size: { width: number; height: number }) => void
}

const connectorButtonStyle: React.CSSProperties = {
  position: 'absolute',
  width: 10,
  height: 10,
  borderRadius: '999px',
  border: '1px solid var(--canvas-panel-divider)',
  background: 'var(--canvas-dashboard-card-bg)',
  boxSizing: 'border-box',
  padding: 0,
  margin: 0,
  appearance: 'none',
  WebkitAppearance: 'none',
}

export default function NodeShell({ icon, label, labelBadge, labelBadges, labelSegments, inlineControl, selected = false, activeConnectorSide = null, invalidConnectorSide = null, connectedConnectorSides = [], onConnectorPointerDown, onMeasure }: NodeShellProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const badges = labelBadges && labelBadges.length > 0 ? labelBadges : labelBadge ? [labelBadge] : []
  const segments: NodeShellLabelSegment[] = labelSegments && labelSegments.length > 0
    ? labelSegments
    : [{ kind: 'text' as const, text: label }, ...badges.map((badge) => ({ kind: 'badge' as const, text: badge }))]
  const isConnectorHighlighted = (side: CanvasConnectorSide) => connectedConnectorSides.includes(side) || activeConnectorSide === side
  const isConnectorInvalid = (side: CanvasConnectorSide) => invalidConnectorSide === side

  useEffect(() => {
    const element = rootRef.current

    if (!element || !onMeasure) {
      return
    }

    const emitSize = () => {
      onMeasure({
        width: element.offsetWidth,
        height: element.offsetHeight,
      })
    }

    emitSize()

    const resizeObserver = new ResizeObserver(() => {
      emitSize()
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [onMeasure])

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        width: 'fit-content',
        minHeight: 56,
        padding: '8px 14px 8px 8px',
        borderRadius: 999,
        border: `1px solid ${selected ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
        background: selected ? 'var(--canvas-surface-soft)' : 'var(--canvas-surface)',
        color: 'var(--canvas-text-primary)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        boxSizing: 'border-box',
        boxShadow: selected ? '0 0 0 3px var(--canvas-chart-accent-glow), var(--canvas-shadow-floating)' : 'var(--canvas-shadow-floating)',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 140ms ease, background-color 140ms ease, box-shadow 140ms ease',
      }}
    >
      <button
        type="button"
        aria-label="Top connector"
        data-node-connector="top"
        onPointerDown={(event) => onConnectorPointerDown?.('top', event)}
        style={{
          ...connectorButtonStyle,
          border: `1px solid ${isConnectorInvalid('top') ? 'var(--color-status-critical)' : isConnectorHighlighted('top') ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
          background: isConnectorInvalid('top') ? 'color-mix(in srgb, var(--color-status-critical) 22%, var(--canvas-dashboard-card-bg))' : isConnectorHighlighted('top') ? 'var(--canvas-accent)' : 'var(--canvas-dashboard-card-bg)',
          left: '50%',
          top: 0,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <button
        type="button"
        aria-label="Right connector"
        data-node-connector="right"
        onPointerDown={(event) => onConnectorPointerDown?.('right', event)}
        style={{
          ...connectorButtonStyle,
          border: `1px solid ${isConnectorInvalid('right') ? 'var(--color-status-critical)' : isConnectorHighlighted('right') ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
          background: isConnectorInvalid('right') ? 'color-mix(in srgb, var(--color-status-critical) 22%, var(--canvas-dashboard-card-bg))' : isConnectorHighlighted('right') ? 'var(--canvas-accent)' : 'var(--canvas-dashboard-card-bg)',
          right: 0,
          top: '50%',
          transform: 'translate(50%, -50%)',
        }}
      />
      <button
        type="button"
        aria-label="Bottom connector"
        data-node-connector="bottom"
        onPointerDown={(event) => onConnectorPointerDown?.('bottom', event)}
        style={{
          ...connectorButtonStyle,
          border: `1px solid ${isConnectorInvalid('bottom') ? 'var(--color-status-critical)' : isConnectorHighlighted('bottom') ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
          background: isConnectorInvalid('bottom') ? 'color-mix(in srgb, var(--color-status-critical) 22%, var(--canvas-dashboard-card-bg))' : isConnectorHighlighted('bottom') ? 'var(--canvas-accent)' : 'var(--canvas-dashboard-card-bg)',
          left: '50%',
          bottom: 0,
          transform: 'translate(-50%, 50%)',
        }}
      />
      <button
        type="button"
        aria-label="Left connector"
        data-node-connector="left"
        onPointerDown={(event) => onConnectorPointerDown?.('left', event)}
        style={{
          ...connectorButtonStyle,
          border: `1px solid ${isConnectorInvalid('left') ? 'var(--color-status-critical)' : isConnectorHighlighted('left') ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
          background: isConnectorInvalid('left') ? 'color-mix(in srgb, var(--color-status-critical) 22%, var(--canvas-dashboard-card-bg))' : isConnectorHighlighted('left') ? 'var(--canvas-accent)' : 'var(--canvas-dashboard-card-bg)',
          left: 0,
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: '999px',
          border: `1px solid ${selected ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
          background: selected ? 'var(--canvas-surface-soft)' : 'var(--canvas-dashboard-card-bg)',
          color: 'var(--canvas-accent)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        {icon}
      </span>

      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
        {inlineControl ? <span style={{ display: 'inline-flex', alignItems: 'center', flex: 'none' }}>{inlineControl}</span> : null}
        {segments.map((segment, index) =>
          segment.kind === 'badge' ? (
            <span
              key={`${segment.kind}-${segment.text}-${index}`}
              style={{
                minHeight: 24,
                padding: '0 8px',
                borderRadius: 999,
                border: `1px solid ${selected ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
                background: 'var(--canvas-surface-soft)',
                color: 'var(--canvas-text-secondary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 11,
                fontWeight: 700,
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                flex: 'none',
              }}
            >
              {segment.icon ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{segment.icon}</span>
              ) : null}
              <span>{segment.text}</span>
            </span>
          ) : (
            <span
              key={`${segment.kind}-${segment.text}-${index}`}
              style={{
                color: 'var(--canvas-text-primary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {segment.text}
            </span>
          ),
        )}
      </span>
    </div>
  )
}
