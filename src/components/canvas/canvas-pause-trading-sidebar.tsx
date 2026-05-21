import { CaretDown } from '@phosphor-icons/react'
import { useMemo, useRef, useState } from 'react'

import type { CanvasNodeRecord, CanvasPauseTradingMode, CanvasTimeUnit } from '../../state/canvas-node-store'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const modeOptions: Array<{ value: CanvasPauseTradingMode; label: string }> = [
  { value: 'duration', label: 'For Duration' },
  { value: 'untilCondition', label: 'Until Condition' },
]

const unitOptions: Array<{ value: CanvasTimeUnit; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

export default function CanvasPauseTradingSidebar({ active, node, onClose, onModeChange, onDurationChange, onUnitChange, onConditionChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onModeChange: (value: CanvasPauseTradingMode) => void; onDurationChange: (value: string) => void; onUnitChange: (value: CanvasTimeUnit) => void; onConditionChange: (value: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const modeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const unitTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isModeOpen, setIsModeOpen] = useState(false)
  const [isUnitOpen, setIsUnitOpen] = useState(false)
  const selectedMode = modeOptions.find((option) => option.value === node?.pauseTradingMode) ?? modeOptions[0]
  const selectedUnit = unitOptions.find((option) => option.value === node?.pauseTradingUnit) ?? unitOptions[0]
  const modeGroups = useMemo(() => [{ items: modeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedMode.value, trailingIcon: option.value === selectedMode.value ? '✓' : undefined })) }], [selectedMode.value])
  const unitGroups = useMemo(() => [{ items: unitOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedUnit.value, trailingIcon: option.value === selectedUnit.value ? '✓' : undefined })) }], [selectedUnit.value])

  const closeAllMenus = () => {
    setIsModeOpen(false)
    setIsUnitOpen(false)
  }

  const toggleExclusiveMenu = (target: 'mode' | 'unit') => {
    const nextOpen = target === 'mode' ? !isModeOpen : !isUnitOpen
    closeAllMenus()

    if (!nextOpen) {
      return
    }

    if (target === 'mode') {
      setIsModeOpen(true)
      return
    }

    setIsUnitOpen(true)
  }

  return <aside aria-hidden={!active} style={{ position: 'absolute', top: 72, left: 18, width: 280, minHeight: 188, maxHeight: 'calc(100vh - 164px)', borderRadius: 20, border: '1px solid var(--canvas-panel-divider)', background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)', boxShadow: '0 16px 40px var(--canvas-shadow-soft)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: active ? 'auto' : 'none', opacity: active ? 1 : 0, transform: active ? 'translateX(0)' : 'translateX(-16px)', transition: 'opacity 180ms ease, transform 180ms ease', zIndex: 3 }}>
    <CanvasNodeSidebarHeader title="Pause Trading" description="Temporarily holds this branch when trading should stop." helpTitle="Pause Trading" helpBody="Use Pause Trading when a branch should hold execution during events, unstable conditions, or portfolio stress before resuming." closeLabel="Close pause trading sidebar" onClose={onClose} />
    <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CanvasSidebarFieldSection title="Pause Mode" description="Choose whether this branch pauses for a duration or until a release condition is met.">
        <button ref={modeTriggerRef} type="button" onClick={() => toggleExclusiveMenu('mode')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}><span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedMode.label}</span><CaretDown size={14} weight="bold" /></button>
        {isModeOpen ? <DropdownMenu open={isModeOpen} anchorRef={modeTriggerRef} boundaryRef={containerRef} groups={modeGroups} position="bottom" portalToBody onItemClick={(item) => { onModeChange(item.value as CanvasPauseTradingMode); setIsModeOpen(false) }} /> : null}
      </CanvasSidebarFieldSection>
      {selectedMode.value === 'duration' ? <CanvasSidebarFieldSection title="Pause Duration" description="Enter how long this branch should remain paused.">
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center' }}>
            <input value={node?.pauseTradingDuration ?? ''} onChange={(event) => onDurationChange(event.target.value.replace(/[^0-9]/g, ''))} placeholder="3" inputMode="numeric" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} />
          </div>
          <div style={{ position: 'relative', width: 110 }}>
            <button ref={unitTriggerRef} type="button" onClick={() => toggleExclusiveMenu('unit')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}><span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedUnit.label}</span><CaretDown size={14} weight="bold" /></button>
            {isUnitOpen ? <DropdownMenu open={isUnitOpen} anchorRef={unitTriggerRef} boundaryRef={containerRef} groups={unitGroups} position="bottom" portalToBody onItemClick={(item) => { onUnitChange(item.value as CanvasTimeUnit); setIsUnitOpen(false) }} /> : null}
          </div>
        </div>
      </CanvasSidebarFieldSection> : <CanvasSidebarFieldSection title="Release Condition" description="Describe what needs to happen before this branch can start trading again.">
        <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '10px 14px', display: 'flex', alignItems: 'center' }}>
          <input value={node?.pauseTradingCondition ?? ''} onChange={(event) => onConditionChange(event.target.value)} placeholder="Resume when volatility cools down" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 600, padding: 0 }} />
        </div>
      </CanvasSidebarFieldSection>}
    </div>
  </aside>
}
