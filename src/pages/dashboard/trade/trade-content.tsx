import { CaretDown, CaretUp, MagnifyingGlass } from '@phosphor-icons/react'
import { tokenIcons } from '@web3icons/react'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import handoffIcon from '../../../assets/icon/icon handoff.png'
import { StrategyOpportunityCard, type StrategyOpportunityCardData, type StrategyOpportunityTokenDetail } from '../../../components/card/strategy-opportunity-card'
import { DashboardCard } from '../../../components/card/dashboard-card'
import { TradeTokenMiniChart } from '../../../components/chart/trade-token-mini-chart'
import DropdownMenu, { type DropdownMenuItem } from '../../../components/dropdown/dropdown-menu'
import { MarketTickerCarousel } from '../../../components/market/market-ticker-carousel'

type TradeFilterId = 'all' | 'gainers' | 'losers' | 'stable'
type SortField = 'price' | 'change24h' | 'marketCap' | 'volume' | 'miniChart'
type SortDirection = 'asc' | 'desc'
type TradePageSize = 5 | 10 | 20

type TradeTokenRow = {
  id: string
  rank: number
  symbol: 'BTC' | 'ETH' | 'SOL' | 'USDC' | 'ARB' | 'MNT'
  name: string
  price: string
  change24h: string
  marketCap: string
  volume: string
  chartValues: number[]
  filterCategory: Exclude<TradeFilterId, 'all'>
}

const PAGE_SIZE_OPTIONS: TradePageSize[] = [5, 10, 20]

const tradeDataset = {
  marketTickers: [
    { symbol: 'BTC', price: '$68,421.22', changePercent: 1.39 },
    { symbol: 'ETH', price: '$3,542.10', changePercent: -1.39 },
    { symbol: 'SOL', price: '$178.14', changePercent: 2.18 },
    { symbol: 'USDC', price: '$1.00', changePercent: 0.01 },
    { symbol: 'ARB', price: '$1.27', changePercent: -0.84 },
    { symbol: 'MNT', price: '$1.09', changePercent: 3.42 },
  ] as const,
  title: 'All Token',
  filters: [
    { id: 'all', label: 'All' },
    { id: 'gainers', label: 'Gainers' },
    { id: 'losers', label: 'Losers' },
    { id: 'stable', label: 'Stable' },
  ] as Array<{ id: TradeFilterId; label: string }>,
  strategiesTitle: 'Strategies',
  strategies: [
    { id: 'strategy-1', title: 'Momentum Rotation', totalApr: '+0.82%', tokens: ['BTC', 'ETH', 'SOL'] },
    { id: 'strategy-2', title: 'Yield Stable Flow', totalApr: '+1.14%', tokens: ['USDC', 'ARB', 'MNT'] },
    { id: 'strategy-3', title: 'Layer One Spread', totalApr: '-0.24%', tokens: ['BTC', 'SOL', 'MNT'] },
    { id: 'strategy-4', title: 'Bluechip Rebalance', totalApr: '+0.36%', tokens: ['BTC', 'ETH', 'USDC'] },
    { id: 'strategy-5', title: 'Alt Breakout Grid', totalApr: '+1.92%', tokens: ['SOL', 'ARB', 'ETH'] },
    { id: 'strategy-6', title: 'Defensive Treasury', totalApr: '-0.08%', tokens: ['USDC', 'BTC', 'MNT'] },
  ] as StrategyOpportunityCardData[],
  rows: [
    { id: 'token-1', rank: 1, symbol: 'BTC', name: 'Bitcoin', price: '$68,421.22', change24h: '+1.39%', marketCap: '$1.34T', volume: '$28.4B', chartValues: [58, 60, 61, 63, 62, 66, 68], filterCategory: 'gainers' },
    { id: 'token-2', rank: 2, symbol: 'ETH', name: 'Ethereum', price: '$3,542.10', change24h: '-1.39%', marketCap: '$425.7B', volume: '$16.8B', chartValues: [70, 69, 67, 66, 64, 63, 61], filterCategory: 'losers' },
    { id: 'token-3', rank: 3, symbol: 'SOL', name: 'Solana', price: '$178.14', change24h: '+2.18%', marketCap: '$82.1B', volume: '$6.3B', chartValues: [38, 40, 39, 43, 46, 48, 51], filterCategory: 'gainers' },
    { id: 'token-4', rank: 4, symbol: 'USDC', name: 'USD Coin', price: '$1.00', change24h: '+0.01%', marketCap: '$32.9B', volume: '$5.4B', chartValues: [50, 50, 50, 50, 50, 50, 50], filterCategory: 'stable' },
    { id: 'token-5', rank: 5, symbol: 'ARB', name: 'Arbitrum', price: '$1.27', change24h: '-0.84%', marketCap: '$4.3B', volume: '$418M', chartValues: [62, 61, 60, 59, 58, 58, 57], filterCategory: 'losers' },
    { id: 'token-6', rank: 6, symbol: 'MNT', name: 'Mantle', price: '$1.09', change24h: '+3.42%', marketCap: '$3.6B', volume: '$214M', chartValues: [24, 26, 28, 29, 33, 35, 39], filterCategory: 'gainers' },
  ] as TradeTokenRow[],
}

