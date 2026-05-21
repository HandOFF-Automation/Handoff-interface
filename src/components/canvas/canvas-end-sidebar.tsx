import { CaretDown, ChartLineUp, ClockCountdown, FlagCheckered, Percent, ShieldWarning, TrendDown, Wallet, WaveSine } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { CanvasConditionOperator, CanvasEndScope, CanvasEndType, CanvasNodeRecord, CanvasTimeUnit } from '../../state/canvas-node-store'
import { CanvasAssetLogo } from './canvas-asset-options'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const endOptions: Array<{ value: CanvasEndType; label: string }> = [
  { value: 'priceReaches', label: 'Price Reaches' },
  { value: 'portfolioValue', label: 'Portfolio Value' },
  { value: 'timeBased', label: 'Time Based' },
  { value: 'maxDrawdown', label: 'Max Drawdown' },
  { value: 'dailyLoss', label: 'Daily Loss' },
  { value: 'exposureLimit', label: 'Exposure Limit' },
  { value: 'positionConcentration', label: 'Position Concentration' },
  { value: 'volatilityLimit', label: 'Volatility Limit' },
]

const endIconByValue = {
  priceReaches: <ChartLineUp size={16} weight="bold" />,
  portfolioValue: <Wallet size={16} weight="fill" />,
  timeBased: <ClockCountdown size={16} weight="fill" />,
  maxDrawdown: <TrendDown size={16} weight="bold" />,
  dailyLoss: <ShieldWarning size={16} weight="fill" />,
  exposureLimit: <Percent size={16} weight="bold" />,
  positionConcentration: <Wallet size={16} weight="fill" />,
  volatilityLimit: <WaveSine size={16} weight="bold" />,
} satisfies Record<CanvasEndType, React.ReactNode>

const operatorOptions: Array<{ value: CanvasConditionOperator; label: string }> = [
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
]

