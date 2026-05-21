import { CaretDown } from '@phosphor-icons/react'
import { useMemo, useRef, useState } from 'react'

import type { CanvasNodeRecord, CanvasTimeUnit } from '../../state/canvas-node-store'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const unitOptions: Array<{ value: CanvasTimeUnit; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

export default function CanvasWaitSidebar({ active, node, onClose, onDurationChange, onUnitChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onDurationChange: (value: string) => void; onUnitChange: (value: CanvasTimeUnit) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isUnitOpen, setIsUnitOpen] = useState(false)
  const selectedUnit = unitOptions.find((option) => option.value === node?.waitUnit) ?? unitOptions[0]
  const unitGroups = useMemo(() => [{ items: unitOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedUnit.value, trailingIcon: option.value === selectedUnit.value ? '✓' : undefined })) }], [selectedUnit.value])

  return <aside aria-hidden={!active} style={{ position: 'absolute', top: 72, left: 18, width: 280, minHeight: 188, maxHeight: 'calc(100vh - 164px)', borderRadius: 20, border: '1px solid var(--canvas-panel-divider)', background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)', boxShadow: '0 16px 40px var(--canvas-shadow-soft)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: active ? 'auto' : 'none', opacity: active ? 1 : 0, transform: active ? 'translateX(0)' : 'translateX(-16px)', transition: 'opacity 180ms ease, transform 180ms ease', zIndex: 3 }}>
    <CanvasNodeSidebarHeader title="Wait Node" description="Adds a short delay before the branch continues." helpTitle="Wait Node" helpBody="Use Wait when this branch should pause briefly before moving to the next check, filter, or execution step." closeLabel="Close wait sidebar" onClose={onClose} />
    <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CanvasSidebarFieldSection title="Wait Duration" description="Enter how long this branch should pause before moving forward.">
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center' }}>
            <input value={node?.waitDuration ?? ''} onChange={(event) => onDurationChange(event.target.value.replace(/[^0-9]/g, ''))} placeholder="1" inputMode="numeric" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} />
          </div>
          <div style={{ position: 'relative', width: 110 }}>
            <button type="button" onClick={() => setIsUnitOpen((current) => !current)} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}><span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedUnit.label}</span><CaretDown size={14} weight="bold" /></button>
            {isUnitOpen ? <DropdownMenu open={isUnitOpen} boundaryRef={containerRef} groups={unitGroups} position="bottom" portalToBody onItemClick={(item) => { onUnitChange(item.value as CanvasTimeUnit); setIsUnitOpen(false) }} /> : null}
          </div>
        </div>
      </CanvasSidebarFieldSection>
    </div>
  </aside>
}
