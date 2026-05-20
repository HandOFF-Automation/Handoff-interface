type GridPatternProps = {
  opacity?: number
  offsetX?: number
  offsetY?: number
  scale?: number
}

export default function GridPattern({
  opacity = 0.35,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
}: GridPatternProps) {
  const cellSize = 32 * scale
  const normalizedX = ((offsetX % cellSize) + cellSize) % cellSize
  const normalizedY = ((offsetY % cellSize) + cellSize) % cellSize

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        width: '100%',
        height: '100%',
        backgroundImage:
          'linear-gradient(to right, var(--canvas-grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--canvas-grid-color) 1px, transparent 1px)',
        backgroundSize: `${cellSize}px ${cellSize}px`,
        backgroundPosition: `${normalizedX}px ${normalizedY}px`,
      }}
    />
  )
}
