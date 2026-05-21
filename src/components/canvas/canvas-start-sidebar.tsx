import { CaretDown, ChartPieSlice, Percent, Play } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { CanvasNodeRecord, CanvasStartStyle, CanvasStartWeightingType } from '../../state/canvas-node-store'
import { CanvasAssetLogo } from './canvas-asset-options'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const weightingOptions: Array<{ value: CanvasStartWeightingType; label: string }> = [
  { value: 'equal', label: 'Equal' },
  { value: 'specificPercentage', label: 'Specific Percentage' },
  { value: 'marketCap', label: 'Market Cap' },
]

const weightingIconByValue = {
  equal: <Play size={16} weight="fill" />,
  specificPercentage: <Percent size={16} weight="bold" />,
  marketCap: <ChartPieSlice size={16} weight="fill" />,
} satisfies Record<CanvasStartWeightingType, React.ReactNode>

const startStyleOptions: Array<{ value: CanvasStartStyle; label: string }> = [
  { value: 'standard', label: 'Standard' },
  { value: 'stagedEntry', label: 'Staged Entry' },
  { value: 'riskFirst', label: 'Risk First' },
]

type ConnectedMarketNode = {
  id: string
  type: 'stock' | 'token'
  assetSymbol?: string
  assetName?: string
}

type CanvasStartSidebarProps = {
  active: boolean
  node: CanvasNodeRecord | null
  connectedMarketNodes: ConnectedMarketNode[]
  onClose: () => void
  onWeightingChange: (value: CanvasStartWeightingType) => void
  onSpecificPercentageChange: (targetNodeId: string, value: string) => void
  onReserveCashChange: (value: string) => void
  onEntryLimitChange: (value: string) => void
  onStartStyleChange: (value: CanvasStartStyle) => void
}

