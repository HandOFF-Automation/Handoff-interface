import type { CanvasNodeRecord } from '../../state/canvas-node-store'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'

export default function CanvasAssetBasketSidebar({ active, node, onClose, onNameChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onNameChange: (value: string) => void }) {
  return <aside aria-hidden={!active} style={{ position: 'absolute', top: 72, left: 18, width: 280, minHeight: 188, maxHeight: 'calc(100vh - 164px)', borderRadius: 20, border: '1px solid var(--canvas-panel-divider)', background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)', boxShadow: '0 16px 40px var(--canvas-shadow-soft)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: active ? 'auto' : 'none', opacity: active ? 1 : 0, transform: active ? 'translateX(0)' : 'translateX(-16px)', transition: 'opacity 180ms ease, transform 180ms ease', zIndex: 3 }}>
    <CanvasNodeSidebarHeader title="Asset Basket" description="Groups multiple incoming assets into one reusable visual bucket." helpTitle="Asset Basket" helpBody="Use Asset Basket to give a name to a grouped set of assets before the flow filters, allocates, or rebalances them downstream." closeLabel="Close asset basket sidebar" onClose={onClose} />
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CanvasSidebarFieldSection title="Basket Name" description="Enter a short name that explains what this grouped asset set represents." showDivider={false}>
        <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center' }}><input value={node?.assetBasketName ?? ''} onChange={(event) => onNameChange(event.target.value)} placeholder="Core Growth Basket" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 600, padding: 0 }} /></div>
      </CanvasSidebarFieldSection>
    </div>
  </aside>
}
