import { CaretDown } from '@phosphor-icons/react'
import { useMemo, useRef, useState } from 'react'

import type { CanvasExposureLimitType, CanvasNodeRecord, CanvasRiskComparator } from '../../state/canvas-node-store'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const typeOptions: Array<{ value: CanvasExposureLimitType; label: string }> = [
  { value: 'assetClass', label: 'Asset Class' },
  { value: 'basket', label: 'Basket' },
  { value: 'portfolio', label: 'Portfolio' },
]

const comparatorOptions: Array<{ value: CanvasRiskComparator; label: string }> = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
]

export default function CanvasExposureLimitSidebar({ active, node, onClose, onTypeChange, onComparatorChange, onValueChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onTypeChange: (value: CanvasExposureLimitType) => void; onComparatorChange: (value: CanvasRiskComparator) => void; onValueChange: (value: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const typeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const comparatorTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [isComparatorOpen, setIsComparatorOpen] = useState(false)
  const selectedType = typeOptions.find((option) => option.value === node?.exposureLimitType) ?? typeOptions[0]
  const selectedComparator = comparatorOptions.find((option) => option.value === node?.riskComparator) ?? comparatorOptions[0]
  const typeGroups = useMemo(() => [{ items: typeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedType.value, trailingIcon: option.value === selectedType.value ? '✓' : undefined })) }], [selectedType.value])
  const comparatorGroups = useMemo(() => [{ items: comparatorOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedComparator.value, trailingIcon: option.value === selectedComparator.value ? '✓' : undefined })) }], [selectedComparator.value])

  const closeAllMenus = () => {
    setIsTypeOpen(false)
    setIsComparatorOpen(false)
  }

  const toggleExclusiveMenu = (target: 'type' | 'comparator') => {
    const nextOpen = target === 'type' ? !isTypeOpen : !isComparatorOpen
    closeAllMenus()

    if (!nextOpen) {
      return
    }

    if (target === 'type') {
      setIsTypeOpen(true)
      return
    }

    setIsComparatorOpen(true)
  }

  return <aside aria-hidden={!active} style={{ position: 'absolute', top: 72, left: 18, width: 280, minHeight: 188, maxHeight: 'calc(100vh - 164px)', borderRadius: 20, border: '1px solid var(--canvas-panel-divider)', background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)', boxShadow: '0 16px 40px var(--canvas-shadow-soft)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: active ? 'auto' : 'none', opacity: active ? 1 : 0, transform: active ? 'translateX(0)' : 'translateX(-16px)', transition: 'opacity 180ms ease, transform 180ms ease', zIndex: 3 }}>
    <CanvasNodeSidebarHeader title="Exposure Limit" description="Adds an exposure cap inside the visual strategy flow." helpTitle="Exposure Limit" helpBody="Use this node when the strategy should show an exposure rule before allocations or execution continue." closeLabel="Close exposure limit sidebar" onClose={onClose} />
    <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CanvasSidebarFieldSection title="Exposure Type" description="Choose what kind of exposure bucket this rule should represent.">
        <button ref={typeTriggerRef} type="button" onClick={() => toggleExclusiveMenu('type')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}><span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedType.label}</span><CaretDown size={14} weight="bold" /></button>
        {isTypeOpen ? <DropdownMenu open={isTypeOpen} anchorRef={typeTriggerRef} boundaryRef={containerRef} groups={typeGroups} position="bottom" portalToBody onItemClick={(item) => { onTypeChange(item.value as CanvasExposureLimitType); setIsTypeOpen(false) }} /> : null}
      </CanvasSidebarFieldSection>
      <CanvasSidebarFieldSection title="Comparator" description="Choose how this exposure rule should be evaluated.">
        <button ref={comparatorTriggerRef} type="button" onClick={() => toggleExclusiveMenu('comparator')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}><span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedComparator.label}</span><CaretDown size={14} weight="bold" /></button>
        {isComparatorOpen ? <DropdownMenu open={isComparatorOpen} anchorRef={comparatorTriggerRef} boundaryRef={containerRef} groups={comparatorGroups} position="bottom" portalToBody onItemClick={(item) => { onComparatorChange(item.value as CanvasRiskComparator); setIsComparatorOpen(false) }} /> : null}
      </CanvasSidebarFieldSection>
      <CanvasSidebarFieldSection title="Limit Value" description="Enter the exposure limit this rule should show." showDivider={false}><div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>%</span><input value={node?.exposureLimitValue ?? ''} onChange={(event) => onValueChange(event.target.value)} placeholder="35" inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} /></div></CanvasSidebarFieldSection>
    </div>
  </aside>
}
