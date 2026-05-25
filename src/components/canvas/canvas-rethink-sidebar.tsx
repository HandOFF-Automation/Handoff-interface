import { CaretDown, WaveSine } from '@phosphor-icons/react'
import { useMemo, useRef, useState } from 'react'

import type { CanvasNodeRecord, CanvasRethinkAction, CanvasRethinkFocus } from '../../state/canvas-node-store'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const focusOptions: Array<{ value: CanvasRethinkFocus; label: string }> = [
  { value: 'yield', label: 'Yield' },
  { value: 'risk', label: 'Risk' },
  { value: 'allocation', label: 'Allocation' },
  { value: 'portfolio', label: 'Portfolio' },
]

const actionOptions: Array<{ value: CanvasRethinkAction; label: string }> = [
  { value: 'continue', label: 'Continue' },
  { value: 'adjust', label: 'Adjust' },
  { value: 'pause', label: 'Pause' },
]

export default function CanvasRethinkSidebar({ active, node, onClose, onFocusChange, onActionChange, onNoteChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onFocusChange: (value: CanvasRethinkFocus) => void; onActionChange: (value: CanvasRethinkAction) => void; onNoteChange: (value: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const focusTriggerRef = useRef<HTMLButtonElement | null>(null)
  const actionTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isFocusOpen, setIsFocusOpen] = useState(false)
  const [isActionOpen, setIsActionOpen] = useState(false)
  const selectedFocus = focusOptions.find((option) => option.value === node?.rethinkFocus) ?? focusOptions[0]
  const selectedAction = actionOptions.find((option) => option.value === node?.rethinkAction) ?? actionOptions[0]
  const focusGroups = useMemo(() => [{ items: focusOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedFocus.value, trailingIcon: option.value === selectedFocus.value ? '✓' : undefined })) }], [selectedFocus.value])
  const actionGroups = useMemo(() => [{ items: actionOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedAction.value, trailingIcon: option.value === selectedAction.value ? '✓' : undefined })) }], [selectedAction.value])

  const closeAllMenus = () => {
    setIsFocusOpen(false)
    setIsActionOpen(false)
  }

  const toggleExclusiveMenu = (target: 'focus' | 'action') => {
    const nextOpen = target === 'focus' ? !isFocusOpen : !isActionOpen
    closeAllMenus()

    if (!nextOpen) {
      return
    }

    if (target === 'focus') {
      setIsFocusOpen(true)
      return
    }

    setIsActionOpen(true)
  }

  return <aside aria-hidden={!active} style={{ position: 'absolute', top: 72, left: 18, width: 280, minHeight: 220, maxHeight: 'calc(100vh - 164px)', borderRadius: 20, border: '1px solid var(--canvas-panel-divider)', background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)', boxShadow: '0 16px 40px var(--canvas-shadow-soft)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: active ? 'auto' : 'none', opacity: active ? 1 : 0, transform: active ? 'translateX(0)' : 'translateX(-16px)', transition: 'opacity 180ms ease, transform 180ms ease', zIndex: 3 }}>
    <CanvasNodeSidebarHeader title="Rethink" description="Adds an AI review step before the flow continues into the next branch or action." helpTitle="Rethink" helpBody="Use this node to mark where the strategy should re-evaluate yield, risk, allocation, or portfolio posture before continuing." closeLabel="Close rethink sidebar" onClose={onClose} />
    <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CanvasSidebarFieldSection title="Review Focus" description="Choose what this rethink step should evaluate first.">
        <button ref={focusTriggerRef} type="button" onClick={() => toggleExclusiveMenu('focus')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}><span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ width: 28, height: 28, borderRadius: '999px', border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-dashboard-card-bg)', color: 'var(--canvas-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><WaveSine size={16} weight="duotone" /></span><span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedFocus.label}</span></span><CaretDown size={14} weight="bold" style={{ color: 'var(--canvas-text-secondary)' }} /></button>
        {isFocusOpen ? <DropdownMenu open={isFocusOpen} anchorRef={focusTriggerRef} boundaryRef={containerRef} groups={focusGroups} position="bottom" portalToBody onItemClick={(item) => { onFocusChange(item.value as CanvasRethinkFocus); setIsFocusOpen(false) }} /> : null}
      </CanvasSidebarFieldSection>
      <CanvasSidebarFieldSection title="Suggested Outcome" description="Choose the decision signal this AI review should pass forward.">
        <button ref={actionTriggerRef} type="button" onClick={() => toggleExclusiveMenu('action')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}><span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedAction.label}</span><CaretDown size={14} weight="bold" style={{ color: 'var(--canvas-text-secondary)' }} /></button>
        {isActionOpen ? <DropdownMenu open={isActionOpen} anchorRef={actionTriggerRef} boundaryRef={containerRef} groups={actionGroups} position="bottom" portalToBody onItemClick={(item) => { onActionChange(item.value as CanvasRethinkAction); setIsActionOpen(false) }} /> : null}
      </CanvasSidebarFieldSection>
      <CanvasSidebarFieldSection title="Operator Note" description="Optional short note describing what this review step should reconsider." showDivider={false}>
        <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center' }}><input value={node?.rethinkNote ?? ''} onChange={(event) => onNoteChange(event.target.value)} placeholder="Review exposure before reallocating" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 600, padding: 0 }} /></div>
      </CanvasSidebarFieldSection>
    </div>
  </aside>
}
