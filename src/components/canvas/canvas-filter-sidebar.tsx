import { CaretDown, FunnelSimple } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { CanvasFilterConditionOperator, CanvasFilterOrdering, CanvasFilterResultMode, CanvasFilterSortFunction, CanvasNodeRecord } from '../../state/canvas-node-store'
import { CanvasAssetLogo } from './canvas-asset-options'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const sortFunctionOptions: Array<{ value: CanvasFilterSortFunction; label: string }> = [
  { value: 'currentPrice', label: 'Current Price' },
  { value: 'currentMarketCap', label: 'Current Market Cap' },
  { value: 'volume', label: 'Volume' },
  { value: 'percentGain', label: 'Percent Gain' },
  { value: 'simpleMovingAverage', label: 'SMA' },
  { value: 'exponentialMovingAverage', label: 'EMA' },
  { value: 'rsi', label: 'RSI' },
  { value: 'macdHistogram', label: 'MACD Histogram' },
  { value: 'atr', label: 'ATR' },
]

function filterMetricNeedsPeriod(value?: CanvasFilterSortFunction) {
  return value === 'simpleMovingAverage' || value === 'exponentialMovingAverage' || value === 'rsi' || value === 'atr'
}

const orderingOptions: Array<{ value: CanvasFilterOrdering; label: string }> = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
]

const conditionOperatorOptions: Array<{ value: CanvasFilterConditionOperator; label: string }> = [
  { value: 'and', label: 'AND' },
  { value: 'or', label: 'OR' },
]

const resultModeOptions: Array<{ value: CanvasFilterResultMode; label: string }> = [
  { value: 'topOne', label: 'Top 1' },
  { value: 'topN', label: 'Top N' },
  { value: 'allMatches', label: 'All Matches' },
]

type CanvasFilterSidebarProps = {
  active: boolean
  node: CanvasNodeRecord | null
  incomingAssetNodeOptions: Array<{
    id: string
    type: 'stock' | 'token' | 'assetBasket'
    assetSymbol?: string
    assetName?: string
  }>
  onClose: () => void
  onAssetNodeChange: (value: string) => void
  onSortFunctionChange: (value: CanvasFilterSortFunction) => void
  onSecondarySortFunctionChange: (value: CanvasFilterSortFunction) => void
  onConditionOperatorChange: (value: CanvasFilterConditionOperator) => void
  onOrderingChange: (value: CanvasFilterOrdering) => void
  onHowManyChange: (value: string) => void
  onSortPeriodChange: (value: string) => void
  onSecondarySortPeriodChange: (value: string) => void
  onResultModeChange: (value: CanvasFilterResultMode) => void
}