const iconBySymbol = {
  BTC: tokenIcons.TokenBTC,
  ETH: tokenIcons.TokenETH,
  SOL: tokenIcons.TokenSOL,
  USDC: tokenIcons.TokenUSDC,
  ARB: tokenIcons.TokenARB,
  MNT: tokenIcons.TokenMNT,
} as const

const tokenDetailBySymbol: Record<StrategyOpportunityTokenDetail['symbol'], StrategyOpportunityTokenDetail> = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$68,421.22',
    change24h: '+1.39%',
    description: 'Digital store-of-value asset with the largest market capitalization in crypto.',
    marketCap: '$1.34T',
    chartValues: [58, 60, 61, 63, 62, 66, 68],
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '$3,542.10',
    change24h: '-1.39%',
    description: 'Smart-contract network powering onchain apps, DeFi protocols, and rollups.',
    marketCap: '$425.7B',
    chartValues: [70, 69, 67, 66, 64, 63, 61],
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    price: '$178.14',
    change24h: '+2.18%',
    description: 'High-throughput ecosystem token used across trading, payments, and apps.',
    marketCap: '$82.1B',
    chartValues: [38, 40, 39, 43, 46, 48, 51],
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    price: '$1.00',
    change24h: '+0.01%',
    description: 'Dollar-backed stablecoin widely used for settlement, treasury, and trading pairs.',
    marketCap: '$32.9B',
    chartValues: [50, 50, 50, 50, 50, 50, 50],
  },
  ARB: {
    symbol: 'ARB',
    name: 'Arbitrum',
    price: '$1.27',
    change24h: '-0.84%',
    description: 'Layer 2 governance token tied to Ethereum scaling activity and ecosystem growth.',
    marketCap: '$4.3B',
    chartValues: [62, 61, 60, 59, 58, 58, 57],
  },
  MNT: {
    symbol: 'MNT',
    name: 'Mantle',
    price: '$1.09',
    change24h: '+3.42%',
    description: 'Ecosystem token for the Mantle network with treasury and governance utility.',
    marketCap: '$3.6B',
    chartValues: [24, 26, 28, 29, 33, 35, 39],
  },
}

