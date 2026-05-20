type SkeletonProps = {
  width?: number | string
  height?: number | string
  radius?: number | string
  style?: React.CSSProperties
}

export default function Skeleton({ width = '100%', height = 16, radius = 10, style }: SkeletonProps) {
  return (
    <div
      className="appSkeleton"
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  )
}