export default function CanvasStartSidebar({
  active,
  node,
  connectedMarketNodes,
  onClose,
  onWeightingChange,
  onSpecificPercentageChange,
  onReserveCashChange,
  onEntryLimitChange,
  onStartStyleChange,
}: CanvasStartSidebarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const weightingTriggerRef = useRef<HTMLButtonElement | null>(null)
  const styleTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isWeightingMenuOpen, setIsWeightingMenuOpen] = useState(false)
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false)
  const [focusedPercentageNodeId, setFocusedPercentageNodeId] = useState<string | null>(null)
  const selectedWeighting = weightingOptions.find((option) => option.value === node?.startWeightingType) ?? null
  const selectedWeightingIcon = selectedWeighting ? weightingIconByValue[selectedWeighting.value] : <Play size={16} weight="fill" />
  const weightingMenuGroups = useMemo(
    () => [
        {
          items: weightingOptions.map<DropdownMenuItem>((option) => ({
            label: option.label,
            value: option.value,
            active: option.value === selectedWeighting?.value,
            trailingIcon: option.value === selectedWeighting?.value ? '✓' : undefined,
          })),
        },
    ],
    [selectedWeighting?.value],
  )
  const selectedStartStyle = startStyleOptions.find((option) => option.value === node?.startStyle) ?? startStyleOptions[0]
  const styleMenuGroups = useMemo(
    () => [
      {
        items: startStyleOptions.map<DropdownMenuItem>((option) => ({
          label: option.label,
          value: option.value,
          active: option.value === selectedStartStyle.value,
          trailingIcon: option.value === selectedStartStyle.value ? '✓' : undefined,
        })),
      },
    ],
    [selectedStartStyle.value],
  )
  const closeAllMenus = () => {
    setIsWeightingMenuOpen(false)
    setIsStyleMenuOpen(false)
  }

  const toggleExclusiveMenu = (target: 'weighting' | 'style') => {
    const nextOpen = target === 'weighting' ? !isWeightingMenuOpen : !isStyleMenuOpen
    closeAllMenus()

    if (!nextOpen) {
      return
    }

    if (target === 'weighting') {
      setIsWeightingMenuOpen(true)
      return
    }

    setIsStyleMenuOpen(true)
  }

  useEffect(() => {
    if (!active) {
      setIsWeightingMenuOpen(false)
      setIsStyleMenuOpen(false)
      setFocusedPercentageNodeId(null)
    }
  }, [active])

  useEffect(() => {
    if (!isWeightingMenuOpen && !isStyleMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsWeightingMenuOpen(false)
      setIsStyleMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isStyleMenuOpen, isWeightingMenuOpen])

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
        title="Start Node"
        description="Sets the opening allocation that feeds the rest of the strategy flow."
        helpTitle="Start Node"
        helpBody="The Start node defines the initial weighting method for assets connected to this strategy. Use it to choose equal weights, market-cap weights, or custom percentages before the flow moves into Filter, If, or execution branches."
        closeLabel="Close start sidebar"
        onClose={onClose}
      />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Set Weighting Type" description="Choose how the strategy should allocate across connected assets before entering downstream logic branches.">
        <div style={{ position: 'relative' }}>
          <button
            ref={weightingTriggerRef}
            type="button"
            onClick={() => toggleExclusiveMenu('weighting')}
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
                {selectedWeightingIcon}
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
                {selectedWeighting?.label ?? 'Set Weighting Type'}
              </span>
            </span>

            <CaretDown
              size={14}
              weight="bold"
              style={{
                color: 'var(--canvas-text-secondary)',
                flex: 'none',
                transform: `rotate(${isWeightingMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
              }}
            />
          </button>

          {isWeightingMenuOpen ? (
            <DropdownMenu
              open={isWeightingMenuOpen}
              anchorRef={weightingTriggerRef}
              boundaryRef={containerRef}
              groups={weightingMenuGroups}
              position="bottom"
              portalToBody
              style={{
              }}
              onItemClick={(item) => {
                if (item.value === 'equal' || item.value === 'specificPercentage' || item.value === 'marketCap') {
                  onWeightingChange(item.value)
                }

                setIsWeightingMenuOpen(false)
              }}
            />
          ) : null}
        </div>
        </CanvasSidebarFieldSection>
        <CanvasSidebarFieldSection title="Start Style" description="Choose the overall tone of the branch opening, from standard deployment to more guarded entry behavior.">
          <div style={{ position: 'relative' }}>
            <button ref={styleTriggerRef} type="button" onClick={() => toggleExclusiveMenu('style')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}>
              <span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700 }}>{selectedStartStyle.label}</span>
              <CaretDown size={14} weight="bold" style={{ color: 'var(--canvas-text-secondary)', transform: `rotate(${isStyleMenuOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
            </button>
            {isStyleMenuOpen ? <DropdownMenu open={isStyleMenuOpen} anchorRef={styleTriggerRef} boundaryRef={containerRef} groups={styleMenuGroups} position="bottom" portalToBody onItemClick={(item) => { if (item.value === 'standard' || item.value === 'stagedEntry' || item.value === 'riskFirst') { onStartStyleChange(item.value) } setIsStyleMenuOpen(false) }} /> : null}
          </div>
        </CanvasSidebarFieldSection>
        <CanvasSidebarFieldSection title="Reserve Cash" description="Keep part of the capital unused before this branch starts deploying into connected assets.">
          <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>%</span><input value={node?.startReserveCashPercent ?? ''} onChange={(event) => onReserveCashChange(event.target.value)} placeholder="20" inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} /></div>
        </CanvasSidebarFieldSection>
        <CanvasSidebarFieldSection title="Entry Limit" description="Optional cap that keeps the opening branch from deploying too much at once." showDivider={selectedWeighting?.value !== 'specificPercentage'}>
          <div style={{ minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700 }}>%</span><input value={node?.startEntryLimit ?? ''} onChange={(event) => onEntryLimitChange(event.target.value)} placeholder="35" inputMode="decimal" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 14, fontWeight: 700, padding: 0 }} /></div>
        </CanvasSidebarFieldSection>

        {selectedWeighting?.value === 'specificPercentage' ? (
          <CanvasSidebarFieldSection
            title="Connected Markets"
            description="Enter a percentage for each connected asset to define the starting allocation."
            showDivider={false}
          >
            {connectedMarketNodes.length > 0 ? (
              connectedMarketNodes.map((marketNode) => {
                const inputValue = node?.startSpecificPercentages?.[marketNode.id] ?? ''

                return (
                  <div
                    key={marketNode.id}
                    style={{
                      minHeight: 54,
                      borderRadius: 16,
                      border: '1px solid var(--canvas-panel-divider)',
                      background: 'var(--canvas-surface-soft)',
                      padding: '0 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                      {marketNode.assetSymbol ? <CanvasAssetLogo assetType={marketNode.type} symbol={marketNode.assetSymbol} size={28} /> : null}

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
                        {marketNode.assetName && marketNode.assetSymbol ? `${marketNode.assetName} ${marketNode.assetSymbol}` : marketNode.assetSymbol ?? 'Unnamed Asset'}
                      </span>
                    </span>

                    <label
                      style={{
                        minHeight: 34,
                        padding: '0 10px',
                        borderRadius: 999,
                        border: '1px solid var(--canvas-panel-divider)',
                        background: 'var(--canvas-surface-soft)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        flex: 'none',
                        cursor: focusedPercentageNodeId === marketNode.id ? 'text' : 'pointer',
                      }}
                    >
                      <input
                        type="text"
                        inputMode="decimal"
                        value={inputValue}
                        onFocus={() => setFocusedPercentageNodeId(marketNode.id)}
                        onBlur={() => {
                          setFocusedPercentageNodeId((current) => (current === marketNode.id ? null : current))
                        }}
                        onChange={(event) => {
                          const sanitizedValue = event.target.value.replace(/[^0-9.]/g, '')
                          onSpecificPercentageChange(marketNode.id, sanitizedValue)
                        }}
                        style={{
                          width: 44,
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          color: 'var(--canvas-text-primary)',
                          fontFamily: 'var(--canvas-font-sans)',
                          fontSize: 13,
                          fontWeight: 700,
                          textAlign: 'right',
                          padding: 0,
                          cursor: focusedPercentageNodeId === marketNode.id ? 'text' : 'pointer',
                        }}
                      />
                      <span
                        style={{
                          color: 'var(--canvas-text-secondary)',
                          fontFamily: 'var(--canvas-font-sans)',
                          fontSize: 13,
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        %
                      </span>
                    </label>
                  </div>
                )
              })
            ) : (
              <div
                style={{
                  minHeight: 54,
                  borderRadius: 16,
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'var(--canvas-surface-soft)',
                  padding: '0 14px',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--canvas-text-secondary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                No connected market nodes
              </div>
            )}
          </CanvasSidebarFieldSection>
        ) : null}
        </div>
      </div>

    </aside>
  )
}
