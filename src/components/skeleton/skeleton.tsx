import { CSSProperties } from 'react'

type SkeletonProps = {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  style?: CSSProperties
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  return (
    <div
      className="skeleton-pulse"
      style={{
        width,
        height,
        borderRadius,
        background: 'var(--canvas-skeleton-bg, var(--canvas-surface-soft-strong, rgba(128,128,128,0.1)))',
        ...style,
      }}
    />
  )
}

export function SkeletonText({ lines = 3, width = '100%', gap = 10 }: { lines?: number; width?: string | number; gap?: number }) {
  return (
    <div style={{ display: 'grid', gap, width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={12}
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ height = 120, style }: { height?: number | string; style?: CSSProperties }) {
  return (
    <Skeleton
      width="100%"
      height={height}
      borderRadius={16}
      style={style}
    />
  )
}

export function SkeletonCircle({ size = 36 }: { size?: number }) {
  return <Skeleton width={size} height={size} borderRadius="50%" />
}