export default function TradeContent() {
  const [activeFilterId, setActiveFilterId] = useState<TradeFilterId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('change24h')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<TradePageSize>(5)
  const [isPageSizeMenuOpen, setIsPageSizeMenuOpen] = useState(false)

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredRows = useMemo(() => {
    return tradeDataset.rows.filter((row) => {
      const matchesFilter = activeFilterId === 'all' ? true : row.filterCategory === activeFilterId
      const matchesSearch = normalizedQuery.length === 0 ? true : row.name.toLowerCase().includes(normalizedQuery) || row.symbol.toLowerCase().includes(normalizedQuery) || row.price.toLowerCase().includes(normalizedQuery)

      return matchesFilter && matchesSearch
    })
  }, [activeFilterId, normalizedQuery])

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((left, right) => {
      const leftValue = getSortableValue(left, sortField)
      const rightValue = getSortableValue(right, sortField)

      if (leftValue === rightValue) {
        return left.rank - right.rank
      }

      return sortDirection === 'asc' ? leftValue - rightValue : rightValue - leftValue
    })
  }, [filteredRows, sortDirection, sortField])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const clampedPage = Math.min(currentPage, totalPages)
  const paginatedRows = sortedRows.slice((clampedPage - 1) * pageSize, clampedPage * pageSize)
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const pageSizeMenuGroups = [
    {
      items: PAGE_SIZE_OPTIONS.map((sizeOption) => ({
        label: `${sizeOption} items`,
        value: String(sizeOption),
        active: sizeOption === pageSize,
      })),
    },
  ]

  useEffect(() => {
    setCurrentPage((current) => Math.min(current, totalPages))
  }, [totalPages])

  useEffect(() => {
    if (!isPageSizeMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.closest('[data-trade-page-size-menu-root="true"]')) {
        return
      }

      setIsPageSizeMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isPageSizeMenuOpen])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))
      return
    }

    setSortField(field)
    setSortDirection('desc')
  }

  const handlePageSizeMenuClick = (item: DropdownMenuItem) => {
    const nextPageSize = Number(item.value) as TradePageSize

    if (PAGE_SIZE_OPTIONS.includes(nextPageSize)) {
      setPageSize(nextPageSize)
      setCurrentPage(1)
    }

    setIsPageSizeMenuOpen(false)
  }

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <MarketTickerCarousel items={tradeDataset.marketTickers} />

      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1.05 }}>{tradeDataset.strategiesTitle}</div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 30,
              padding: '0 12px',
              borderRadius: 999,
              border: '1px solid var(--canvas-panel-divider)',
              background: 'transparent',
              color: 'var(--canvas-text-primary)',
              fontSize: 11,
              fontWeight: 600,
              lineHeight: 1,
              boxSizing: 'border-box',
              gap: 8,
            }}
          >
            <img
              src={handoffIcon}
              alt="Handoff"
              style={{
                width: 16,
                height: 16,
                borderRadius: '999px',
                display: 'block',
                objectFit: 'cover',
                flex: 'none',
              }}
            />
            <span>By Handoff</span>
          </span>
        </div>

        <DashboardCard
          style={{
            padding: 22,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 18,
            alignItems: 'stretch',
          }}
        >
          {tradeDataset.strategies.map((strategy) => (
            <StrategyOpportunityCard key={strategy.id} strategy={strategy} tokenDetails={tokenDetailBySymbol} />
          ))}
        </DashboardCard>
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1.05 }}>{tradeDataset.title}</div>

        <DashboardCard
          style={{
            padding: '26px 22px 18px',
            display: 'grid',
            gridTemplateRows: 'auto minmax(0, 1fr) auto',
            gap: 20,
            minHeight: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
            <div
              style={{
                minWidth: 220,
                flex: '1 1 280px',
                height: 44,
                padding: '0 14px',
                borderRadius: 14,
                border: '1px solid var(--canvas-panel-divider)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                boxSizing: 'border-box',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--canvas-text-tertiary)' }}>
                <MagnifyingGlass size={16} weight="bold" />
              </span>
              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search token"
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--canvas-text-primary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: 4,
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'var(--canvas-surface-soft)',
              }}
            >
              {tradeDataset.filters.map((filter) => {
                const active = filter.id === activeFilterId

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => {
                      setActiveFilterId(filter.id)
                      setCurrentPage(1)
                    }}
                    style={{
                      height: 28,
                      padding: '0 12px',
                      border: 'none',
                      borderRadius: 999,
                      background: active ? 'var(--canvas-accent)' : 'transparent',
                      color: active ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-tertiary)',
                      cursor: 'pointer',
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'var(--canvas-font-sans)',
                    }}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ overflow: 'hidden', borderRadius: 18, border: '1px solid var(--canvas-panel-divider)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ background: 'var(--canvas-surface-soft)' }}>
                  <th style={tableHeaderCellStyle}>Token</th>
                  <th style={tableHeaderCellStyle}>{renderSortableHeader('Price', sortField === 'price', sortDirection, () => handleSort('price'))}</th>
                  <th style={tableHeaderCellStyle}>{renderSortableHeader('24h', sortField === 'change24h', sortDirection, () => handleSort('change24h'))}</th>
                  <th style={tableHeaderCellStyle}>{renderSortableHeader('Marketcap', sortField === 'marketCap', sortDirection, () => handleSort('marketCap'))}</th>
                  <th style={tableHeaderCellStyle}>{renderSortableHeader('Volume', sortField === 'volume', sortDirection, () => handleSort('volume'))}</th>
                  <th style={tableHeaderCellStyle}>{renderSortableHeader('24h', sortField === 'miniChart', sortDirection, () => handleSort('miniChart'))}</th>
                </tr>
              </thead>
            </table>

            <div
              className="dataTableBodyScrollArea"
              style={{
                maxHeight: 420,
                overflowY: 'auto',
                overflowX: 'hidden',
                background: 'var(--canvas-surface-soft-subtle)',
                boxShadow: 'var(--canvas-shadow-inset-soft)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <tbody>
                  {paginatedRows.map((row, index) => {
                    const Icon = iconBySymbol[row.symbol]
                    const isPositive = parsePercent(row.change24h) >= 0

                    return (
                      <tr key={row.id} className="interactiveTableRow" style={{ borderTop: '1px solid var(--canvas-panel-divider)' }}>
                        <td style={tableBodyCellStyle}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <Icon width={18} height={18} />
                            <span>{row.name}</span>
                          </span>
                        </td>
                        <td style={tableBodyCellStyle}>{row.price}</td>
                        <td style={{ ...tableBodyCellStyle, color: isPositive ? 'var(--canvas-accent)' : 'var(--canvas-negative)' }}>{row.change24h}</td>
                        <td style={tableBodyCellStyle}>{row.marketCap}</td>
                        <td style={tableBodyCellStyle}>{row.volume}</td>
                        <td style={{ ...tableBodyCellStyle, paddingTop: 10, paddingBottom: 10, color: 'var(--canvas-text-secondary)' }}>
                          <div
                            style={{
                              width: '100%',
                              height: 44,
                              pointerEvents: 'none',
                            }}
                          >
                            <TradeTokenMiniChart values={row.chartValues} positive={isPositive} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 14 }}>
            <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11, fontWeight: 500 }}>
              {sortedRows.length > 0 ? `Showing ${(clampedPage - 1) * pageSize + 1}-${Math.min(clampedPage * pageSize, sortedRows.length)} of ${sortedRows.length}` : 'Showing 0 of 0'}
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setCurrentPage((current) => Math.max(1, current - 1))} disabled={clampedPage === 1} style={{ ...paginationButtonStyle, opacity: clampedPage === 1 ? 0.45 : 1, cursor: clampedPage === 1 ? 'default' : 'pointer' }}>
                <span>Prev</span>
              </button>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                {pageNumbers.map((pageNumber) => {
                  const active = pageNumber === clampedPage

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      style={{
                        minWidth: 32,
                        height: 32,
                        padding: '0 10px',
                        borderRadius: 999,
                        border: '1px solid var(--canvas-panel-divider)',
                        background: active ? 'var(--canvas-accent)' : 'transparent',
                        color: active ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-primary)',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: 'var(--canvas-font-sans)',
                      }}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
              </div>
              <button type="button" onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))} disabled={clampedPage === totalPages} style={{ ...paginationButtonStyle, opacity: clampedPage === totalPages ? 0.45 : 1, cursor: clampedPage === totalPages ? 'default' : 'pointer' }}>
                <span>Next</span>
              </button>
            </div>

            <div data-trade-page-size-menu-root="true" style={{ position: 'relative', justifySelf: 'end' }}>
              <button
                type="button"
                onClick={() => setIsPageSizeMenuOpen((current) => !current)}
                style={{
                  height: 32,
                  padding: '0 12px',
                  borderRadius: 999,
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'transparent',
                  color: 'var(--canvas-text-primary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {pageSize} items
                <CaretDown size={12} weight="bold" style={{ transform: `rotate(${isPageSizeMenuOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
              </button>

              {isPageSizeMenuOpen ? (
                <DropdownMenu
                  open={isPageSizeMenuOpen}
                  groups={pageSizeMenuGroups}
                  onItemClick={handlePageSizeMenuClick}
                  style={{
                    left: '50%',
                    bottom: 'calc(100% + 10px)',
                    minWidth: 132,
                  }}
                />
              ) : null}
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}

function getSortableValue(row: TradeTokenRow, field: SortField) {
  if (field === 'miniChart') {
    return parsePercent(row.change24h)
  }

  return Number(row[field].replace(/[^0-9+.-]/g, '')) || 0
}

function parsePercent(value: string) {
  return Number(value.replace('%', '')) || 0
}

function renderSortableHeader(label: string, active: boolean, direction: SortDirection, onClick: () => void): ReactNode {
  const upColor = active && direction === 'desc' ? 'var(--canvas-accent)' : 'var(--canvas-text-tertiary)'
  const downColor = active && direction === 'asc' ? 'var(--canvas-accent)' : 'var(--canvas-text-tertiary)'

  return (
    <button type="button" onClick={onClick} style={headerSortButtonStyle}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--canvas-text-secondary)' }}>
        {label}
        <span style={{ display: 'inline-grid', gridTemplateRows: 'repeat(2, 5px)', alignItems: 'center', lineHeight: 1 }}>
          <CaretUp size={10} weight={active && direction === 'desc' ? 'fill' : 'bold'} color={upColor} />
          <CaretDown size={10} weight={active && direction === 'asc' ? 'fill' : 'bold'} color={downColor} />
        </span>
      </span>
    </button>
  )
}

const tableHeaderCellStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  color: 'var(--canvas-text-secondary)',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: 1.2,
}

const tableBodyCellStyle: React.CSSProperties = {
  padding: '14px 16px',
  color: 'var(--canvas-text-primary)',
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.4,
  verticalAlign: 'middle',
}

const headerSortButtonStyle: React.CSSProperties = {
  border: 'none',
  padding: 0,
  margin: 0,
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer',
  borderRadius: 0,
  opacity: 1,
}

const paginationButtonStyle: React.CSSProperties = {
  minWidth: 32,
  height: 32,
  padding: '0 10px',
  borderRadius: 999,
  border: '1px solid var(--canvas-panel-divider)',
  background: 'transparent',
  color: 'var(--canvas-text-primary)',
  fontSize: 11,
  fontWeight: 600,
  fontFamily: 'var(--canvas-font-sans)',
}
