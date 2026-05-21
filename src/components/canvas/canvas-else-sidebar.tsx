import type { CanvasNodeRecord } from '../../state/canvas-node-store'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'

type CanvasElseSidebarProps = {
  active: boolean
  node: CanvasNodeRecord | null
  onClose: () => void
}

export default function CanvasElseSidebar({ active, node, onClose }: CanvasElseSidebarProps) {
  const fallbackLabel = node?.type === 'else' ? 'Otherwise' : 'Fallback'
  const fallbackDescription = node?.type === 'else' ? 'Runs when the paired If condition fails.' : 'Runs as the alternate branch.'

  return (
    <aside
      aria-hidden={!active}
      style={{
        position: 'absolute',
        top: 72,
        left: 18,
        width: 280,
        minHeight: 188,
        maxHeight: 'calc(100vh - 164px)',
        borderRadius: 20,
        border: '1px solid var(--canvas-panel-divider)',
        background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)',
        boxShadow: '0 16px 40px var(--canvas-shadow-soft)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: active ? 'auto' : 'none',
        opacity: active ? 1 : 0,
        transform: active ? 'translateX(0)' : 'translateX(-16px)',
        transition: 'opacity 180ms ease, transform 180ms ease',
        zIndex: 3,
      }}
    >
      <CanvasNodeSidebarHeader
        title="Else Node"
        description="Defines the fallback branch when the paired If condition does not pass."
        helpTitle="Else Node"
        helpBody="The Else node no longer mirrors the If condition editor. It represents the alternate path that runs when the paired If condition fails."
        closeLabel="Close else sidebar"
        onClose={onClose}
      />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Branch Role" description="This node acts as the fallback route after an If node evaluates to false.">
          <div
            style={{
              borderRadius: 16,
              border: '1px solid var(--canvas-panel-divider)',
              background: 'var(--canvas-surface-soft)',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <span
              style={{
                minHeight: 24,
                padding: '0 8px',
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'var(--canvas-surface)',
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
              {fallbackLabel}
            </span>
            <span
              style={{
                color: 'var(--canvas-text-primary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.5,
                display: 'block',
                maxWidth: '100%',
              }}
            >
              {fallbackDescription}
            </span>
          </div>
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection
          title="Behavior"
          description="Connect this node to the actions or logic that should run when the If branch does not continue."
          showDivider={false}
        >
          <div
            style={{
              borderRadius: 16,
              border: '1px solid var(--canvas-panel-divider)',
              background: 'var(--canvas-surface-soft)',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {[
              'Use Else for fallback execution such as Scale Out or Stop Loss.',
              'Keep the actual comparison logic inside the paired If node.',
              'Treat Else as the alternate path, not a second condition editor.',
            ].map((item) => (
              <span
                key={item}
                style={{
                  color: 'var(--canvas-text-secondary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 11,
                  lineHeight: 1.5,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </CanvasSidebarFieldSection>
      </div>
    </aside>
  )
}
