type DotsPatternProps = {
  opacity?: number
  offsetX?: number
  offsetY?: number
  scale?: number
}

export default function DotsPattern({
  opacity = 0.35,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
}: DotsPatternProps) {
  const cellSize = 20 * scale
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
          'radial-gradient(circle at 1px 1px, var(--canvas-dot-color) 1px, transparent 0)',
        backgroundSize: `${cellSize}px ${cellSize}px`,
        backgroundPosition: `${normalizedX}px ${normalizedY}px`,
      }}
    />
  )
}
