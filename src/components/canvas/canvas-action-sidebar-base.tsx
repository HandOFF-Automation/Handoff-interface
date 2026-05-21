import { CaretDown } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'

import type { CanvasActionAmountMode, CanvasAllocateStyle, CanvasAllocateWeightingMode, CanvasBuyType, CanvasNodeRecord, CanvasRebalanceMode, CanvasRebalanceScope, CanvasRiskComparator, CanvasSellType, CanvasStopLossMode, CanvasTakeProfitMode } from '../../state/canvas-node-store'
import { CanvasAssetLogo } from './canvas-asset-options'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

type AssetOption = {
  id: string
  type: 'stock' | 'token'
  assetSymbol?: string
  assetName?: string
}

type DropdownGroup = { items: DropdownMenuItem[]; style?: CSSProperties; className?: string }

const sidebarShellStyle: CSSProperties = {
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
  zIndex: 3,
}

const actionAmountModeOptions: Array<{ value: CanvasActionAmountMode; label: string }> = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'value', label: 'Value' },
]

const buyTypeOptions: Array<{ value: CanvasBuyType; label: string }> = [
  { value: 'open', label: 'Open' },
  { value: 'add', label: 'Add' },
  { value: 'rotateInto', label: 'Rotate Into' },
]

const sellTypeOptions: Array<{ value: CanvasSellType; label: string }> = [
  { value: 'fullExit', label: 'Full Exit' },
  { value: 'reduce', label: 'Reduce' },
  { value: 'takePartial', label: 'Take Partial' },
]

const allocateWeightingModeOptions: Array<{ value: CanvasAllocateWeightingMode; label: string }> = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'value', label: 'Value' },
]

const allocateStyleOptions: Array<{ value: CanvasAllocateStyle; label: string }> = [
  { value: 'targetWeight', label: 'Target Weight' },
  { value: 'addExposure', label: 'Add Exposure' },
]

const rebalanceModeOptions: Array<{ value: CanvasRebalanceMode; label: string }> = [
  { value: 'equal', label: 'Equal' },
  { value: 'target', label: 'Target' },
]

const rebalanceScopeOptions: Array<{ value: CanvasRebalanceScope; label: string }> = [
  { value: 'branch', label: 'This Branch' },
  { value: 'selectedAssets', label: 'Selected Assets' },
  { value: 'portfolioSet', label: 'Portfolio Set' },
]

const riskComparatorOptions: Array<{ value: CanvasRiskComparator; label: string }> = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
]

const takeProfitModeOptions: Array<{ value: CanvasTakeProfitMode; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'partial', label: 'Partial' },
  { value: 'ladder', label: 'Ladder' },
]

const stopLossModeOptions: Array<{ value: CanvasStopLossMode; label: string }> = [
  { value: 'fixed', label: 'Fixed' },
  { value: 'trailing', label: 'Trailing' },
  { value: 'breakEven', label: 'Break-even' },
]

function BaseSidebar({ active, title, description, helpTitle, helpBody, closeLabel, onClose, children }: { active: boolean; title: string; description: string; helpTitle: string; helpBody: string; closeLabel: string; onClose: () => void; children: ReactNode }) {
  return (
    <aside
      aria-hidden={!active}
      style={{
        ...sidebarShellStyle,
        pointerEvents: active ? 'auto' : 'none',
        opacity: active ? 1 : 0,
        transform: active ? 'translateX(0)' : 'translateX(-16px)',
        transition: 'opacity 180ms ease, transform 180ms ease',
      }}
    >
      <CanvasNodeSidebarHeader title={title} description={description} helpTitle={helpTitle} helpBody={helpBody} closeLabel={closeLabel} onClose={onClose} />
      {children}
    </aside>
  )
}

