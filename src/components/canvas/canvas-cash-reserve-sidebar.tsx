import type { CanvasNodeRecord } from '../../state/canvas-node-store'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'

export default function CanvasCashReserveSidebar({ active, node, onClose, onPercentChange, onLabelChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onPercentChange: (value: string) => void; onLabelChange: (value: string) => void }) {
  return <aside aria-hidden={!active} style={{ position: 'absolute', top: 72, left: 18, width: 280, minHeight: 188, maxHeight: 'calc(100vh - 164px)', borderRadius: 20, border: '1px solid var(--canvas-panel-divider)', background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)', boxShadow: '0 16px 40px var(--canvas-shadow-soft)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: active ? 'auto' : 'none', opacity: active ? 1 : 0, transform: active ? 'translateX(0)' : 'translateX(-16px)', transition: 'opacity 180ms ease, transform 180ms ease', zIndex: 3 }}>
    <CanvasNodeSidebarHeader title="Cash Reserve" description="Keeps part of the portfolio in cash before the branch deploys capital." helpTitle="Cash Reserve" helpBody="Use this node to show that the strategy should keep a minimum cash buffer available before allocating or entering more positions." closeLabel="Close cash reserve sidebar" onClose={onClose} />
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CanvasSidebarFieldSection title="Reserve Percentage" description="Enter how much cash should remain unused as a reserve.">
        <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>%</span><input value={node?.cashReservePercent ?? ''} onChange={(event) => onPercentChange(event.target.value)} placeholder="20" inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} /></div>
      </CanvasSidebarFieldSection>
      <CanvasSidebarFieldSection title="Reserve Label" description="Optional short label to explain what this reserve is for." showDivider={false}>
        <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center' }}><input value={node?.cashReserveLabel ?? ''} onChange={(event) => onLabelChange(event.target.value)} placeholder="Emergency buffer" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 600, padding: 0 }} /></div>
      </CanvasSidebarFieldSection>
    </div>
  </aside>
}
