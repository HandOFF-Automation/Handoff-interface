import { CaretDown } from '@phosphor-icons/react'
import { useMemo, useRef, useState } from 'react'

import type { CanvasIfComparator, CanvasNodeRecord, CanvasPositionCountScope } from '../../state/canvas-node-store'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const comparatorOptions: Array<{ value: CanvasIfComparator; label: string }> = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '=', label: '=' },
]

const scopeOptions: Array<{ value: CanvasPositionCountScope; label: string }> = [
  { value: 'branch', label: 'This Branch' },
  { value: 'portfolio', label: 'Whole Portfolio' },
]

export default function CanvasPositionCountLimitSidebar({ active, node, onClose, onComparatorChange, onCountChange, onScopeChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onComparatorChange: (value: CanvasIfComparator) => void; onCountChange: (value: string) => void; onScopeChange: (value: CanvasPositionCountScope) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isComparatorOpen, setIsComparatorOpen] = useState(false)
  const [isScopeOpen, setIsScopeOpen] = useState(false)
  const selectedComparator = comparatorOptions.find((option) => option.value === node?.positionCountComparator) ?? comparatorOptions[2]
  const selectedScope = scopeOptions.find((option) => option.value === node?.positionCountScope) ?? scopeOptions[0]
  const comparatorGroups = useMemo(() => [{ items: comparatorOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedComparator.value, trailingIcon: option.value === selectedComparator.value ? '✓' : undefined })) }], [selectedComparator.value])
  const scopeGroups = useMemo(() => [{ items: scopeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedScope.value, trailingIcon: option.value === selectedScope.value ? '✓' : undefined })) }], [selectedScope.value])
  const closeAllMenus = () => {
    setIsComparatorOpen(false)
    setIsScopeOpen(false)
  }

  const toggleExclusiveMenu = (target: 'scope' | 'comparator') => {
    const nextOpen = target === 'scope' ? !isScopeOpen : !isComparatorOpen
    closeAllMenus()

    if (!nextOpen) {
      return
    }

    if (target === 'scope') {
      setIsScopeOpen(true)
      return
    }

    setIsComparatorOpen(true)
  }

  return <aside aria-hidden={!active} style={{ position: 'absolute', top: 72, left: 18, width: 280, minHeight: 188, maxHeight: 'calc(100vh - 164px)', borderRadius: 20, border: '1px solid var(--canvas-panel-divider)', background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)', boxShadow: '0 16px 40px var(--canvas-shadow-soft)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: active ? 'auto' : 'none', opacity: active ? 1 : 0, transform: active ? 'translateX(0)' : 'translateX(-16px)', transition: 'opacity 180ms ease, transform 180ms ease', zIndex: 3 }}>
    <CanvasNodeSidebarHeader title="Position Count Limit" description="Caps how many open positions this branch can carry." helpTitle="Position Count Limit" helpBody="Use this node when the strategy should stop opening more positions once a branch or portfolio reaches a maximum count." closeLabel="Close position count limit sidebar" onClose={onClose} />
    <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CanvasSidebarFieldSection title="Scope" description="Choose whether the count applies to the current branch or the whole portfolio."><button type="button" onClick={() => toggleExclusiveMenu('scope')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}><span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedScope.label}</span><CaretDown size={14} weight="bold" /></button>{isScopeOpen ? <DropdownMenu open={isScopeOpen} boundaryRef={containerRef} groups={scopeGroups} position="bottom" portalToBody onItemClick={(item) => { onScopeChange(item.value as CanvasPositionCountScope); setIsScopeOpen(false) }} /> : null}</CanvasSidebarFieldSection>
      <CanvasSidebarFieldSection title="Comparator" description="Choose how the current open-position count should be compared."><button type="button" onClick={() => toggleExclusiveMenu('comparator')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}><span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedComparator.label}</span><CaretDown size={14} weight="bold" /></button>{isComparatorOpen ? <DropdownMenu open={isComparatorOpen} boundaryRef={containerRef} groups={comparatorGroups} position="bottom" portalToBody onItemClick={(item) => { onComparatorChange(item.value as CanvasIfComparator); setIsComparatorOpen(false) }} /> : null}</CanvasSidebarFieldSection>
      <CanvasSidebarFieldSection title="Position Count" description="Enter the maximum number of open positions the flow should allow." showDivider={false}><div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center' }}><input value={node?.positionCountValue ?? ''} onChange={(event) => onCountChange(event.target.value.replace(/[^0-9]/g, ''))} placeholder="5" inputMode="numeric" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} /></div></CanvasSidebarFieldSection>
    </div>
  </aside>
}
