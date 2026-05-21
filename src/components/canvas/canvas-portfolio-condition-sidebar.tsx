import { CaretDown, Wallet } from '@phosphor-icons/react'
import { useMemo, useRef, useState } from 'react'

import type { CanvasIfComparator, CanvasNodeRecord, CanvasPortfolioMetric } from '../../state/canvas-node-store'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const metricOptions: Array<{ value: CanvasPortfolioMetric; label: string }> = [
  { value: 'cashPercent', label: 'Cash %' },
  { value: 'portfolioExposure', label: 'Portfolio Exposure %' },
  { value: 'openPositions', label: 'Open Positions' },
  { value: 'unrealizedPnl', label: 'Unrealized PnL %' },
  { value: 'drawdownPercent', label: 'Drawdown %' },
  { value: 'positionSizePercent', label: 'Position Size %' },
]

const comparatorOptions: Array<{ value: CanvasIfComparator; label: string }> = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '=', label: '=' },
]

export default function CanvasPortfolioConditionSidebar({ active, node, onClose, onMetricChange, onComparatorChange, onValueChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onMetricChange: (value: CanvasPortfolioMetric) => void; onComparatorChange: (value: CanvasIfComparator) => void; onValueChange: (value: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const metricTriggerRef = useRef<HTMLButtonElement | null>(null)
  const comparatorTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isMetricOpen, setIsMetricOpen] = useState(false)
  const [isComparatorOpen, setIsComparatorOpen] = useState(false)
  const selectedMetric = metricOptions.find((option) => option.value === node?.portfolioMetric) ?? metricOptions[0]
  const selectedComparator = comparatorOptions.find((option) => option.value === node?.portfolioComparator) ?? comparatorOptions[0]
  const metricGroups = useMemo(() => [{ items: metricOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedMetric.value, trailingIcon: option.value === selectedMetric.value ? '✓' : undefined })) }], [selectedMetric.value])
  const comparatorGroups = useMemo(() => [{ items: comparatorOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedComparator.value, trailingIcon: option.value === selectedComparator.value ? '✓' : undefined })) }], [selectedComparator.value])

  const closeAllMenus = () => {
    setIsMetricOpen(false)
    setIsComparatorOpen(false)
  }

  const toggleExclusiveMenu = (target: 'metric' | 'comparator') => {
    const nextOpen = target === 'metric' ? !isMetricOpen : !isComparatorOpen
    closeAllMenus()

    if (!nextOpen) {
      return
    }

    if (target === 'metric') {
      setIsMetricOpen(true)
      return
    }

    setIsComparatorOpen(true)
  }

  return <aside aria-hidden={!active} style={{ position: 'absolute', top: 72, left: 18, width: 280, minHeight: 188, maxHeight: 'calc(100vh - 164px)', borderRadius: 20, border: '1px solid var(--canvas-panel-divider)', background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)', boxShadow: '0 16px 40px var(--canvas-shadow-soft)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', pointerEvents: active ? 'auto' : 'none', opacity: active ? 1 : 0, transform: active ? 'translateX(0)' : 'translateX(-16px)', transition: 'opacity 180ms ease, transform 180ms ease', zIndex: 3 }}>
    <CanvasNodeSidebarHeader title="Portfolio Condition" description="Branches the flow using portfolio state instead of market-only signals." helpTitle="Portfolio Condition" helpBody="Use this node when the strategy should react to portfolio context such as cash, exposure, open positions, unrealized PnL, or drawdown." closeLabel="Close portfolio condition sidebar" onClose={onClose} />
    <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CanvasSidebarFieldSection title="Portfolio Metric" description="Choose which portfolio metric this node should evaluate.">
        <button ref={metricTriggerRef} type="button" onClick={() => toggleExclusiveMenu('metric')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}><span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ width: 28, height: 28, borderRadius: '999px', border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-dashboard-card-bg)', color: 'var(--canvas-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Wallet size={16} weight="fill" /></span><span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedMetric.label}</span></span><CaretDown size={14} weight="bold" style={{ color: 'var(--canvas-text-secondary)' }} /></button>
        {isMetricOpen ? <DropdownMenu open={isMetricOpen} anchorRef={metricTriggerRef} boundaryRef={containerRef} groups={metricGroups} position="bottom" portalToBody onItemClick={(item) => { onMetricChange(item.value as CanvasPortfolioMetric); setIsMetricOpen(false) }} /> : null}
      </CanvasSidebarFieldSection>
      <CanvasSidebarFieldSection title="Comparator" description="Choose how this portfolio metric should be evaluated.">
        <button ref={comparatorTriggerRef} type="button" onClick={() => toggleExclusiveMenu('comparator')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}><span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedComparator.label}</span><CaretDown size={14} weight="bold" style={{ color: 'var(--canvas-text-secondary)' }} /></button>
        {isComparatorOpen ? <DropdownMenu open={isComparatorOpen} anchorRef={comparatorTriggerRef} boundaryRef={containerRef} groups={comparatorGroups} position="bottom" portalToBody onItemClick={(item) => { onComparatorChange(item.value as CanvasIfComparator); setIsComparatorOpen(false) }} /> : null}
      </CanvasSidebarFieldSection>
      <CanvasSidebarFieldSection title="Target Value" description="Enter the value that should trigger this portfolio branch." showDivider={false}>
        <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}><input value={node?.portfolioValue ?? ''} onChange={(event) => onValueChange(event.target.value)} placeholder="20" inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} /></div>
      </CanvasSidebarFieldSection>
    </div>
  </aside>
}