const timeUnitOptions: Array<{ value: CanvasTimeUnit; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const endScopeOptions: Array<{ value: CanvasEndScope; label: string }> = [
  { value: 'endBranch', label: 'End Branch' },
  { value: 'stopPath', label: 'Stop Path' },
  { value: 'closeHere', label: 'Close Here' },
]

type CanvasEndAssetNodeOption = {
  id: string
  type: 'stock' | 'token'
  assetSymbol?: string
  assetName?: string
}

type CanvasEndSidebarProps = {
  active: boolean
  node: CanvasNodeRecord | null
  assetNodeOptions: CanvasEndAssetNodeOption[]
  onClose: () => void
  onEndTypeChange: (value: CanvasEndType) => void
  onEndAssetNodeChange: (nodeId: string) => void
  onEndOperatorChange: (value: CanvasConditionOperator) => void
  onEndTargetValueChange: (value: string) => void
  onEndTimeValueChange: (value: string) => void
  onEndTimeUnitChange: (value: CanvasTimeUnit) => void
  onEndScopeChange: (value: CanvasEndScope) => void
}

export default function CanvasEndSidebar({
  active,
  node,
  assetNodeOptions,
  onClose,
  onEndTypeChange,
  onEndAssetNodeChange,
  onEndOperatorChange,
  onEndTargetValueChange,
  onEndTimeValueChange,
  onEndTimeUnitChange,
  onEndScopeChange,
}: CanvasEndSidebarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const endTypeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const assetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const operatorTriggerRef = useRef<HTMLButtonElement | null>(null)
  const timeUnitTriggerRef = useRef<HTMLButtonElement | null>(null)
  const scopeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isEndMenuOpen, setIsEndMenuOpen] = useState(false)
  const [isAssetMenuOpen, setIsAssetMenuOpen] = useState(false)
  const [isOperatorMenuOpen, setIsOperatorMenuOpen] = useState(false)
  const [isTimeUnitMenuOpen, setIsTimeUnitMenuOpen] = useState(false)
  const [isScopeMenuOpen, setIsScopeMenuOpen] = useState(false)
  const selectedEndType = endOptions.find((option) => option.value === node?.endType) ?? null
  const selectedEndIcon = selectedEndType ? endIconByValue[selectedEndType.value] : <FlagCheckered size={16} weight="fill" />
  const selectedAssetNode = assetNodeOptions.find((option) => option.id === node?.endAssetNodeId) ?? null
  const selectedOperator = operatorOptions.find((option) => option.value === node?.endOperator) ?? null
  const selectedTimeUnit = timeUnitOptions.find((option) => option.value === node?.endTimeUnit) ?? null
  const selectedEndScope = endScopeOptions.find((option) => option.value === node?.endScope) ?? endScopeOptions[0]
  const isRiskThresholdType = selectedEndType?.value === 'maxDrawdown'
    || selectedEndType?.value === 'dailyLoss'
    || selectedEndType?.value === 'exposureLimit'
    || selectedEndType?.value === 'positionConcentration'
    || selectedEndType?.value === 'volatilityLimit'
  const endMenuGroups = useMemo(
    () => [
      {
        items: endOptions.map<DropdownMenuItem>((option) => ({
          label: option.label,
          value: option.value,
          active: option.value === selectedEndType?.value,
          trailingIcon: option.value === selectedEndType?.value ? '✓' : undefined,
        })),
      },
    ],
    [selectedEndType?.value],
  )
  const assetMenuGroups = useMemo(
    () => [
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
          active: option.id === selectedAssetNode?.id,
          icon: option.id && option.assetSymbol ? <CanvasAssetLogo assetType={option.type} symbol={option.assetSymbol} size={20} /> : null,
          trailingIcon: option.id === selectedAssetNode?.id ? '✓' : undefined,
        })),
      },
    ],
    [assetNodeOptions, selectedAssetNode?.id],
  )
  const operatorMenuGroups = useMemo(
    () => [
      {
        items: operatorOptions.map<DropdownMenuItem>((option) => ({
          label: option.label,
          value: option.value,
          active: option.value === selectedOperator?.value,
          trailingIcon: option.value === selectedOperator?.value ? '✓' : undefined,
        })),
      },
    ],
    [selectedOperator?.value],
  )
  const timeUnitMenuGroups = useMemo(
    () => [
      {
        items: timeUnitOptions.map<DropdownMenuItem>((option) => ({
          label: option.label,
          value: option.value,
          active: option.value === selectedTimeUnit?.value,
          trailingIcon: option.value === selectedTimeUnit?.value ? '✓' : undefined,
        })),
      },
    ],
    [selectedTimeUnit?.value],
  )
  const endScopeMenuGroups = useMemo(
    () => [
      {
        items: endScopeOptions.map<DropdownMenuItem>((option) => ({
          label: option.label,
          value: option.value,
          active: option.value === selectedEndScope.value,
          trailingIcon: option.value === selectedEndScope.value ? '✓' : undefined,
        })),
      },
    ],
    [selectedEndScope.value],
  )
  const closeAllMenus = () => {
    setIsEndMenuOpen(false)
    setIsAssetMenuOpen(false)
    setIsOperatorMenuOpen(false)
    setIsTimeUnitMenuOpen(false)
    setIsScopeMenuOpen(false)
  }

  const toggleExclusiveMenu = (target: 'endType' | 'scope' | 'asset' | 'operator' | 'timeUnit') => {
    const nextOpen = target === 'endType'
      ? !isEndMenuOpen
      : target === 'scope'
        ? !isScopeMenuOpen
        : target === 'asset'
          ? !isAssetMenuOpen
          : target === 'operator'
            ? !isOperatorMenuOpen
            : !isTimeUnitMenuOpen
    closeAllMenus()

    if (!nextOpen) {
      return
    }

    if (target === 'endType') {
      setIsEndMenuOpen(true)
      return
    }

    if (target === 'scope') {
      setIsScopeMenuOpen(true)
      return
    }

    if (target === 'asset') {
      setIsAssetMenuOpen(true)
      return
    }

    if (target === 'operator') {
      setIsOperatorMenuOpen(true)
      return
    }

    setIsTimeUnitMenuOpen(true)
  }

  useEffect(() => {
    if (!active) {
      setIsEndMenuOpen(false)
      setIsAssetMenuOpen(false)
      setIsOperatorMenuOpen(false)
      setIsTimeUnitMenuOpen(false)
      setIsScopeMenuOpen(false)
    }
  }, [active])

  useEffect(() => {
    if (!isEndMenuOpen && !isAssetMenuOpen && !isOperatorMenuOpen && !isTimeUnitMenuOpen && !isScopeMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsEndMenuOpen(false)
      setIsAssetMenuOpen(false)
      setIsOperatorMenuOpen(false)
      setIsTimeUnitMenuOpen(false)
      setIsScopeMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isAssetMenuOpen, isEndMenuOpen, isOperatorMenuOpen, isScopeMenuOpen, isTimeUnitMenuOpen])

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
        title="End Node"
        description="Sets the condition that closes the current strategy branch or stops the flow."
        helpTitle="End Node"
        helpBody="The End node defines when the current strategy path should stop, close out, or terminate after a branch reaches its final condition. Use it for profit targets, time-based exits, or branch-level risk stops."
        closeLabel="Close end sidebar"
        onClose={onClose}
      />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Set End Type" description="Choose what kind of condition should close the current branch or end the flow.">
        <div ref={containerRef} style={{ position: 'relative' }}>
          <button
            ref={endTypeTriggerRef}
            type="button"
            onClick={() => toggleExclusiveMenu('endType')}
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
                {selectedEndIcon}
              </span>

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
                  maxWidth: 170,
                }}
              >
                {selectedEndType?.label ?? 'Set End Type'}
              </span>
            </span>

            <CaretDown
              size={14}
              weight="bold"
              style={{
                color: 'var(--canvas-text-secondary)',
                flex: 'none',
                transform: `rotate(${isEndMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
              }}
            />
          </button>

          {isEndMenuOpen ? (
            <DropdownMenu
              open={isEndMenuOpen}
              anchorRef={endTypeTriggerRef}
              boundaryRef={containerRef}
              groups={endMenuGroups}
              position="bottom"
              portalToBody
              onItemClick={(item) => {
                if (item.value === 'priceReaches' || item.value === 'portfolioValue' || item.value === 'timeBased' || item.value === 'maxDrawdown' || item.value === 'dailyLoss' || item.value === 'exposureLimit' || item.value === 'positionConcentration' || item.value === 'volatilityLimit') {
                  onEndTypeChange(item.value)
                }

                setIsEndMenuOpen(false)
              }}
            />
          ) : null}
        </div>
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="End Scope" description="Choose whether this node ends the current branch, stops the whole path, or simply closes the flow here.">
          <div style={{ position: 'relative' }}>
            <button
              ref={scopeTriggerRef}
              type="button"
              onClick={() => toggleExclusiveMenu('scope')}
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
              <span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedEndScope.label}</span>
              <CaretDown size={14} weight="bold" style={{ color: 'var(--canvas-text-secondary)', transform: `rotate(${isScopeMenuOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
            </button>
            {isScopeMenuOpen ? (
              <DropdownMenu
                open={isScopeMenuOpen}
                anchorRef={scopeTriggerRef}
                boundaryRef={containerRef}
                groups={endScopeMenuGroups}
                position="bottom"
                portalToBody
                onItemClick={(item) => {
                  if (item.value === 'endBranch' || item.value === 'stopPath' || item.value === 'closeHere') {
                    onEndScopeChange(item.value)
                  }

                  setIsScopeMenuOpen(false)
                }}
              />
            ) : null}
          </div>
        </CanvasSidebarFieldSection>

        {selectedEndType?.value === 'priceReaches' ? (
          <CanvasSidebarFieldSection title="Asset Node" description="Choose which connected asset should be watched for the price-based end condition.">
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
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 170,
                    }}
                  >
                    {selectedAssetNode?.assetName && selectedAssetNode.assetSymbol
                      ? `${selectedAssetNode.assetName} ${selectedAssetNode.assetSymbol}`
                      : 'Select asset node'}
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
                      onEndAssetNodeChange(item.value)
                    }

                    setIsAssetMenuOpen(false)
                  }}
                />
              ) : null}
            </div>
          </CanvasSidebarFieldSection>
        ) : null}

        {(selectedEndType?.value === 'priceReaches' || selectedEndType?.value === 'portfolioValue' || isRiskThresholdType) ? (
          <CanvasSidebarFieldSection
            title={isRiskThresholdType ? 'Risk Threshold' : 'Operator'}
            description={
              selectedEndType?.value === 'priceReaches'
                ? 'Enter the price threshold that should trigger this end condition.'
                : selectedEndType?.value === 'portfolioValue'
                  ? 'Enter the portfolio value threshold that should trigger this end condition.'
                  : selectedEndType?.value === 'maxDrawdown'
                    ? 'Enter the maximum drawdown percentage that should stop the strategy.'
                    : selectedEndType?.value === 'dailyLoss'
                      ? 'Enter the daily loss percentage that should stop the strategy.'
                      : selectedEndType?.value === 'exposureLimit'
                        ? 'Enter the portfolio exposure percentage limit for a single asset.'
                        : selectedEndType?.value === 'positionConcentration'
                          ? 'Enter the maximum position concentration percentage allowed for one holding.'
                          : 'Enter the volatility percentage limit that should stop the strategy.'
            }
            showDivider={selectedEndType?.value !== 'portfolioValue' && selectedEndType?.value !== 'positionConcentration' && selectedEndType?.value !== 'volatilityLimit'}
          >
            <div style={{ display: 'flex', gap: 10 }}>
              <div
                style={{
                  flex: 1,
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
                <span
                  style={{
                    color: 'var(--canvas-text-secondary)',
                    fontFamily: 'var(--canvas-font-sans)',
                    fontSize: 13,
                    fontWeight: 700,
                    lineHeight: 1,
                    flex: 'none',
                  }}
                >
                  {selectedEndType?.value === 'priceReaches' || selectedEndType?.value === 'portfolioValue' ? '$' : '%'}
                </span>

                <input
                  type="text"
                  inputMode="decimal"
                  value={node?.endTargetValue ?? ''}
                  onChange={(event) => {
                    const sanitizedValue = event.target.value.replace(/[^0-9.]/g, '')
                    onEndTargetValueChange(sanitizedValue)
                  }}
                  placeholder={selectedEndType?.value === 'priceReaches' || selectedEndType?.value === 'portfolioValue' ? 'Target' : 'Limit'}
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

              <div style={{ position: 'relative', width: 96 }}>
                <button
                  ref={operatorTriggerRef}
                  type="button"
                  onClick={() => toggleExclusiveMenu('operator')}
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
                    {selectedOperator?.label ?? 'Op'}
                  </span>

                  <CaretDown
                    size={14}
                    weight="bold"
                    style={{
                      color: 'var(--canvas-text-secondary)',
                      flex: 'none',
                      transform: `rotate(${isOperatorMenuOpen ? '180deg' : '0deg'})`,
                      transition: 'transform 160ms ease',
                    }}
                  />
                </button>

                {isOperatorMenuOpen ? (
                  <DropdownMenu
                    open={isOperatorMenuOpen}
                    anchorRef={operatorTriggerRef}
                    boundaryRef={containerRef}
                    groups={operatorMenuGroups}
                    position="bottom"
                    portalToBody
                    onItemClick={(item) => {
                      if (item.value === '>=' || item.value === '<=') {
                        onEndOperatorChange(item.value)
                      }

                      setIsOperatorMenuOpen(false)
                    }}
                  />
                ) : null}
              </div>
            </div>
          </CanvasSidebarFieldSection>
        ) : null}

        {selectedEndType?.value === 'timeBased' ? (
          <CanvasSidebarFieldSection
            title="Duration"
            description="Set how long the strategy should wait before ending."
            showDivider={false}
          >
            <div style={{ display: 'flex', gap: 10 }}>
              <div
                style={{
                  flex: 1,
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
                  value={node?.endTimeValue ?? ''}
                  onChange={(event) => {
                    const sanitizedValue = event.target.value.replace(/[^0-9]/g, '')
                    onEndTimeValueChange(sanitizedValue)
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

              <div style={{ position: 'relative', width: 110 }}>
                <button
                  ref={timeUnitTriggerRef}
                  type="button"
                  onClick={() => setIsTimeUnitMenuOpen((current) => !current)}
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
                    {selectedTimeUnit?.label ?? 'Unit'}
                  </span>

                  <CaretDown
                    size={14}
                    weight="bold"
                    style={{
                      color: 'var(--canvas-text-secondary)',
                      flex: 'none',
                      transform: `rotate(${isTimeUnitMenuOpen ? '180deg' : '0deg'})`,
                      transition: 'transform 160ms ease',
                    }}
                  />
                </button>

                {isTimeUnitMenuOpen ? (
                  <DropdownMenu
                    open={isTimeUnitMenuOpen}
                    anchorRef={timeUnitTriggerRef}
                    boundaryRef={containerRef}
                    groups={timeUnitMenuGroups}
                    position="bottom"
                    portalToBody
                    onItemClick={(item) => {
                      if (item.value === 'day' || item.value === 'week' || item.value === 'month') {
                        onEndTimeUnitChange(item.value)
                      }

                      setIsTimeUnitMenuOpen(false)
                    }}
                  />
                ) : null}
              </div>
            </div>
          </CanvasSidebarFieldSection>
        ) : null}
      </div>

    </aside>
  )
}
