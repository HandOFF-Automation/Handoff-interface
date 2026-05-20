import Skeleton from './skeleton'

export default function DockLoadingShell() {
  return (
    <>
      <div style={{ position: 'fixed', left: 18, top: 18, pointerEvents: 'none' }}>
        <div
          style={{
            height: 42,
            width: 220,
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 999,
            border: '1px solid var(--canvas-dock-border)',
            background: 'var(--canvas-surface-strong)',
            boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Skeleton width="100%" height={18} radius={999} />
        </div>
      </div>

      <div style={{ position: 'fixed', right: 18, top: 18, display: 'flex', gap: 10, pointerEvents: 'none' }}>
        <Skeleton width={158} height={42} radius={999} />
        <Skeleton width={138} height={42} radius={999} />
        <Skeleton width={42} height={42} radius={999} />
      </div>

      <div style={{ position: 'fixed', left: 18, bottom: 18, pointerEvents: 'none' }}>
        <Skeleton width={430} height={42} radius={999} />
      </div>

      <div style={{ position: 'fixed', right: 72, bottom: 18, display: 'flex', gap: 12, pointerEvents: 'none' }}>
        <Skeleton width={42} height={42} radius={999} />
        <Skeleton width={42} height={42} radius={999} />
      </div>

      <div style={{ position: 'fixed', left: '50%', bottom: 18, transform: 'translateX(-50%)', pointerEvents: 'none' }}>
        <Skeleton width={274} height={50} radius={14} />
      </div>
    </>
  )
}
