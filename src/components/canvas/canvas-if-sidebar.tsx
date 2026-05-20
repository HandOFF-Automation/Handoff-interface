import { CaretDown } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

import type { CanvasComparisonTargetType, CanvasIfComparator, CanvasIfFunction, CanvasNodeRecord } from '../../state/canvas-node-store'
import { CanvasAssetLogo } from './canvas-asset-options'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const ifFunctionOptions: Array<{ value: CanvasIfFunction; label: string }> = [
  { value: 'currentPrice', label: 'Current Price' },
  { value: 'currentMarketCap', label: 'Current Market Cap' },
  { value: 'volume', label: 'Volume' },
  { value: 'simpleMovingAverage', label: 'Simple Moving Average' },
  { value: 'exponentialMovingAverage', label: 'Exponential Moving Average' },
]

const comparatorOptions: Array<{ value: CanvasIfComparator; label: string }> = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '=', label: '=' },
]

const comparisonTargetOptions: Array<{ value: CanvasComparisonTargetType; label: string }> = [
  { value: 'value', label: 'Value' },
  { value: 'metric', label: 'Metric' },
]

type AssetOption = {
  id: string
  type: 'stock' | 'token'
  assetSymbol?: string
  assetName?: string
}

type CanvasIfSidebarProps = {
  active: boolean
  node: CanvasNodeRecord | null
  assetNodeOptions: AssetOption[]
  onClose: () => void
  onPrimaryFunctionChange: (value: CanvasIfFunction) => void
  onPrimaryAssetChange: (value: string) => void
  onComparatorChange: (value: CanvasIfComparator) => void
  onComparisonTargetTypeChange: (value: CanvasComparisonTargetType) => void
  onComparisonValueChange: (value: string) => void
  onSecondaryFunctionChange: (value: CanvasIfFunction) => void
  onSecondaryAssetChange: (value: string) => void
}

