import { CaretDown, FunnelSimple } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { CanvasFilterOrdering, CanvasFilterSortFunction, CanvasNodeRecord } from '../../state/canvas-node-store'
import { CanvasAssetLogo } from './canvas-asset-options'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const sortFunctionOptions: Array<{ value: CanvasFilterSortFunction; label: string }> = [
  { value: 'currentPrice', label: 'Current Price' },
  { value: 'currentMarketCap', label: 'Current Market Cap' },
  { value: 'volume', label: 'Volume' },
  { value: 'percentGain', label: 'Percent Gain' },
]

const orderingOptions: Array<{ value: CanvasFilterOrdering; label: string }> = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
]

type CanvasFilterSidebarProps = {
  active: boolean
  node: CanvasNodeRecord | null
  assetNodeOptions: Array<{
    id: string
    type: 'stock' | 'token'
    assetSymbol?: string
    assetName?: string
  }>
  onClose: () => void
  onAssetNodeChange: (value: string) => void
  onSortFunctionChange: (value: CanvasFilterSortFunction) => void
  onOrderingChange: (value: CanvasFilterOrdering) => void
  onHowManyChange: (value: string) => void
}

export default function CanvasFilterSidebar({ active, node, assetNodeOptions, onClose, onAssetNodeChange, onSortFunctionChange, onOrderingChange, onHowManyChange }: CanvasFilterSidebarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const assetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const sortTriggerRef = useRef<HTMLButtonElement | null>(null)
  const orderingTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isAssetMenuOpen, setIsAssetMenuOpen] = useState(false)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const [isOrderingMenuOpen, setIsOrderingMenuOpen] = useState(false)
  const selectedAssetNode = assetNodeOptions.find((option) => option.id === node?.filterAssetNodeId) ?? null
  const selectedSortFunction = sortFunctionOptions.find((option) => option.value === node?.filterSortFunction) ?? null
  const selectedOrdering = orderingOptions.find((option) => option.value === node?.filterOrdering) ?? null
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
        })),
      },
    ],
    [assetNodeOptions, selectedAssetNode?.id],
  )
  const sortMenuGroups = useMemo(
    () => [
      {
        items: sortFunctionOptions.map<DropdownMenuItem>((option) => ({
          label: option.label,
          value: option.value,
          active: option.value === selectedSortFunction?.value,
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

  useEffect(() => {
    if (!active) {
      setIsAssetMenuOpen(false)
      setIsSortMenuOpen(false)
      setIsOrderingMenuOpen(false)
    }
  }, [active])

  useEffect(() => {
    if (!isAssetMenuOpen && !isSortMenuOpen && !isOrderingMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsAssetMenuOpen(false)
      setIsSortMenuOpen(false)
      setIsOrderingMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isAssetMenuOpen, isOrderingMenuOpen, isSortMenuOpen])

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
        description="Sorts and filters assets before the flow continues."
        helpTitle="Filter Node"
        helpBody="The Filter node narrows the asset set by sorting it with a metric, choosing whether to keep the top or bottom results, and limiting how many items continue forward."
        closeLabel="Close filter sidebar"
        onClose={onClose}
      />

      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Select asset" description="Choose which asset set should be filtered before continuing the flow.">
        <div style={{ position: 'relative' }}>
          <button
            ref={assetTriggerRef}
            type="button"
            onClick={() => setIsAssetMenuOpen((current) => !current)}
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
                {selectedAssetNode?.assetName && selectedAssetNode.assetSymbol ? `${selectedAssetNode.assetName} ${selectedAssetNode.assetSymbol}` : 'Select asset'}
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

        <CanvasSidebarFieldSection title="Select sort function" description="Choose the metric used to rank the selected assets.">
        <div style={{ position: 'relative' }}>
          <button
            ref={sortTriggerRef}
            type="button"
            onClick={() => setIsSortMenuOpen((current) => !current)}
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
                {selectedSortFunction?.label ?? 'Select sort function'}
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
                if (item.value === 'currentPrice' || item.value === 'currentMarketCap' || item.value === 'volume' || item.value === 'percentGain') {
                  onSortFunctionChange(item.value)
                }

                setIsSortMenuOpen(false)
              }}
            />
          ) : null}
        </div>
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Select ordering function" description="Choose whether the flow keeps the top or bottom ranked assets.">
        <div style={{ position: 'relative' }}>
          <button
            ref={orderingTriggerRef}
            type="button"
            onClick={() => setIsOrderingMenuOpen((current) => !current)}
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
