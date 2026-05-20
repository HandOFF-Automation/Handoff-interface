import { CaretDown } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'

import type { CanvasActionAmountMode, CanvasAllocateWeightingMode, CanvasNodeRecord, CanvasRebalanceMode, CanvasRiskComparator } from '../../state/canvas-node-store'
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

const allocateWeightingModeOptions: Array<{ value: CanvasAllocateWeightingMode; label: string }> = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'value', label: 'Value' },
]

const rebalanceModeOptions: Array<{ value: CanvasRebalanceMode; label: string }> = [
  { value: 'equal', label: 'Equal' },
  { value: 'target', label: 'Target' },
]

const riskComparatorOptions: Array<{ value: CanvasRiskComparator; label: string }> = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
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

export function CanvasTradeSidebar({ active, node, nodeTitle, nodeDescription, helpBody, actionLabel, assetNodeOptions, onClose, onAssetChange, onAmountModeChange, onAmountValueChange }: { active: boolean; node: CanvasNodeRecord | null; nodeTitle: string; nodeDescription: string; helpBody: string; actionLabel: string; assetNodeOptions: AssetOption[]; onClose: () => void; onAssetChange: (value: string) => void; onAmountModeChange: (value: CanvasActionAmountMode) => void; onAmountValueChange: (value: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const assetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const amountModeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isAssetOpen, setIsAssetOpen] = useState(false)
  const [isAmountModeOpen, setIsAmountModeOpen] = useState(false)
  const selectedAsset = assetNodeOptions.find((option) => option.id === node?.actionAssetNodeId) ?? null
  const selectedAmountMode = actionAmountModeOptions.find((option) => option.value === node?.actionAmountMode) ?? actionAmountModeOptions[0]
  const amountPlaceholder = selectedAmountMode.value === 'percentage' ? '20' : '1000'

  const closeAll = () => {
    setIsAssetOpen(false)
    setIsAmountModeOpen(false)
  }

  useCloseOnOutside(active, containerRef, closeAll, [isAssetOpen, isAmountModeOpen])

  const amountModeGroups = useMemo(
    () => [{ items: actionAmountModeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedAmountMode.value })) }],
    [selectedAmountMode.value],
  )

  return (
    <BaseSidebar active={active} title={nodeTitle} description={nodeDescription} helpTitle={nodeTitle} helpBody={helpBody} closeLabel={`Close ${actionLabel.toLowerCase()} sidebar`} onClose={onClose}>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Target Asset" description={`Choose which connected asset should be used for the ${actionLabel.toLowerCase()} action.`}>
          <SidebarDropdown containerRef={containerRef} triggerRef={assetTriggerRef} isOpen={isAssetOpen} groups={getAssetMenuGroups(assetNodeOptions, selectedAsset?.id ?? null)} label={selectedAsset?.assetName && selectedAsset.assetSymbol ? `${selectedAsset.assetName} ${selectedAsset.assetSymbol}` : 'Select asset'} leading={<DropdownLeadingAsset option={selectedAsset} />} onToggle={() => setIsAssetOpen((current) => !current)} onItemClick={(value) => { onAssetChange(value); setIsAssetOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Amount Mode" description="Choose whether the amount is entered as a percentage or a fixed value.">
          <SidebarDropdown containerRef={containerRef} triggerRef={amountModeTriggerRef} isOpen={isAmountModeOpen} groups={amountModeGroups} label={selectedAmountMode.label} onToggle={() => setIsAmountModeOpen((current) => !current)} onItemClick={(value) => { onAmountModeChange(value as CanvasActionAmountMode); setIsAmountModeOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Amount" description={`Enter the ${selectedAmountMode.value === 'percentage' ? 'percentage' : 'value'} to ${actionLabel.toLowerCase()}.`} showDivider={false}>
          <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>{selectedAmountMode.value === 'percentage' ? '%' : '$'}</span>
            <input value={node?.actionAmountValue ?? ''} onChange={(event) => onAmountValueChange(event.target.value)} placeholder={amountPlaceholder} inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} />
          </div>
        </CanvasSidebarFieldSection>
      </div>
    </BaseSidebar>
  )
}

export function CanvasRebalanceSidebarBase({ active, node, onClose, onModeChange, onThresholdChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onModeChange: (value: CanvasRebalanceMode) => void; onThresholdChange: (value: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const selectedMode = rebalanceModeOptions.find((option) => option.value === node?.rebalanceMode) ?? rebalanceModeOptions[0]
  const groups = useMemo(
    () => [{ items: rebalanceModeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedMode.value })) }],
    [selectedMode.value],
  )
  const closeAll = () => setIsOpen(false)

  useCloseOnOutside(active, containerRef, closeAll, [isOpen])

  return (
    <BaseSidebar active={active} title="Rebalance Node" description="Rebalances the portfolio using a simple mode-based rule." helpTitle="Rebalance Node" helpBody="The rebalance node lets the flow rebalance positions either equally or toward a target mode." closeLabel="Close rebalance sidebar" onClose={onClose}>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Rebalance Mode" description="Choose whether the rebalance should equalize holdings or use a target mode.">
          <SidebarDropdown containerRef={containerRef} triggerRef={triggerRef} isOpen={isOpen} groups={groups} label={selectedMode.label} onToggle={() => setIsOpen((current) => !current)} onItemClick={(value) => { onModeChange(value as CanvasRebalanceMode); setIsOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Trigger Threshold" description="Enter the drift threshold that should trigger the rebalance action." showDivider={false}>
          <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>%</span>
            <input value={node?.rebalanceThreshold ?? ''} onChange={(event) => onThresholdChange(event.target.value)} placeholder="5" inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} />
          </div>
        </CanvasSidebarFieldSection>
      </div>
    </BaseSidebar>
  )
}

export function CanvasAllocateSidebarBase({ active, node, onClose, onModeChange, onAmountValueChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onModeChange: (value: CanvasAllocateWeightingMode) => void; onAmountValueChange: (value: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const selectedMode = allocateWeightingModeOptions.find((option) => option.value === node?.allocateWeightingMode) ?? allocateWeightingModeOptions[0]
  const groups = useMemo(
    () => [{ items: allocateWeightingModeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedMode.value })) }],
    [selectedMode.value],
  )
  const closeAll = () => setIsOpen(false)

  useCloseOnOutside(active, containerRef, closeAll, [isOpen])

  return (
    <BaseSidebar active={active} title="Allocate Node" description="Applies a simple allocation amount to the portfolio flow." helpTitle="Allocate Node" helpBody="The allocate node applies either a percentage-based or value-based allocation in the current flow." closeLabel="Close allocate sidebar" onClose={onClose}>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Weighting Mode" description="Choose whether the allocation uses a percentage or an absolute value.">
          <SidebarDropdown containerRef={containerRef} triggerRef={triggerRef} isOpen={isOpen} groups={groups} label={selectedMode.label} onToggle={() => setIsOpen((current) => !current)} onItemClick={(value) => { onModeChange(value as CanvasAllocateWeightingMode); setIsOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Amount" description="Enter the allocation amount for this step." showDivider={false}>
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
    <BaseSidebar active={active} title="Scale Out Node" description="Gradually reduces the position size by a percentage." helpTitle="Scale Out Node" helpBody="The scale out node reduces exposure by a simple percentage-based amount." closeLabel="Close scale out sidebar" onClose={onClose}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Reduce By" description="Enter how much of the position should be reduced." showDivider={false}>
          <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>%</span>
            <input value={node?.scaleOutPercent ?? ''} onChange={(event) => onPercentChange(event.target.value)} placeholder="10" inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} />
          </div>
        </CanvasSidebarFieldSection>
      </div>
    </BaseSidebar>
  )
}

export function CanvasRiskSidebarBase({ active, node, nodeTitle, nodeDescription, helpBody, assetNodeOptions, onClose, onAssetChange, onComparatorChange, onThresholdChange }: { active: boolean; node: CanvasNodeRecord | null; nodeTitle: string; nodeDescription: string; helpBody: string; assetNodeOptions: AssetOption[]; onClose: () => void; onAssetChange: (value: string) => void; onComparatorChange: (value: CanvasRiskComparator) => void; onThresholdChange: (value: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const assetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const comparatorTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isAssetOpen, setIsAssetOpen] = useState(false)
  const [isComparatorOpen, setIsComparatorOpen] = useState(false)
  const selectedAsset = assetNodeOptions.find((option) => option.id === node?.riskAssetNodeId) ?? null
  const selectedComparator = riskComparatorOptions.find((option) => option.value === node?.riskComparator) ?? riskComparatorOptions[0]
  const comparatorGroups = useMemo(
    () => [{ items: riskComparatorOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedComparator.value })) }],
    [selectedComparator.value],
  )
  const closeAll = () => {
    setIsAssetOpen(false)
    setIsComparatorOpen(false)
  }

  useCloseOnOutside(active, containerRef, closeAll, [isAssetOpen, isComparatorOpen])

  return (
    <BaseSidebar active={active} title={nodeTitle} description={nodeDescription} helpTitle={nodeTitle} helpBody={helpBody} closeLabel={`Close ${nodeTitle.toLowerCase()} sidebar`} onClose={onClose}>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Target Asset" description="Choose which connected asset should be watched for this condition.">
          <SidebarDropdown containerRef={containerRef} triggerRef={assetTriggerRef} isOpen={isAssetOpen} groups={getAssetMenuGroups(assetNodeOptions, selectedAsset?.id ?? null)} label={selectedAsset?.assetName && selectedAsset.assetSymbol ? `${selectedAsset.assetName} ${selectedAsset.assetSymbol}` : 'Select asset'} leading={<DropdownLeadingAsset option={selectedAsset} />} onToggle={() => setIsAssetOpen((current) => !current)} onItemClick={(value) => { onAssetChange(value); setIsAssetOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Comparator" description="Choose how the asset threshold should be compared.">
          <SidebarDropdown containerRef={containerRef} triggerRef={comparatorTriggerRef} isOpen={isComparatorOpen} groups={comparatorGroups} label={selectedComparator.label} onToggle={() => setIsComparatorOpen((current) => !current)} onItemClick={(value) => { onComparatorChange(value as CanvasRiskComparator); setIsComparatorOpen(false) }} />
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Threshold" description="Enter the threshold value for this risk condition." showDivider={false}>
          <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>$</span>
            <input value={node?.riskThresholdValue ?? ''} onChange={(event) => onThresholdChange(event.target.value)} placeholder="100" inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} />
          </div>
        </CanvasSidebarFieldSection>
      </div>
    </BaseSidebar>
  )
}
