import { CaretDown } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

import type { CanvasComparisonTargetType, CanvasIfComparator, CanvasIfConditionType, CanvasIfCrossoverEvent, CanvasIfFunction, CanvasIfSourceType, CanvasNodeRecord } from '../../state/canvas-node-store'
import { CanvasAssetLogo } from './canvas-asset-options'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const conditionTypeOptions: Array<{ value: CanvasIfConditionType; label: string }> = [
  { value: 'threshold', label: 'Threshold' },
  { value: 'relative', label: 'Relative' },
  { value: 'crossover', label: 'Crossover' },
  { value: 'range', label: 'Range' },
  { value: 'advanced', label: 'Advanced' },
]

const ifFunctionOptions: Array<{ value: CanvasIfFunction; label: string }> = [
  { value: 'currentPrice', label: 'Current Price' },
  { value: 'currentMarketCap', label: 'Current Market Cap' },
  { value: 'volume', label: 'Volume' },
  { value: 'simpleMovingAverage', label: 'SMA' },
  { value: 'exponentialMovingAverage', label: 'EMA' },
  { value: 'rsi', label: 'RSI' },
  { value: 'macdLine', label: 'MACD Line' },
  { value: 'macdSignal', label: 'MACD Signal' },
  { value: 'macdHistogram', label: 'MACD Histogram' },
  { value: 'atr', label: 'ATR' },
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

const sourceTypeOptions: Array<{ value: CanvasIfSourceType; label: string }> = [
  { value: 'market', label: 'Market' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'position', label: 'Position' },
]

const crossoverEventOptions: Array<{ value: CanvasIfCrossoverEvent; label: string }> = [
  { value: 'crossesAbove', label: 'Crosses Above' },
  { value: 'crossesBelow', label: 'Crosses Below' },
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
  onSourceTypeChange: (value: CanvasIfSourceType) => void
  onConditionTypeChange: (value: CanvasIfConditionType) => void
  onPrimaryFunctionChange: (value: CanvasIfFunction) => void
  onPrimaryAssetChange: (value: string) => void
  onComparatorChange: (value: CanvasIfComparator) => void
  onComparisonTargetTypeChange: (value: CanvasComparisonTargetType) => void
  onComparisonValueChange: (value: string) => void
  onSecondaryFunctionChange: (value: CanvasIfFunction) => void
  onSecondaryAssetChange: (value: string) => void
  onPrimaryPeriodChange: (value: string) => void
  onSecondaryPeriodChange: (value: string) => void
  onRangeMinValueChange: (value: string) => void
  onRangeMaxValueChange: (value: string) => void
  onCrossoverEventChange: (value: CanvasIfCrossoverEvent) => void
}

function metricNeedsPeriod(value?: CanvasIfFunction) {
  return value === 'simpleMovingAverage' || value === 'exponentialMovingAverage' || value === 'rsi' || value === 'atr'
}

function metricValuePrefix(value?: CanvasIfFunction) {
  if (value === 'currentPrice' || value === 'currentMarketCap') {
    return '$'
  }

  return ''
}

export default function CanvasIfSidebar({
  active,
  node,
  assetNodeOptions,
  onClose,
  onSourceTypeChange,
  onConditionTypeChange,
  onPrimaryFunctionChange,
  onPrimaryAssetChange,
  onComparatorChange,
  onComparisonTargetTypeChange,
  onComparisonValueChange,
  onSecondaryFunctionChange,
  onSecondaryAssetChange,
  onPrimaryPeriodChange,
  onSecondaryPeriodChange,
  onRangeMinValueChange,
  onRangeMaxValueChange,
  onCrossoverEventChange,
}: CanvasIfSidebarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const conditionTypeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const primaryFunctionTriggerRef = useRef<HTMLButtonElement | null>(null)
  const primaryAssetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const comparatorTriggerRef = useRef<HTMLButtonElement | null>(null)
  const comparisonTargetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const secondaryFunctionTriggerRef = useRef<HTMLButtonElement | null>(null)
  const secondaryAssetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const crossoverEventTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isConditionTypeOpen, setIsConditionTypeOpen] = useState(false)
  const [isSourceTypeOpen, setIsSourceTypeOpen] = useState(false)
  const [isPrimaryFunctionOpen, setIsPrimaryFunctionOpen] = useState(false)
  const [isPrimaryAssetOpen, setIsPrimaryAssetOpen] = useState(false)
  const [isComparatorOpen, setIsComparatorOpen] = useState(false)
  const [isComparisonTargetOpen, setIsComparisonTargetOpen] = useState(false)
  const [isSecondaryFunctionOpen, setIsSecondaryFunctionOpen] = useState(false)
  const [isSecondaryAssetOpen, setIsSecondaryAssetOpen] = useState(false)
  const [isCrossoverEventOpen, setIsCrossoverEventOpen] = useState(false)

  const selectedConditionType = conditionTypeOptions.find((option) => option.value === (node?.ifConditionType ?? 'threshold')) ?? conditionTypeOptions[0]
  const selectedSourceType = sourceTypeOptions.find((option) => option.value === (node?.ifSourceType ?? 'market')) ?? sourceTypeOptions[0]
  const selectedPrimaryFunction = ifFunctionOptions.find((option) => option.value === node?.ifPrimaryFunction) ?? ifFunctionOptions[0]
  const selectedPrimaryAsset = assetNodeOptions.find((option) => option.id === node?.ifPrimaryAssetNodeId) ?? null
  const selectedComparator = comparatorOptions.find((option) => option.value === node?.ifComparator) ?? comparatorOptions[0]
  const selectedComparisonTarget = comparisonTargetOptions.find((option) => option.value === (node?.ifComparisonTargetType ?? 'metric')) ?? comparisonTargetOptions[1]
  const selectedSecondaryFunction = ifFunctionOptions.find((option) => option.value === node?.ifSecondaryFunction) ?? ifFunctionOptions[1]
  const selectedSecondaryAsset = assetNodeOptions.find((option) => option.id === node?.ifSecondaryAssetNodeId) ?? null
  const selectedCrossoverEvent = crossoverEventOptions.find((option) => option.value === (node?.ifCrossoverEvent ?? 'crossesAbove')) ?? crossoverEventOptions[0]

  const inputPrefix = metricValuePrefix(node?.ifPrimaryFunction)

  const functionMenuGroups = (selectedValue?: CanvasIfFunction | null) => [
    {
      items: ifFunctionOptions.map<DropdownMenuItem>((option) => ({
        label: option.label,
        value: option.value,
        active: option.value === selectedValue,
        trailingIcon: option.value === selectedValue ? '✓' : undefined,
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
        trailingIcon: option.id === selectedId ? '✓' : undefined,
      })),
    },
  ]

  const comparatorMenuGroups = [
    {
      items: comparatorOptions.map<DropdownMenuItem>((option) => ({
        label: option.label,
        value: option.value,
        active: option.value === selectedComparator.value,
        trailingIcon: option.value === selectedComparator.value ? '✓' : undefined,
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

  const conditionTypeMenuGroups = [
    {
      heading: 'Condition Type',
      items: conditionTypeOptions.map<DropdownMenuItem>((option) => ({
        label: option.label,
        value: option.value,
        active: option.value === selectedConditionType.value,
        trailingIcon: option.value === selectedConditionType.value ? '✓' : undefined,
      })),
    },
  ]

  const sourceTypeMenuGroups = [
    {
      heading: 'Condition Source',
      items: sourceTypeOptions.map<DropdownMenuItem>((option) => ({
        label: option.label,
        value: option.value,
        active: option.value === selectedSourceType.value,
        trailingIcon: option.value === selectedSourceType.value ? '✓' : undefined,
      })),
    },
  ]

  const crossoverEventGroups = [
    {
      heading: 'Crossover Event',
      items: crossoverEventOptions.map<DropdownMenuItem>((option) => ({
        label: option.label,
        value: option.value,
        active: option.value === selectedCrossoverEvent.value,
        trailingIcon: option.value === selectedCrossoverEvent.value ? '✓' : undefined,
      })),
    },
  ]

  useEffect(() => {
    if (!active) {
      setIsConditionTypeOpen(false)
      setIsSourceTypeOpen(false)
      setIsPrimaryFunctionOpen(false)
      setIsPrimaryAssetOpen(false)
      setIsComparatorOpen(false)
      setIsComparisonTargetOpen(false)
      setIsSecondaryFunctionOpen(false)
      setIsSecondaryAssetOpen(false)
      setIsCrossoverEventOpen(false)
    }
  }, [active])

  useEffect(() => {
    if (!isConditionTypeOpen && !isSourceTypeOpen && !isPrimaryFunctionOpen && !isPrimaryAssetOpen && !isComparatorOpen && !isComparisonTargetOpen && !isSecondaryFunctionOpen && !isSecondaryAssetOpen && !isCrossoverEventOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsConditionTypeOpen(false)
      setIsSourceTypeOpen(false)
      setIsPrimaryFunctionOpen(false)
      setIsPrimaryAssetOpen(false)
      setIsComparatorOpen(false)
      setIsComparisonTargetOpen(false)
      setIsSecondaryFunctionOpen(false)
      setIsSecondaryAssetOpen(false)
      setIsCrossoverEventOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isComparisonTargetOpen, isComparatorOpen, isConditionTypeOpen, isCrossoverEventOpen, isPrimaryAssetOpen, isPrimaryFunctionOpen, isSecondaryAssetOpen, isSecondaryFunctionOpen, isSourceTypeOpen])

  const renderDropdown = (
    triggerRef: React.RefObject<HTMLButtonElement | null>,
    isOpen: boolean,
    setOpen: (value: boolean | ((current: boolean) => boolean)) => void,
    label: string,
    groups: { heading?: string; items: DropdownMenuItem[]; style?: React.CSSProperties; className?: string }[],
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

  const renderTextInput = (
    value: string | undefined,
    placeholder: string,
    onChange: (value: string) => void,
    prefix?: string,
  ) => (
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
      {prefix ? (
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
          {prefix}
        </span>
      ) : null}
      <input
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
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
  )

  const selectedType = selectedConditionType.value

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
        description="Builds a stronger decision rule with typed strategy conditions."
        helpTitle="If Node"
        helpBody="The If node now supports threshold, relative, crossover, range, and advanced conditions so the strategy can express more natural trading logic."
        closeLabel="Close if sidebar"
        onClose={onClose}
      />

      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Condition Type" description="Choose the kind of decision rule this If node should evaluate.">
          {renderDropdown(
            conditionTypeTriggerRef,
            isConditionTypeOpen,
            setIsConditionTypeOpen,
            selectedConditionType.label,
            conditionTypeMenuGroups,
            (value) => onConditionTypeChange(value as CanvasIfConditionType),
          )}
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Condition Source" description="Choose whether this decision should read market, portfolio, or position context.">
          {renderDropdown(
            primaryAssetTriggerRef,
            isSourceTypeOpen,
            setIsSourceTypeOpen,
            selectedSourceType.label,
            sourceTypeMenuGroups,
            (value) => onSourceTypeChange(value as CanvasIfSourceType),
          )}
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Primary Metric" description="Choose the main indicator or metric for this condition.">
          {renderDropdown(
            primaryFunctionTriggerRef,
            isPrimaryFunctionOpen,
            setIsPrimaryFunctionOpen,
            selectedPrimaryFunction.label,
            functionMenuGroups(selectedPrimaryFunction.value),
            (value) => onPrimaryFunctionChange(value as CanvasIfFunction),
          )}
        </CanvasSidebarFieldSection>

        {metricNeedsPeriod(node?.ifPrimaryFunction) ? (
          <CanvasSidebarFieldSection title="Primary Period" description="Set the lookback period for indicators like RSI, SMA, EMA, or ATR.">
            {renderTextInput(node?.ifPrimaryPeriod, '14', onPrimaryPeriodChange)}
          </CanvasSidebarFieldSection>
        ) : null}

        <CanvasSidebarFieldSection title="Primary Asset" description="Choose which connected asset should provide the primary signal.">
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

        {selectedType === 'threshold' ? (
          <>
            <CanvasSidebarFieldSection title="Comparator" description="Choose how the primary metric should be compared against the threshold.">
              {renderDropdown(
                comparatorTriggerRef,
                isComparatorOpen,
                setIsComparatorOpen,
                selectedComparator.label,
                comparatorMenuGroups,
                (value) => onComparatorChange(value as CanvasIfComparator),
              )}
            </CanvasSidebarFieldSection>

            <CanvasSidebarFieldSection title="Threshold Value" description="Enter the numeric value that should trigger this branch." showDivider={false}>
              {renderTextInput(node?.ifComparisonValue, 'Enter threshold', onComparisonValueChange, inputPrefix)}
            </CanvasSidebarFieldSection>
          </>
        ) : null}

        {selectedType === 'relative' ? (
          <>
            <CanvasSidebarFieldSection title="Comparator" description="Compare the primary metric against another metric.">
              {renderDropdown(
                comparatorTriggerRef,
                isComparatorOpen,
                setIsComparatorOpen,
                selectedComparator.label,
                comparatorMenuGroups,
                (value) => onComparatorChange(value as CanvasIfComparator),
              )}
            </CanvasSidebarFieldSection>

            <CanvasSidebarFieldSection title="Secondary Metric" description="Choose the comparison metric that should sit on the right side of the rule.">
              {renderDropdown(
                secondaryFunctionTriggerRef,
                isSecondaryFunctionOpen,
                setIsSecondaryFunctionOpen,
                selectedSecondaryFunction.label,
                functionMenuGroups(selectedSecondaryFunction.value),
                (value) => onSecondaryFunctionChange(value as CanvasIfFunction),
              )}
            </CanvasSidebarFieldSection>

            {metricNeedsPeriod(node?.ifSecondaryFunction) ? (
              <CanvasSidebarFieldSection title="Secondary Period" description="Set the period for the comparison indicator when needed.">
                {renderTextInput(node?.ifSecondaryPeriod, '14', onSecondaryPeriodChange)}
              </CanvasSidebarFieldSection>
            ) : null}

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

        {selectedType === 'crossover' ? (
          <>
            <CanvasSidebarFieldSection title="Event" description="Choose whether the primary metric should cross above or below the comparison metric.">
              {renderDropdown(
                crossoverEventTriggerRef,
                isCrossoverEventOpen,
                setIsCrossoverEventOpen,
                selectedCrossoverEvent.label,
                crossoverEventGroups,
                (value) => onCrossoverEventChange(value as CanvasIfCrossoverEvent),
              )}
            </CanvasSidebarFieldSection>

            <CanvasSidebarFieldSection title="Secondary Metric" description="Choose the line or metric that the primary metric should cross.">
              {renderDropdown(
                secondaryFunctionTriggerRef,
                isSecondaryFunctionOpen,
                setIsSecondaryFunctionOpen,
                selectedSecondaryFunction.label,
                functionMenuGroups(selectedSecondaryFunction.value),
                (value) => onSecondaryFunctionChange(value as CanvasIfFunction),
              )}
            </CanvasSidebarFieldSection>

            {metricNeedsPeriod(node?.ifSecondaryFunction) ? (
              <CanvasSidebarFieldSection title="Secondary Period" description="Set the period for the secondary indicator when needed.">
                {renderTextInput(node?.ifSecondaryPeriod, '14', onSecondaryPeriodChange)}
              </CanvasSidebarFieldSection>
            ) : null}

            <CanvasSidebarFieldSection title="Secondary Asset" description="Choose which connected asset provides the comparison line." showDivider={false}>
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

        {selectedType === 'range' ? (
          <>
            <CanvasSidebarFieldSection title="Range Minimum" description="Enter the lower bound of the acceptable range.">
              {renderTextInput(node?.ifRangeMinValue, 'Min value', onRangeMinValueChange, inputPrefix)}
            </CanvasSidebarFieldSection>

            <CanvasSidebarFieldSection title="Range Maximum" description="Enter the upper bound of the acceptable range." showDivider={false}>
              {renderTextInput(node?.ifRangeMaxValue, 'Max value', onRangeMaxValueChange, inputPrefix)}
            </CanvasSidebarFieldSection>
          </>
        ) : null}

        {selectedType === 'advanced' ? (
          <>
            <CanvasSidebarFieldSection title="Compare Against" description="Use the legacy advanced compare mode for value or metric comparisons.">
              {renderDropdown(
                comparisonTargetTriggerRef,
                isComparisonTargetOpen,
                setIsComparisonTargetOpen,
                selectedComparisonTarget.label,
                comparisonTargetMenuGroups,
                (value) => onComparisonTargetTypeChange(value as CanvasComparisonTargetType),
              )}
            </CanvasSidebarFieldSection>

            <CanvasSidebarFieldSection title="Comparator" description="Choose how the primary metric should be compared.">
              {renderDropdown(
                comparatorTriggerRef,
                isComparatorOpen,
                setIsComparatorOpen,
                selectedComparator.label,
                comparatorMenuGroups,
                (value) => onComparatorChange(value as CanvasIfComparator),
              )}
            </CanvasSidebarFieldSection>

            {selectedComparisonTarget.value === 'value' ? (
              <CanvasSidebarFieldSection title="Value" description="Enter a manual threshold for the advanced comparison.">
                {renderTextInput(node?.ifComparisonValue, 'Enter value', onComparisonValueChange, inputPrefix)}
              </CanvasSidebarFieldSection>
            ) : null}

            {selectedComparisonTarget.value === 'metric' ? (
              <>
                <CanvasSidebarFieldSection title="Secondary Metric" description="Choose the comparison metric for advanced mode.">
                  {renderDropdown(
                    secondaryFunctionTriggerRef,
                    isSecondaryFunctionOpen,
                    setIsSecondaryFunctionOpen,
                    selectedSecondaryFunction.label,
                    functionMenuGroups(selectedSecondaryFunction.value),
                    (value) => onSecondaryFunctionChange(value as CanvasIfFunction),
                  )}
                </CanvasSidebarFieldSection>

                {metricNeedsPeriod(node?.ifSecondaryFunction) ? (
                  <CanvasSidebarFieldSection title="Secondary Period" description="Set the period for the secondary indicator when needed.">
                    {renderTextInput(node?.ifSecondaryPeriod, '14', onSecondaryPeriodChange)}
                  </CanvasSidebarFieldSection>
                ) : null}

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
          </>
        ) : null}
      </div>
    </aside>
  )
}