function TriggerButton({ label, isOpen, triggerRef, onClick, leading }: { label: string; isOpen: boolean; triggerRef: RefObject<HTMLButtonElement | null>; onClick: () => void; leading?: ReactNode }) {
  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: 54,
        borderRadius: 16,
        border: '1px solid var(--canvas-panel-divider)',
        background: 'var(--canvas-surface-soft)',
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        cursor: 'pointer',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {leading}
        <span
          style={{
            color: 'var(--canvas-text-primary)',
            fontFamily: 'var(--canvas-font-sans)',
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </span>
      </span>
      <CaretDown size={14} weight="bold" style={{ color: 'var(--canvas-text-secondary)', flex: 'none', transform: `rotate(${isOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
    </button>
  )
}

function SidebarDropdown({ containerRef, triggerRef, isOpen, groups, label, onToggle, onItemClick, leading }: { containerRef: RefObject<HTMLDivElement | null>; triggerRef: RefObject<HTMLButtonElement | null>; isOpen: boolean; groups: DropdownGroup[]; label: string; onToggle: () => void; onItemClick: (value: string) => void; leading?: ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      <TriggerButton label={label} isOpen={isOpen} triggerRef={triggerRef} onClick={onToggle} leading={leading} />
      {isOpen ? (
        <DropdownMenu
          open={isOpen}
          anchorRef={triggerRef}
          boundaryRef={containerRef}
          groups={groups}
          position="bottom"
          portalToBody
          onItemClick={(item) => {
            if (item.value) {
              onItemClick(item.value)
            }
          }}
        />
      ) : null}
    </div>
  )
}

function useCloseOnOutside(active: boolean, containerRef: RefObject<HTMLDivElement | null>, closeAll: () => void, deps: boolean[]) {
  useEffect(() => {
    if (!active) {
      closeAll()
      return
    }

    if (!deps.some(Boolean)) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      closeAll()
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [active, closeAll, containerRef, ...deps])
}

function getAssetMenuGroups(assetNodeOptions: AssetOption[], selectedId?: string | null) {
  return [
    {
      className: 'dropdownMenuScrollableGroup',
      style: {
        minHeight: 120,
        maxHeight: 220,
      },
      items: (assetNodeOptions.length > 0 ? assetNodeOptions : [{ id: '', type: 'stock' as const, assetName: 'No asset nodes found', assetSymbol: '' }]).map<DropdownMenuItem>((option) => ({
        label: option.assetName && option.assetSymbol ? `${option.assetName} ${option.assetSymbol}` : option.assetSymbol || option.assetName || 'Unnamed Asset',
        value: option.id,
        disabled: !option.id,
        active: option.id === selectedId,
        icon: option.id && option.assetSymbol ? <CanvasAssetLogo assetType={option.type} symbol={option.assetSymbol} size={20} /> : null,
        trailingIcon: option.id === selectedId ? '✓' : undefined,
      })),
    },
  ]
}

function DropdownLeadingAsset({ option }: { option: AssetOption | null }) {
  if (!option?.assetSymbol) {
    return null
  }

  return <CanvasAssetLogo assetType={option.type} symbol={option.assetSymbol} size={28} />
}

export function CanvasTradeSidebar({ active, node, nodeTitle, nodeDescription, helpBody, actionLabel, assetNodeOptions, onClose, onAssetChange, onAmountModeChange, onAmountValueChange, onBehaviorChange }: { active: boolean; node: CanvasNodeRecord | null; nodeTitle: string; nodeDescription: string; helpBody: string; actionLabel: string; assetNodeOptions: AssetOption[]; onClose: () => void; onAssetChange: (value: string) => void; onAmountModeChange: (value: CanvasActionAmountMode) => void; onAmountValueChange: (value: string) => void; onBehaviorChange: (value: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const assetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const amountModeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const behaviorTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isAssetOpen, setIsAssetOpen] = useState(false)
  const [isAmountModeOpen, setIsAmountModeOpen] = useState(false)
  const [isBehaviorOpen, setIsBehaviorOpen] = useState(false)
  const selectedAsset = assetNodeOptions.find((option) => option.id === node?.actionAssetNodeId) ?? null
  const selectedAmountMode = actionAmountModeOptions.find((option) => option.value === node?.actionAmountMode) ?? actionAmountModeOptions[0]
  const behaviorOptions = actionLabel === 'Buy' ? buyTypeOptions : sellTypeOptions
  const selectedBehavior = actionLabel === 'Buy'
    ? buyTypeOptions.find((option) => option.value === node?.buyType) ?? buyTypeOptions[0]
    : sellTypeOptions.find((option) => option.value === node?.sellType) ?? sellTypeOptions[0]
  const amountPlaceholder = selectedAmountMode.value === 'percentage' ? '20' : '1000'

  const closeAll = () => {
    setIsAssetOpen(false)
    setIsAmountModeOpen(false)
    setIsBehaviorOpen(false)
  }

  useCloseOnOutside(active, containerRef, closeAll, [isAssetOpen, isAmountModeOpen, isBehaviorOpen])

  const amountModeGroups = useMemo(
    () => [{ items: actionAmountModeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedAmountMode.value, trailingIcon: option.value === selectedAmountMode.value ? '✓' : undefined })) }],
    [selectedAmountMode.value],
  )
  const behaviorGroups = useMemo(
    () => [{ items: behaviorOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedBehavior.value, trailingIcon: option.value === selectedBehavior.value ? '✓' : undefined })) }],
    [behaviorOptions, selectedBehavior.value],
  )

  return (
    <BaseSidebar active={active} title={nodeTitle} description={nodeDescription} helpTitle={nodeTitle} helpBody={helpBody} closeLabel={`Close ${actionLabel.toLowerCase()} sidebar`} onClose={onClose}>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Target Asset" description={`Choose which connected asset should execute on this branch when the ${actionLabel.toLowerCase()} step runs.`}>
          <SidebarDropdown containerRef={containerRef} triggerRef={assetTriggerRef} isOpen={isAssetOpen} groups={getAssetMenuGroups(assetNodeOptions, selectedAsset?.id ?? null)} label={selectedAsset?.assetName && selectedAsset.assetSymbol ? `${selectedAsset.assetName} ${selectedAsset.assetSymbol}` : 'Select asset'} leading={<DropdownLeadingAsset option={selectedAsset} />} onToggle={() => setIsAssetOpen((current) => !current)} onItemClick={(value) => { onAssetChange(value); setIsAssetOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Amount Mode" description="Choose whether this branch should execute with a percentage amount or a fixed value.">
          <SidebarDropdown containerRef={containerRef} triggerRef={amountModeTriggerRef} isOpen={isAmountModeOpen} groups={amountModeGroups} label={selectedAmountMode.label} onToggle={() => setIsAmountModeOpen((current) => !current)} onItemClick={(value) => { onAmountModeChange(value as CanvasActionAmountMode); setIsAmountModeOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title={`${actionLabel} Type`} description={`Choose how this branch should ${actionLabel.toLowerCase()} when it runs.`}>
          <SidebarDropdown containerRef={containerRef} triggerRef={behaviorTriggerRef} isOpen={isBehaviorOpen} groups={behaviorGroups} label={selectedBehavior.label} onToggle={() => setIsBehaviorOpen((current) => !current)} onItemClick={(value) => { onBehaviorChange(value); setIsBehaviorOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Amount" description={`Enter the ${selectedAmountMode.value === 'percentage' ? 'percentage' : 'value'} this branch should ${actionLabel.toLowerCase()}.`} showDivider={false}>
          <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>{selectedAmountMode.value === 'percentage' ? '%' : '$'}</span>
            <input value={node?.actionAmountValue ?? ''} onChange={(event) => onAmountValueChange(event.target.value)} placeholder={amountPlaceholder} inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} />
          </div>
        </CanvasSidebarFieldSection>
      </div>
    </BaseSidebar>
  )
}

export function CanvasRebalanceSidebarBase({ active, node, onClose, onModeChange, onThresholdChange, onScopeChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onModeChange: (value: CanvasRebalanceMode) => void; onThresholdChange: (value: string) => void; onScopeChange: (value: CanvasRebalanceScope) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const scopeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isScopeOpen, setIsScopeOpen] = useState(false)
  const selectedMode = rebalanceModeOptions.find((option) => option.value === node?.rebalanceMode) ?? rebalanceModeOptions[0]
  const selectedScope = rebalanceScopeOptions.find((option) => option.value === node?.rebalanceScope) ?? rebalanceScopeOptions[0]
  const groups = useMemo(
    () => [{ items: rebalanceModeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedMode.value, trailingIcon: option.value === selectedMode.value ? '✓' : undefined })) }],
    [selectedMode.value],
  )
  const scopeGroups = useMemo(
    () => [{ items: rebalanceScopeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedScope.value, trailingIcon: option.value === selectedScope.value ? '✓' : undefined })) }],
    [selectedScope.value],
  )
  const closeAll = () => {
    setIsOpen(false)
    setIsScopeOpen(false)
  }

  useCloseOnOutside(active, containerRef, closeAll, [isOpen, isScopeOpen])

  return (
    <BaseSidebar active={active} title="Rebalance Node" description="Resets allocations when this flow needs a portfolio rebalance step." helpTitle="Rebalance Node" helpBody="Use the rebalance node to show whether this step rebalances the current branch, selected assets, or a broader portfolio set." closeLabel="Close rebalance sidebar" onClose={onClose}>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Rebalance Mode" description="Choose whether this step should equalize holdings or move toward target weights.">
          <SidebarDropdown containerRef={containerRef} triggerRef={triggerRef} isOpen={isOpen} groups={groups} label={selectedMode.label} onToggle={() => setIsOpen((current) => !current)} onItemClick={(value) => { onModeChange(value as CanvasRebalanceMode); setIsOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Rebalance Scope" description="Choose what part of the strategy this rebalance step should describe.">
          <SidebarDropdown containerRef={containerRef} triggerRef={scopeTriggerRef} isOpen={isScopeOpen} groups={scopeGroups} label={selectedScope.label} onToggle={() => setIsScopeOpen((current) => !current)} onItemClick={(value) => { onScopeChange(value as CanvasRebalanceScope); setIsScopeOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Trigger Threshold" description="Enter the drift threshold that should trigger this branch rebalance." showDivider={false}>
          <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>%</span>
            <input value={node?.rebalanceThreshold ?? ''} onChange={(event) => onThresholdChange(event.target.value)} placeholder="5" inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} />
          </div>
        </CanvasSidebarFieldSection>
      </div>
    </BaseSidebar>
  )
}

export function CanvasAllocateSidebarBase({ active, node, onClose, onModeChange, onAmountValueChange, onStyleChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onModeChange: (value: CanvasAllocateWeightingMode) => void; onAmountValueChange: (value: string) => void; onStyleChange: (value: CanvasAllocateStyle) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const styleTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isStyleOpen, setIsStyleOpen] = useState(false)
  const selectedMode = allocateWeightingModeOptions.find((option) => option.value === node?.allocateWeightingMode) ?? allocateWeightingModeOptions[0]
  const selectedStyle = allocateStyleOptions.find((option) => option.value === node?.allocateStyle) ?? allocateStyleOptions[0]
  const groups = useMemo(
    () => [{ items: allocateWeightingModeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedMode.value, trailingIcon: option.value === selectedMode.value ? '✓' : undefined })) }],
    [selectedMode.value],
  )
  const styleGroups = useMemo(
    () => [{ items: allocateStyleOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedStyle.value, trailingIcon: option.value === selectedStyle.value ? '✓' : undefined })) }],
    [selectedStyle.value],
  )
  const closeAll = () => {
    setIsOpen(false)
    setIsStyleOpen(false)
  }

  useCloseOnOutside(active, containerRef, closeAll, [isOpen, isStyleOpen])

  return (
    <BaseSidebar active={active} title="Allocate Node" description="Applies an allocation decision inside the current flow." helpTitle="Allocate Node" helpBody="Use the allocate node to show whether this step sets a target weight or adds more exposure to the active flow." closeLabel="Close allocate sidebar" onClose={onClose}>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Weighting Mode" description="Choose whether this allocation uses a percentage or a fixed value.">
          <SidebarDropdown containerRef={containerRef} triggerRef={triggerRef} isOpen={isOpen} groups={groups} label={selectedMode.label} onToggle={() => setIsOpen((current) => !current)} onItemClick={(value) => { onModeChange(value as CanvasAllocateWeightingMode); setIsOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Allocation Style" description="Choose whether this step sets a target weight or adds more exposure.">
          <SidebarDropdown containerRef={containerRef} triggerRef={styleTriggerRef} isOpen={isStyleOpen} groups={styleGroups} label={selectedStyle.label} onToggle={() => setIsStyleOpen((current) => !current)} onItemClick={(value) => { onStyleChange(value as CanvasAllocateStyle); setIsStyleOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Amount" description="Enter how much this branch should allocate during this step." showDivider={false}>
          <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>{selectedMode.value === 'percentage' ? '%' : '$'}</span>
            <input value={node?.allocateAmountValue ?? ''} onChange={(event) => onAmountValueChange(event.target.value)} placeholder={selectedMode.value === 'percentage' ? '25' : '1000'} inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} />
          </div>
        </CanvasSidebarFieldSection>
      </div>
    </BaseSidebar>
  )
}

export function CanvasScaleOutSidebarBase({ active, node, onClose, onPercentChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onPercentChange: (value: string) => void }) {
  return (
    <BaseSidebar active={active} title="Scale Out Node" description="Gradually reduces exposure in the active flow by a percentage." helpTitle="Scale Out Node" helpBody="Use the scale out node for trim or de-risk steps where the strategy should reduce part of a position instead of exiting fully." closeLabel="Close scale out sidebar" onClose={onClose}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Reduce By" description="Enter how much of the position this branch should reduce." showDivider={false}>
          <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>%</span>
            <input value={node?.scaleOutPercent ?? ''} onChange={(event) => onPercentChange(event.target.value)} placeholder="10" inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} />
          </div>
        </CanvasSidebarFieldSection>
      </div>
    </BaseSidebar>
  )
}

export function CanvasRiskSidebarBase({ active, node, nodeTitle, nodeDescription, helpBody, assetNodeOptions, onClose, onAssetChange, onComparatorChange, onThresholdChange, onModeChange }: { active: boolean; node: CanvasNodeRecord | null; nodeTitle: string; nodeDescription: string; helpBody: string; assetNodeOptions: AssetOption[]; onClose: () => void; onAssetChange: (value: string) => void; onComparatorChange: (value: CanvasRiskComparator) => void; onThresholdChange: (value: string) => void; onModeChange: (value: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const assetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const comparatorTriggerRef = useRef<HTMLButtonElement | null>(null)
  const modeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isAssetOpen, setIsAssetOpen] = useState(false)
  const [isComparatorOpen, setIsComparatorOpen] = useState(false)
  const [isModeOpen, setIsModeOpen] = useState(false)
  const selectedAsset = assetNodeOptions.find((option) => option.id === node?.riskAssetNodeId) ?? null
  const selectedComparator = riskComparatorOptions.find((option) => option.value === node?.riskComparator) ?? riskComparatorOptions[0]
  const isTakeProfit = nodeTitle === 'Take Profit Node'
  const modeOptions = isTakeProfit ? takeProfitModeOptions : stopLossModeOptions
  const selectedMode = isTakeProfit ? takeProfitModeOptions.find((option) => option.value === node?.takeProfitMode) ?? takeProfitModeOptions[0] : stopLossModeOptions.find((option) => option.value === node?.stopLossMode) ?? stopLossModeOptions[0]
  const comparatorGroups = useMemo(
    () => [{ items: riskComparatorOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedComparator.value, trailingIcon: option.value === selectedComparator.value ? '✓' : undefined })) }],
    [selectedComparator.value],
  )
  const modeGroups = useMemo(
    () => [{ items: modeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedMode.value, trailingIcon: option.value === selectedMode.value ? '✓' : undefined })) }],
    [modeOptions, selectedMode.value],
  )
  const closeAll = () => {
    setIsAssetOpen(false)
    setIsComparatorOpen(false)
    setIsModeOpen(false)
  }

  useCloseOnOutside(active, containerRef, closeAll, [isAssetOpen, isComparatorOpen, isModeOpen])

  return (
    <BaseSidebar active={active} title={nodeTitle} description={nodeDescription} helpTitle={nodeTitle} helpBody={helpBody} closeLabel={`Close ${nodeTitle.toLowerCase()} sidebar`} onClose={onClose}>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Target Asset" description="Choose which connected asset this branch should watch for the risk condition.">
          <SidebarDropdown containerRef={containerRef} triggerRef={assetTriggerRef} isOpen={isAssetOpen} groups={getAssetMenuGroups(assetNodeOptions, selectedAsset?.id ?? null)} label={selectedAsset?.assetName && selectedAsset.assetSymbol ? `${selectedAsset.assetName} ${selectedAsset.assetSymbol}` : 'Select asset'} leading={<DropdownLeadingAsset option={selectedAsset} />} onToggle={() => setIsAssetOpen((current) => !current)} onItemClick={(value) => { onAssetChange(value); setIsAssetOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Comparator" description="Choose how this branch should compare the watched asset against the threshold.">
          <SidebarDropdown containerRef={containerRef} triggerRef={comparatorTriggerRef} isOpen={isComparatorOpen} groups={comparatorGroups} label={selectedComparator.label} onToggle={() => setIsComparatorOpen((current) => !current)} onItemClick={(value) => { onComparatorChange(value as CanvasRiskComparator); setIsComparatorOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Mode" description="Choose the response style this step should represent in the flow.">
          <SidebarDropdown containerRef={containerRef} triggerRef={modeTriggerRef} isOpen={isModeOpen} groups={modeGroups} label={selectedMode.label} onToggle={() => setIsModeOpen((current) => !current)} onItemClick={(value) => { onModeChange(value); setIsModeOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Threshold" description="Enter the threshold value that should trigger this branch risk response." showDivider={false}>
          <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>$</span>
            <input value={node?.riskThresholdValue ?? ''} onChange={(event) => onThresholdChange(event.target.value)} placeholder="100" inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} />
          </div>
        </CanvasSidebarFieldSection>
      </div>
    </BaseSidebar>
  )
}