export default function CanvasIfSidebar({
  active,
  node,
  assetNodeOptions,
  onClose,
  onPrimaryFunctionChange,
  onPrimaryAssetChange,
  onComparatorChange,
  onComparisonTargetTypeChange,
  onComparisonValueChange,
  onSecondaryFunctionChange,
  onSecondaryAssetChange,
}: CanvasIfSidebarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const primaryFunctionTriggerRef = useRef<HTMLButtonElement | null>(null)
  const primaryAssetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const comparatorTriggerRef = useRef<HTMLButtonElement | null>(null)
  const comparisonTargetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const secondaryFunctionTriggerRef = useRef<HTMLButtonElement | null>(null)
  const secondaryAssetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isPrimaryFunctionOpen, setIsPrimaryFunctionOpen] = useState(false)
  const [isPrimaryAssetOpen, setIsPrimaryAssetOpen] = useState(false)
  const [isComparatorOpen, setIsComparatorOpen] = useState(false)
  const [isComparisonTargetOpen, setIsComparisonTargetOpen] = useState(false)
  const [isSecondaryFunctionOpen, setIsSecondaryFunctionOpen] = useState(false)
  const [isSecondaryAssetOpen, setIsSecondaryAssetOpen] = useState(false)

  const selectedPrimaryFunction = ifFunctionOptions.find((option) => option.value === node?.ifPrimaryFunction) ?? null
  const selectedPrimaryAsset = assetNodeOptions.find((option) => option.id === node?.ifPrimaryAssetNodeId) ?? null
  const selectedComparator = comparatorOptions.find((option) => option.value === node?.ifComparator) ?? null
  const selectedComparisonTarget = comparisonTargetOptions.find((option) => option.value === (node?.ifComparisonTargetType ?? 'metric')) ?? comparisonTargetOptions[1]
  const selectedSecondaryFunction = ifFunctionOptions.find((option) => option.value === node?.ifSecondaryFunction) ?? null
  const selectedSecondaryAsset = assetNodeOptions.find((option) => option.id === node?.ifSecondaryAssetNodeId) ?? null

  const functionMenuGroups = (selectedValue?: CanvasIfFunction | null) => [
    {
      items: ifFunctionOptions.map<DropdownMenuItem>((option) => ({
        label: option.label,
        value: option.value,
        active: option.value === selectedValue,
      })),
    },
  ]

  const assetMenuGroups = (selectedId?: string | null) => [
    {
      className: 'dropdownMenuScrollableGroup',
      style: {
        minHeight: 120,
        maxHeight: 220,
      },
      items: (assetNodeOptions.length > 0
        ? assetNodeOptions
        : [{ id: '', type: 'stock' as const, assetName: 'No asset nodes found', assetSymbol: '' }]
      ).map<DropdownMenuItem>((option) => ({
        label: option.assetName && option.assetSymbol ? `${option.assetName} ${option.assetSymbol}` : option.assetSymbol || option.assetName || 'Unnamed Asset',
        value: option.id,
        disabled: !option.id,
        active: option.id === selectedId,
        icon: option.id && option.assetSymbol ? <CanvasAssetLogo assetType={option.type} symbol={option.assetSymbol} size={20} /> : null,
      })),
    },
  ]

  const comparatorMenuGroups = [
    {
      items: comparatorOptions.map<DropdownMenuItem>((option) => ({
        label: option.label,
        value: option.value,
        active: option.value === selectedComparator?.value,
        trailingIcon: option.value === selectedComparator?.value ? '✓' : undefined,
      })),
    },
  ]

  const comparisonTargetMenuGroups = [
    {
      items: comparisonTargetOptions.map<DropdownMenuItem>((option) => ({
        label: option.label,
        value: option.value,
        active: option.value === selectedComparisonTarget.value,
        trailingIcon: option.value === selectedComparisonTarget.value ? '✓' : undefined,
      })),
    },
  ]

  const inputPrefix = node?.ifPrimaryFunction === 'currentPrice' || node?.ifPrimaryFunction === 'currentMarketCap'
    ? '$'
    : ''

  useEffect(() => {
    if (!active) {
      setIsPrimaryFunctionOpen(false)
      setIsPrimaryAssetOpen(false)
      setIsComparatorOpen(false)
      setIsComparisonTargetOpen(false)
      setIsSecondaryFunctionOpen(false)
      setIsSecondaryAssetOpen(false)
    }
  }, [active])

  useEffect(() => {
    if (!isPrimaryFunctionOpen && !isPrimaryAssetOpen && !isComparatorOpen && !isComparisonTargetOpen && !isSecondaryFunctionOpen && !isSecondaryAssetOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsPrimaryFunctionOpen(false)
      setIsPrimaryAssetOpen(false)
      setIsComparatorOpen(false)
      setIsComparisonTargetOpen(false)
      setIsSecondaryFunctionOpen(false)
      setIsSecondaryAssetOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isComparatorOpen, isComparisonTargetOpen, isPrimaryAssetOpen, isPrimaryFunctionOpen, isSecondaryAssetOpen, isSecondaryFunctionOpen])

  const renderDropdown = (
    triggerRef: React.RefObject<HTMLButtonElement | null>,
    isOpen: boolean,
    setOpen: (value: boolean | ((current: boolean) => boolean)) => void,
    label: string,
    groups: { items: DropdownMenuItem[]; style?: React.CSSProperties; className?: string }[],
    onItemClick: (value: string) => void,
  ) => (
    <div style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
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

        <CaretDown
          size={14}
          weight="bold"
          style={{
            color: 'var(--canvas-text-secondary)',
            flex: 'none',
            transform: `rotate(${isOpen ? '180deg' : '0deg'})`,
            transition: 'transform 160ms ease',
          }}
        />
      </button>

      {isOpen ? (
        <DropdownMenu
          open={isOpen}
          anchorRef={triggerRef}
          boundaryRef={containerRef}
          groups={groups}
          position="bottom"
          portalToBody
          style={{
            minHeight: 188,
            maxHeight: 320,
          }}
          onItemClick={(item) => {
            if (item.value) {
              onItemClick(item.value)
            }

            setOpen(false)
          }}
        />
      ) : null}
    </div>
  )

  return (
    <aside
      aria-hidden={!active}
      style={{
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
        pointerEvents: active ? 'auto' : 'none',
        opacity: active ? 1 : 0,
        transform: active ? 'translateX(0)' : 'translateX(-16px)',
        transition: 'opacity 180ms ease, transform 180ms ease',
        zIndex: 3,
      }}
    >
      <CanvasNodeSidebarHeader
        title="If Node"
        description="Adds a conditional branch to the strategy flow."
        helpTitle="If Node"
        helpBody="The If node compares two values and decides whether the strategy should continue down a conditional branch."
        closeLabel="Close if sidebar"
        onClose={onClose}
      />

      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Metric" description="Choose the primary metric used for this condition.">
          {renderDropdown(
            primaryFunctionTriggerRef,
            isPrimaryFunctionOpen,
            setIsPrimaryFunctionOpen,
            selectedPrimaryFunction?.label ?? 'Current Price',
            functionMenuGroups(selectedPrimaryFunction?.value ?? null),
            (value) => onPrimaryFunctionChange(value as CanvasIfFunction),
          )}
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Asset" description="Choose which connected asset should provide the primary metric.">
          {renderDropdown(
            primaryAssetTriggerRef,
            isPrimaryAssetOpen,
            setIsPrimaryAssetOpen,
            selectedPrimaryAsset?.assetName && selectedPrimaryAsset.assetSymbol
              ? `${selectedPrimaryAsset.assetName} ${selectedPrimaryAsset.assetSymbol}`
              : 'Select asset',
            assetMenuGroups(selectedPrimaryAsset?.id ?? null),
            onPrimaryAssetChange,
          )}
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Comparator" description="Choose how the primary metric should be compared.">
          {renderDropdown(
            comparatorTriggerRef,
            isComparatorOpen,
            setIsComparatorOpen,
            selectedComparator?.label ?? '>',
            comparatorMenuGroups,
            (value) => onComparatorChange(value as CanvasIfComparator),
          )}
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Compare Against" description="Choose whether to compare the metric against a manual value or another metric.">
          {renderDropdown(
            comparisonTargetTriggerRef,
            isComparisonTargetOpen,
            setIsComparisonTargetOpen,
            selectedComparisonTarget.label,
            comparisonTargetMenuGroups,
            (value) => onComparisonTargetTypeChange(value as CanvasComparisonTargetType),
          )}
        </CanvasSidebarFieldSection>

        {selectedComparisonTarget.value === 'value' ? (
          <CanvasSidebarFieldSection
            title="Value"
            description="Enter a manual threshold to compare against the selected metric."
            showDivider={false}
          >
            <div
              style={{
                minHeight: 54,
                borderRadius: 16,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'var(--canvas-surface-soft)',
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {inputPrefix ? (
                <span
                  style={{
                    color: 'var(--canvas-text-secondary)',
                    fontFamily: 'var(--canvas-font-sans)',
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1,
                    flex: 'none',
                  }}
                >
                  {inputPrefix}
                </span>
              ) : null}
              <input
                value={node?.ifComparisonValue ?? ''}
                onChange={(event) => onComparisonValueChange(event.target.value)}
                placeholder="Enter value"
                inputMode="decimal"
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--canvas-text-primary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 13,
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>
          </CanvasSidebarFieldSection>
        ) : null}

        {selectedComparisonTarget.value === 'metric' ? (
          <>
            <CanvasSidebarFieldSection title="Secondary Metric" description="Choose the comparison metric used on the right side of the condition.">
              {renderDropdown(
                secondaryFunctionTriggerRef,
                isSecondaryFunctionOpen,
                setIsSecondaryFunctionOpen,
                selectedSecondaryFunction?.label ?? 'Current Market Cap',
                functionMenuGroups(selectedSecondaryFunction?.value ?? null),
                (value) => onSecondaryFunctionChange(value as CanvasIfFunction),
              )}
            </CanvasSidebarFieldSection>

            <CanvasSidebarFieldSection title="Secondary Asset" description="Choose which connected asset should provide the comparison metric." showDivider={false}>
              {renderDropdown(
                secondaryAssetTriggerRef,
                isSecondaryAssetOpen,
                setIsSecondaryAssetOpen,
                selectedSecondaryAsset?.assetName && selectedSecondaryAsset.assetSymbol
                  ? `${selectedSecondaryAsset.assetName} ${selectedSecondaryAsset.assetSymbol}`
                  : 'Select asset',
                assetMenuGroups(selectedSecondaryAsset?.id ?? null),
                onSecondaryAssetChange,
              )}
            </CanvasSidebarFieldSection>
          </>
        ) : null}
      </div>

    </aside>
  )
}
