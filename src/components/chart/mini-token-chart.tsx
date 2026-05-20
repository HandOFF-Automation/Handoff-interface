import { useCanvasTheme } from '../../state/theme-store'

type MiniTokenChartProps = {
  values: number[]
  positive?: boolean
}

function buildPolylinePoints(values: number[], width: number, height: number, padding: number) {
  if (values.length === 0) {
    return ''
  }

  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = maxValue - minValue || 1
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2

  return values
    .map((value, index) => {
      const x = padding + (index / Math.max(values.length - 1, 1)) * innerWidth
      const y = padding + (1 - (value - minValue) / range) * innerHeight

      return `${x},${y}`
    })
    .join(' ')
}

export function MiniTokenChart({ values, positive = true }: MiniTokenChartProps) {
  const theme = useCanvasTheme()
  const width = 90
  const height = 44
  const padding = 4
  const stroke = positive ? (theme === 'light' ? 'rgba(0, 164, 255, 0.82)' : 'rgba(0, 164, 255, 0.82)') : '#ff6b6b'
  const points = buildPolylinePoints(values, width, height, padding)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      style={{ display: 'block', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
