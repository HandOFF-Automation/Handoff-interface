import { CaretDown, Coin, MagnifyingGlass, TrendUp } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { CanvasNodeRecord } from '../../state/canvas-node-store'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import { CanvasAssetLogo, getCanvasAssetOptions } from './canvas-asset-options'

type CanvasAssetSidebarProps = {
  active: boolean
  node: CanvasNodeRecord | null
  onClose: () => void
  onAssetChange: (symbol: string) => void
}

export default function CanvasAssetSidebar({ active, node, onClose, onAssetChange }: CanvasAssetSidebarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const assetTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isAssetMenuOpen, setIsAssetMenuOpen] = useState(false)
  const [assetSearch, setAssetSearch] = useState('')
  const assetType = node?.type === 'stock' || node?.type === 'token' ? node.type : null
  const options = useMemo(() => (assetType ? getCanvasAssetOptions(assetType) : []), [assetType])
  const selectedAsset = options.find((option) => option.symbol === node?.assetSymbol) ?? null
  const filteredOptions = useMemo(() => {
    const normalizedQuery = assetSearch.trim().toLowerCase()

    if (!normalizedQuery) {
      return options
    }

    return options.filter((option) => {
      const haystack = `${option.name} ${option.symbol}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [assetSearch, options])
  const assetMenuGroups = useMemo(
    () => [
      {
        className: 'dropdownMenuScrollableGroup',
        style: {
          minHeight: 120,
          maxHeight: 220,
        },
        items: (filteredOptions.length > 0 ? filteredOptions : [{ symbol: '', name: 'No asset found' }]).map<DropdownMenuItem>((option) => ({
          label: `${option.name} (${option.symbol})`,
          value: option.symbol,
          disabled: !option.symbol,
          active: option.symbol === selectedAsset?.symbol,
          icon: assetType && option.symbol ? <CanvasAssetLogo assetType={assetType} symbol={option.symbol} size={20} /> : null,
        })),
      },
    ],
    [assetType, filteredOptions, selectedAsset?.symbol],
  )
  const defaultIcon = assetType === 'stock' ? <TrendUp size={18} weight="bold" /> : assetType === 'token' ? <Coin size={18} weight="fill" /> : null

  useEffect(() => {
    if (!active) {
      setIsAssetMenuOpen(false)
      setAssetSearch('')
    }
  }, [active])

  useEffect(() => {
    if (!isAssetMenuOpen) {
      setAssetSearch('')
    }
  }, [isAssetMenuOpen])

  useEffect(() => {
    if (!isAssetMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsAssetMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isAssetMenuOpen])

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
        title="Asset Node"
        description={assetType ? `Choose the ${assetType} used by this node.` : 'Choose the asset used by this node.'}
        helpTitle="Asset Node"
        helpBody="Asset nodes represent the tradable stock or token used in the strategy flow. Use this panel to select which market asset this node points to."
        closeLabel="Close asset sidebar"
        onClose={onClose}
      />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Asset" description={assetType ? `Choose the ${assetType} used by this node.` : 'Choose the asset used by this node.'} showDivider={false}>
          <div ref={containerRef} style={{ position: 'relative' }}>
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
                {assetType && selectedAsset ? (
                  <CanvasAssetLogo assetType={assetType} symbol={selectedAsset.symbol} size={28} />
                ) : (
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
                    {defaultIcon}
                  </span>
                )}

                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
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
                      maxWidth: 160,
                    }}
                  >
                    {selectedAsset?.name ?? 'Select asset'}
                  </span>
                  <span
                    style={{
                      color: 'var(--canvas-text-secondary)',
                      fontFamily: 'var(--canvas-font-sans)',
                      fontSize: 11,
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {selectedAsset?.symbol ?? ''}
                  </span>
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
                header={
                  <div style={{ position: 'relative' }}>
                    <MagnifyingGlass
                      size={14}
                      weight="bold"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: 12,
                        transform: 'translateY(-50%)',
                        color: 'var(--canvas-text-secondary)',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      type="text"
                      value={assetSearch}
                      onChange={(event) => setAssetSearch(event.target.value)}
                      placeholder="Search asset"
                      onPointerDown={(event) => event.stopPropagation()}
                      style={{
                        width: '100%',
                        height: 40,
                        borderRadius: 12,
                        border: '1px solid var(--canvas-panel-divider)',
                        background: 'var(--canvas-surface-soft)',
                        color: 'var(--canvas-text-primary)',
                        fontFamily: 'var(--canvas-font-sans)',
                        fontSize: 12,
                        fontWeight: 500,
                        outline: 'none',
                        boxSizing: 'border-box',
                        padding: '0 12px 0 34px',
                      }}
                    />
                  </div>
                }
                style={{
                  minHeight: 188,
                  maxHeight: 320,
                  background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)',
                  border: '1px solid var(--canvas-panel-divider)',
                  boxShadow: '0 16px 40px var(--canvas-shadow-soft)',
                  backdropFilter: 'blur(16px)',
                }}
                onItemClick={(item) => {
                  if (item.value) {
                    onAssetChange(item.value)
                  }

                  setIsAssetMenuOpen(false)
                }}
              />
            ) : null}
          </div>
        </CanvasSidebarFieldSection>
      </div>

    </aside>
  )
}