export default function CanvasFilterSidebar({ active, node, incomingAssetNodeOptions, onClose, onAssetNodeChange, onSortFunctionChange, onSecondarySortFunctionChange, onConditionOperatorChange, onOrderingChange, onHowManyChange, onSortPeriodChange, onSecondarySortPeriodChange, onResultModeChange }: CanvasFilterSidebarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const assetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const sortTriggerRef = useRef<HTMLButtonElement | null>(null)
  const secondarySortTriggerRef = useRef<HTMLButtonElement | null>(null)
  const orderingTriggerRef = useRef<HTMLButtonElement | null>(null)
  const conditionOperatorTriggerRef = useRef<HTMLButtonElement | null>(null)
  const resultModeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isAssetMenuOpen, setIsAssetMenuOpen] = useState(false)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const [isSecondarySortMenuOpen, setIsSecondarySortMenuOpen] = useState(false)
  const [isOrderingMenuOpen, setIsOrderingMenuOpen] = useState(false)
  const [isConditionOperatorMenuOpen, setIsConditionOperatorMenuOpen] = useState(false)
  const [isResultModeOpen, setIsResultModeOpen] = useState(false)
  const selectedAssetNode = incomingAssetNodeOptions.find((option) => option.id === node?.filterAssetNodeId) ?? null
  const selectedSortFunction = sortFunctionOptions.find((option) => option.value === node?.filterSortFunction) ?? null
  const selectedSecondarySortFunction = sortFunctionOptions.find((option) => option.value === node?.filterSecondarySortFunction) ?? null
  const selectedConditionOperator = conditionOperatorOptions.find((option) => option.value === node?.filterConditionOperator) ?? null
  const selectedOrdering = orderingOptions.find((option) => option.value === node?.filterOrdering) ?? null
  const selectedResultMode = resultModeOptions.find((option) => option.value === node?.filterResultMode) ?? resultModeOptions[1]
  const closeAllMenus = () => {
    setIsAssetMenuOpen(false)
    setIsSortMenuOpen(false)
    setIsSecondarySortMenuOpen(false)
    setIsOrderingMenuOpen(false)
    setIsConditionOperatorMenuOpen(false)
    setIsResultModeOpen(false)
  }

  const toggleExclusiveMenu = (target: 'asset' | 'sort' | 'secondarySort' | 'ordering' | 'conditionOperator' | 'resultMode') => {
    const nextOpen = target === 'asset'
      ? !isAssetMenuOpen
      : target === 'sort'
        ? !isSortMenuOpen
        : target === 'secondarySort'
          ? !isSecondarySortMenuOpen
        : target === 'ordering'
          ? !isOrderingMenuOpen
          : target === 'conditionOperator'
            ? !isConditionOperatorMenuOpen
            : !isResultModeOpen
    closeAllMenus()

    if (!nextOpen) {
      return
    }

    if (target === 'asset') {
      setIsAssetMenuOpen(true)
      return
    }

    if (target === 'sort') {
      setIsSortMenuOpen(true)
      return
    }

    if (target === 'secondarySort') {
      setIsSecondarySortMenuOpen(true)
      return
    }

    if (target === 'ordering') {
      setIsOrderingMenuOpen(true)
      return
    }

    if (target === 'conditionOperator') {
      setIsConditionOperatorMenuOpen(true)
      return
    }

    setIsResultModeOpen(true)
  }
  const assetMenuGroups = useMemo(
    () => [
      {
        className: 'dropdownMenuScrollableGroup',
        style: {
          minHeight: 120,
          maxHeight: 220,
        },
        items: (incomingAssetNodeOptions.length > 0
          ? incomingAssetNodeOptions
          : [{ id: '', type: 'stock' as const, assetName: 'No incoming assets', assetSymbol: '' }]
        ).map<DropdownMenuItem>((option) => ({
          label: option.assetName && option.assetSymbol ? `${option.assetName} ${option.assetSymbol}` : option.assetSymbol || option.assetName || 'Unnamed Asset',
          value: option.id,
          disabled: !option.id,
          active: option.id === selectedAssetNode?.id,
          icon: option.id && option.assetSymbol ? <CanvasAssetLogo assetType={option.type} symbol={option.assetSymbol} size={20} /> : null,
          trailingIcon: option.id === selectedAssetNode?.id ? '✓' : undefined,
        })),
      },
    ],
    [incomingAssetNodeOptions, selectedAssetNode?.id],
  )
  const sortMenuGroups = useMemo(
    () => [
      {
        items: sortFunctionOptions.map<DropdownMenuItem>((option) => ({
          label: option.label,
          value: option.value,
          active: option.value === selectedSortFunction?.value,
          trailingIcon: option.value === selectedSortFunction?.value ? '✓' : undefined,
        })),
      },
    ],
    [selectedSortFunction?.value],
  )
  const orderingMenuGroups = useMemo(
    () => [
      {
        items: orderingOptions.map<DropdownMenuItem>((option) => ({
          label: option.label,
          value: option.value,
          active: option.value === selectedOrdering?.value,
          trailingIcon: option.value === selectedOrdering?.value ? '✓' : undefined,
        })),
      },
    ],
    [selectedOrdering?.value],
  )
  const conditionOperatorMenuGroups = useMemo(
    () => [
      {
        items: conditionOperatorOptions.map<DropdownMenuItem>((option) => ({
          label: option.label,
          value: option.value,
          active: option.value === selectedConditionOperator?.value,
          trailingIcon: option.value === selectedConditionOperator?.value ? '✓' : undefined,
        })),
      },
    ],
    [selectedConditionOperator?.value],
  )
  const resultModeMenuGroups = useMemo(
    () => [
      {
        items: resultModeOptions.map<DropdownMenuItem>((option) => ({
          label: option.label,
          value: option.value,
          active: option.value === selectedResultMode?.value,
          trailingIcon: option.value === selectedResultMode?.value ? '✓' : undefined,
        })),
      },
    ],
    [selectedResultMode?.value],
  )

  useEffect(() => {
    if (!active) {
      setIsAssetMenuOpen(false)
      setIsSortMenuOpen(false)
      setIsSecondarySortMenuOpen(false)
      setIsOrderingMenuOpen(false)
      setIsConditionOperatorMenuOpen(false)
      setIsResultModeOpen(false)
    }
  }, [active])

  useEffect(() => {
    if (!isAssetMenuOpen && !isSortMenuOpen && !isSecondarySortMenuOpen && !isOrderingMenuOpen && !isConditionOperatorMenuOpen && !isResultModeOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsAssetMenuOpen(false)
      setIsSortMenuOpen(false)
      setIsSecondarySortMenuOpen(false)
      setIsOrderingMenuOpen(false)
      setIsConditionOperatorMenuOpen(false)
      setIsResultModeOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isAssetMenuOpen, isConditionOperatorMenuOpen, isOrderingMenuOpen, isSecondarySortMenuOpen, isSortMenuOpen, isResultModeOpen])

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
        title="Filter Node"
        description="Ranks and narrows connected assets before the flow continues."
        helpTitle="Filter Node"
        helpBody="The Filter node works on the assets connected into it. Use this panel to define ranking rules for each connected asset view and decide what results should continue downstream."
        closeLabel="Close filter sidebar"
        onClose={onClose}
      />

      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Asset View" description="Choose which connected asset view you are editing inside this Filter node.">
        <div style={{ position: 'relative' }}>
          <button
            ref={assetTriggerRef}
            type="button"
            onClick={() => toggleExclusiveMenu('asset')}
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
              {selectedAssetNode?.assetSymbol ? <CanvasAssetLogo assetType={selectedAssetNode.type} symbol={selectedAssetNode.assetSymbol} size={28} /> : null}
              <span
                style={{
                  color: 'var(--canvas-text-primary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {selectedAssetNode
                  ? selectedAssetNode.assetName && selectedAssetNode.assetSymbol
                    ? `${selectedAssetNode.assetName} ${selectedAssetNode.assetSymbol}`
                    : selectedAssetNode.assetSymbol ?? selectedAssetNode.assetName ?? 'Select incoming asset'
                  : 'Select incoming asset'}
              </span>
            </span>

            <CaretDown
              size={14}
              weight="bold"
              style={{
                color: 'var(--canvas-text-secondary)',
                flex: 'none',
                transform: `rotate(${isAssetMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
              }}
            />
          </button>

          {isAssetMenuOpen ? (
            <DropdownMenu
              open={isAssetMenuOpen}
              anchorRef={assetTriggerRef}
              boundaryRef={containerRef}
              groups={assetMenuGroups}
              position="bottom"
              portalToBody
              style={{
                minHeight: 188,
                maxHeight: 320,
              }}
              onItemClick={(item) => {
                if (item.value) {
                  onAssetNodeChange(item.value)
                }

                setIsAssetMenuOpen(false)
              }}
            />
          ) : null}
        </div>
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Primary Rule" description="Choose the main metric used to rank connected assets in this view.">
        <div style={{ position: 'relative' }}>
          <button
            ref={sortTriggerRef}
            type="button"
            onClick={() => toggleExclusiveMenu('sort')}
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
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '999px',
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'var(--canvas-dashboard-card-bg)',
                  color: 'var(--canvas-accent)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <FunnelSimple size={16} weight="fill" />
              </span>
              <span
                style={{
                  color: 'var(--canvas-text-primary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                 {selectedSortFunction?.label ?? 'Select primary rule'}
              </span>
            </span>

            <CaretDown
              size={14}
              weight="bold"
              style={{
                color: 'var(--canvas-text-secondary)',
                flex: 'none',
                transform: `rotate(${isSortMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
              }}
            />
          </button>

          {isSortMenuOpen ? (
              <DropdownMenu
                open={isSortMenuOpen}
                anchorRef={sortTriggerRef}
                boundaryRef={containerRef}
                groups={sortMenuGroups}
                position="bottom"
                portalToBody
                onItemClick={(item) => {
                if (item.value === 'currentPrice' || item.value === 'currentMarketCap' || item.value === 'volume' || item.value === 'percentGain' || item.value === 'simpleMovingAverage' || item.value === 'exponentialMovingAverage' || item.value === 'rsi' || item.value === 'macdHistogram' || item.value === 'atr') {
                  onSortFunctionChange(item.value)
                }

                setIsSortMenuOpen(false)
              }}
            />
          ) : null}
        </div>
        </CanvasSidebarFieldSection>

        {filterMetricNeedsPeriod(node?.filterSortFunction) ? (
          <CanvasSidebarFieldSection title="Primary rule period" description="Set the lookback period for the main filter rule when needed.">
            <div
              style={{
                minHeight: 54,
                borderRadius: 16,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'var(--canvas-surface-soft)',
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                inputMode="numeric"
                value={node?.filterSortPeriod ?? ''}
                onChange={(event) => {
                  const sanitizedValue = event.target.value.replace(/[^0-9]/g, '')
                  onSortPeriodChange(sanitizedValue)
                }}
                placeholder="14"
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--canvas-text-primary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 13,
                  fontWeight: 700,
                  padding: 0,
                }}
              />
            </div>
          </CanvasSidebarFieldSection>
        ) : null}

        <CanvasSidebarFieldSection title="Rule operator" description="Choose how the secondary rule should combine with the primary rule.">
        <div style={{ position: 'relative' }}>
          <button
            ref={conditionOperatorTriggerRef}
            type="button"
            onClick={() => toggleExclusiveMenu('conditionOperator')}
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
              }}
            >
              {selectedConditionOperator?.label ?? 'AND'}
            </span>

            <CaretDown
              size={14}
              weight="bold"
              style={{
                color: 'var(--canvas-text-secondary)',
                flex: 'none',
                transform: `rotate(${isConditionOperatorMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
              }}
            />
          </button>

          {isConditionOperatorMenuOpen ? (
            <DropdownMenu
              open={isConditionOperatorMenuOpen}
              anchorRef={conditionOperatorTriggerRef}
              boundaryRef={containerRef}
              groups={conditionOperatorMenuGroups}
              position="bottom"
              portalToBody
              onItemClick={(item) => {
                if (item.value === 'and' || item.value === 'or') {
                  onConditionOperatorChange(item.value)
                }

                setIsConditionOperatorMenuOpen(false)
              }}
            />
          ) : null}
        </div>
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Secondary rule" description="Optionally add one more filter metric to combine with the primary rule.">
        <div style={{ position: 'relative' }}>
          <button
            ref={secondarySortTriggerRef}
            type="button"
            onClick={() => toggleExclusiveMenu('secondarySort')}
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
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '999px',
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'var(--canvas-dashboard-card-bg)',
                  color: 'var(--canvas-accent)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <FunnelSimple size={16} weight="fill" />
              </span>
              <span
                style={{
                  color: 'var(--canvas-text-primary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {selectedSecondarySortFunction?.label ?? 'Select secondary rule'}
              </span>
            </span>

            <CaretDown
              size={14}
              weight="bold"
              style={{
                color: 'var(--canvas-text-secondary)',
                flex: 'none',
                transform: `rotate(${isSecondarySortMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
              }}
            />
          </button>

          {isSecondarySortMenuOpen ? (
            <DropdownMenu
              open={isSecondarySortMenuOpen}
              anchorRef={secondarySortTriggerRef}
              boundaryRef={containerRef}
              groups={sortMenuGroups}
              position="bottom"
              portalToBody
              onItemClick={(item) => {
                if (item.value === 'currentPrice' || item.value === 'currentMarketCap' || item.value === 'volume' || item.value === 'percentGain' || item.value === 'simpleMovingAverage' || item.value === 'exponentialMovingAverage' || item.value === 'rsi' || item.value === 'macdHistogram' || item.value === 'atr') {
                  onSecondarySortFunctionChange(item.value)
                }

                setIsSecondarySortMenuOpen(false)
              }}
            />
          ) : null}
        </div>
        </CanvasSidebarFieldSection>

        {filterMetricNeedsPeriod(node?.filterSecondarySortFunction) ? (
          <CanvasSidebarFieldSection title="Secondary rule period" description="Set the lookback period for the secondary rule when needed.">
            <div
              style={{
                minHeight: 54,
                borderRadius: 16,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'var(--canvas-surface-soft)',
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                inputMode="numeric"
                value={node?.filterSecondarySortPeriod ?? ''}
                onChange={(event) => {
                  const sanitizedValue = event.target.value.replace(/[^0-9]/g, '')
                  onSecondarySortPeriodChange(sanitizedValue)
                }}
                placeholder="14"
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--canvas-text-primary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 13,
                  fontWeight: 700,
                  padding: 0,
                }}
              />
            </div>
          </CanvasSidebarFieldSection>
        ) : null}

        <CanvasSidebarFieldSection title="Keep results" description="Choose whether the flow keeps the top or bottom ranked assets after applying the rules.">
        <div style={{ position: 'relative' }}>
          <button
            ref={orderingTriggerRef}
            type="button"
            onClick={() => toggleExclusiveMenu('ordering')}
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
              }}
            >
              {selectedOrdering?.label ?? 'Select ordering function'}
            </span>

            <CaretDown
              size={14}
              weight="bold"
              style={{
                color: 'var(--canvas-text-secondary)',
                flex: 'none',
                transform: `rotate(${isOrderingMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
              }}
            />
          </button>

          {isOrderingMenuOpen ? (
              <DropdownMenu
                open={isOrderingMenuOpen}
                anchorRef={orderingTriggerRef}
                boundaryRef={containerRef}
                groups={orderingMenuGroups}
                position="bottom"
                portalToBody
                onItemClick={(item) => {
                if (item.value === 'top' || item.value === 'bottom') {
                  onOrderingChange(item.value)
                }

                setIsOrderingMenuOpen(false)
              }}
            />
          ) : null}
        </div>
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Result mode" description="Choose whether this filter keeps the top result, top N, or all matches.">
        <div style={{ position: 'relative' }}>
          <button
            ref={resultModeTriggerRef}
            type="button"
            onClick={() => toggleExclusiveMenu('resultMode')}
            style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}
          >
            <span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{selectedResultMode?.label ?? 'Top N'}</span>
            <CaretDown size={14} weight="bold" style={{ color: 'var(--canvas-text-secondary)', flex: 'none', transform: `rotate(${isResultModeOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
          </button>
          {isResultModeOpen ? (
            <DropdownMenu open={isResultModeOpen} anchorRef={resultModeTriggerRef} boundaryRef={containerRef} groups={resultModeMenuGroups} position="bottom" portalToBody onItemClick={(item) => {
              if (item.value === 'topOne' || item.value === 'topN' || item.value === 'allMatches') {
                onResultModeChange(item.value)
              }
              setIsResultModeOpen(false)
            }} />
          ) : null}
        </div>
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection
          title="How many"
          description="Set how many ranked assets should continue through this filter."
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
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              value={node?.filterHowMany ?? ''}
              onChange={(event) => {
                const sanitizedValue = event.target.value.replace(/[^0-9]/g, '')
                onHowManyChange(sanitizedValue)
              }}
              placeholder="0"
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--canvas-text-primary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 13,
                fontWeight: 700,
                padding: 0,
              }}
            />
          </div>
        </CanvasSidebarFieldSection>
      </div>

    </aside>
  )
}
