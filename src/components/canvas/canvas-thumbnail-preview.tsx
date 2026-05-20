import DotsPattern from '../background/dots/dots-pattern'
import GridPattern from '../background/grid/grid-pattern'

type CanvasThumbnailPreviewProps = {
  title: string
  variant?: 'default' | 'shifted' | 'wide'
  empty?: boolean
}

const nodePaletteByVariant = {
  default: {
    top: { left: '10%', top: '14%', width: '36%', height: '18%' },
    right: { right: '10%', top: '30%', width: '28%', height: '24%' },
    bottom: { left: '22%', bottom: '12%', width: '40%', height: '20%' },
  },
  shifted: {
    top: { left: '16%', top: '18%', width: '32%', height: '17%' },
    right: { right: '14%', top: '20%', width: '30%', height: '22%' },
    bottom: { left: '30%', bottom: '15%', width: '34%', height: '19%' },
  },
  wide: {
    top: { left: '8%', top: '16%', width: '42%', height: '17%' },
    right: { right: '8%', top: '34%', width: '32%', height: '22%' },
    bottom: { left: '18%', bottom: '10%', width: '46%', height: '21%' },
  },
} as const

function MockCanvasNode({ title, style }: { title: string; style: React.CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: 18,
        border: '1px solid var(--canvas-panel-divider)',
        background: 'rgba(15, 23, 42, 0.78)',
        boxShadow: '0 18px 34px rgba(0, 0, 0, 0.22)',
        backdropFilter: 'blur(14px)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          height: 24,
          padding: '0 10px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: '999px', background: 'rgba(255,255,255,0.32)' }} />
          <span style={{ width: 5, height: 5, borderRadius: '999px', background: 'rgba(255,255,255,0.18)' }} />
        </div>
      </div>

      <div style={{ padding: 10, display: 'grid', gap: 8 }}>
        <div style={{ width: '58%', height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ width: '100%', height: 22, borderRadius: 12, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ width: '82%', height: 22, borderRadius: 12, background: 'rgba(255,255,255,0.05)' }} />
      </div>
    </div>
  )
}

export function CanvasThumbnailPreview({ title, variant = 'default', empty = false }: CanvasThumbnailPreviewProps) {
  const layout = nodePaletteByVariant[variant]

  return (
    <div
      aria-label={`${title} canvas preview`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--canvas-bg)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.95 }}>
        <GridPattern opacity={0.26} offsetX={12} offsetY={8} scale={0.75} />
        <DotsPattern opacity={0.24} offsetX={6} offsetY={10} scale={0.75} />
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(0,0,0,0) 36%, var(--canvas-vignette-color) 100%)',
        }}
      />

      {empty ? null : (
        <>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '18%',
              top: '34%',
              width: '50%',
              height: 2,
              background: 'linear-gradient(90deg, rgba(0, 164, 255, 0.14), rgba(0, 164, 255, 0.34), rgba(0, 164, 255, 0.10))',
              transform: 'rotate(-8deg)',
              transformOrigin: 'left center',
              boxShadow: '0 0 14px rgba(0, 164, 255, 0.18)',
            }}
          />

          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '38%',
              top: '46%',
              width: '26%',
              height: 2,
              background: 'linear-gradient(90deg, rgba(0, 164, 255, 0.14), rgba(0, 164, 255, 0.32), rgba(0, 164, 255, 0.08))',
              transform: 'rotate(18deg)',
              transformOrigin: 'left center',
              boxShadow: '0 0 14px rgba(0, 164, 255, 0.16)',
            }}
          />

          <MockCanvasNode title="Strategy Flow" style={layout.top} />
          <MockCanvasNode title="Signal Check" style={layout.right} />
          <MockCanvasNode title={title} style={layout.bottom} />
        </>
      )}
    </div>
  )
}
