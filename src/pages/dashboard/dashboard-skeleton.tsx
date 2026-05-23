import { Skeleton, SkeletonCard, SkeletonText } from '../../components/skeleton/skeleton'

/**
 * Full-page skeleton for the dashboard that mirrors the real layout.
 * Shows immediately on route to prevent blank flash after wormhole transition.
 */
export function DashboardSkeleton() {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {/* Top row: Chart + Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.55fr) minmax(280px, 0.95fr)',
          gap: 18,
        }}
      >
        {/* Chart area */}
        <div
          style={{
            borderRadius: 20,
            border: '1px solid var(--canvas-panel-divider)',
            padding: 24,
            display: 'grid',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton width={120} height={14} />
            <Skeleton width={180} height={32} borderRadius={999} />
          </div>
          <Skeleton width={200} height={36} />
          <Skeleton width={160} height={14} />
          <Skeleton width="100%" height={180} borderRadius={12} />
        </div>

        {/* Metric cards */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr', gap: 18 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                borderRadius: 20,
                border: '1px solid var(--canvas-panel-divider)',
                padding: 22,
                display: 'grid',
                gap: 12,
                alignContent: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width={80} height={12} />
                {i === 0 && <Skeleton width={120} height={26} borderRadius={999} />}
              </div>
              <Skeleton width={140} height={28} />
            </div>
          ))}
        </div>
      </div>

      {/* Social action cards row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 18,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              borderRadius: 20,
              border: '1px solid var(--canvas-panel-divider)',
              padding: 22,
              display: 'grid',
              gap: 14,
            }}
          >
            <Skeleton width={40} height={40} borderRadius={12} />
            <Skeleton width="70%" height={16} />
            <SkeletonText lines={2} />
            <Skeleton width={100} height={32} borderRadius={999} />
          </div>
        ))}
      </div>

      {/* Strategies header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width={160} height={22} />
        <Skeleton width={120} height={34} borderRadius={999} />
      </div>

      {/* Strategy list card */}
      <div
        style={{
          borderRadius: 20,
          border: '1px solid var(--canvas-panel-divider)',
          padding: 22,
          display: 'grid',
          gap: 16,
        }}
      >
        {/* Filter bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width={240} height={38} borderRadius={999} />
          <Skeleton width={80} height={38} borderRadius={999} />
        </div>

        {/* List header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '92px 1.2fr 0.8fr 1fr',
            gap: 14,
            padding: '0 14px',
          }}
        >
          {['60px', '80px', '80px', '90px'].map((w, i) => (
            <Skeleton key={i} width={w} height={10} />
          ))}
        </div>

        {/* List rows */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '92px 1.2fr 0.8fr 1fr',
              gap: 14,
              padding: '12px 14px',
              alignItems: 'center',
              borderBottom: i < 2 ? '1px solid var(--canvas-panel-divider)' : 'none',
            }}
          >
            <Skeleton width={72} height={48} borderRadius={8} />
            <Skeleton width="60%" height={14} />
            <Skeleton width="50%" height={12} />
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 1].map((j) => (
                <Skeleton key={j} width={28} height={28} borderRadius="50%" />
              ))}
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--canvas-panel-divider)' }}>
          <Skeleton width={120} height={12} />
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} width={32} height={32} borderRadius={999} />
            ))}
          </div>
          <Skeleton width={80} height={12} />
        </div>
      </div>
    </div>
  )
}
