import { CaretDown, ChartPieSlice, Percent, Play } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { CanvasNodeRecord, CanvasStartWeightingType } from '../../state/canvas-node-store'
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
}

export default function CanvasStartSidebar({
  active,
  node,
  connectedMarketNodes,
  onClose,
  onWeightingChange,
  onSpecificPercentageChange,
}: CanvasStartSidebarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const weightingTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isWeightingMenuOpen, setIsWeightingMenuOpen] = useState(false)
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
        })),
      },
    ],
    [selectedWeighting?.value],
  )

  useEffect(() => {
    if (!active) {
      setIsWeightingMenuOpen(false)
      setFocusedPercentageNodeId(null)
    }
  }, [active])

  useEffect(() => {
    if (!isWeightingMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsWeightingMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isWeightingMenuOpen])

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
        description="Controls how the strategy allocates into connected assets."
        helpTitle="Start Node"
        helpBody="The start node defines the initial weighting method for assets connected to this strategy. Use it to choose equal weights, market-cap weights, or custom percentages."
        closeLabel="Close start sidebar"
        onClose={onClose}
      />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Set Weighting Type" description="Choose how the strategy should allocate across connected assets at the start.">
        <div ref={containerRef} style={{ position: 'relative' }}>
          <button
            ref={weightingTriggerRef}
            type="button"
            onClick={() => setIsWeightingMenuOpen((current) => !current)}
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

    </aside>
  )
}
