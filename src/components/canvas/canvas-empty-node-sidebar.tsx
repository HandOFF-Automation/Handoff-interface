import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'

type CanvasEmptyNodeSidebarProps = {
  active: boolean
  title: string
  description: string
  helpTitle: string
  helpBody: string
  closeLabel: string
  onClose: () => void
}

export default function CanvasEmptyNodeSidebar({ active, title, description, helpTitle, helpBody, closeLabel, onClose }: CanvasEmptyNodeSidebarProps) {
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
        title={title}
        description={description}
        helpTitle={helpTitle}
        helpBody={helpBody}
        closeLabel={closeLabel}
        onClose={onClose}
      />

    </aside>
  )
}
