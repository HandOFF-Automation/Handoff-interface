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

type YieldFilterId = 'all' | 'rwa' | 'staking' | 'stable'
type SortField = 'price' | 'change24h' | 'marketCap' | 'volume' | 'miniChart'
type SortDirection = 'asc' | 'desc'
type YieldPageSize = 5 | 10 | 20

type YieldTokenRow = {
  id: string
  rank: number
  symbol: 'USDC' | 'MNT' | 'USDY' | 'mETH' | 'WETH' | 'WBTC' | 'DAI' | 'USDT' | 'wstETH' | 'MNT-LP' | 'Mantle-LSP'
  name: string
  price: string
  change24h: string
  marketCap: string
  volume: string
  chartValues: number[]
  filterCategory: Exclude<YieldFilterId, 'all'>
}

const PAGE_SIZE_OPTIONS: YieldPageSize[] = [5, 10, 20]

const yieldDataset = {
  marketTickers: [
    { symbol: 'USDC', price: '$1.00', changePercent: 0.01 },
    { symbol: 'MNT', price: '$1.09', changePercent: 3.42 },
    { symbol: 'USDY', price: '$1.00', changePercent: 0.02 },
    { symbol: 'mETH', price: '$3,542.10', changePercent: 1.85 },
    { symbol: 'WETH', price: '$3,542.10', changePercent: 1.85 },
    { symbol: 'WBTC', price: '$68,421.22', changePercent: 1.39 },
  ] as const,
  title: 'All Yield Assets',
  filters: [
    { id: 'all', label: 'All' },
    { id: 'rwa', label: 'RWA' },
    { id: 'staking', label: 'Staking' },
    { id: 'stable', label: 'Stable' },
  ] as Array<{ id: YieldFilterId; label: string }>,
  strategiesTitle: 'Strategies',
  strategies: [
    { id: 'yield-strategy-1', title: 'RWA Yield Stack', totalApr: '+4.82%', tokens: ['USDY', 'mETH', 'USDC'] },
    { id: 'yield-strategy-2', title: 'Staking Rewards Flow', totalApr: '+6.14%', tokens: ['MNT', 'wstETH', 'Mantle-LSP'] },
    { id: 'yield-strategy-3', title: 'Stable Diversification', totalApr: '+2.24%', tokens: ['USDC', 'DAI', 'USDT'] },
    { id: 'yield-strategy-4', title: 'Wrapped Asset Blend', totalApr: '+3.36%', tokens: ['WETH', 'WBTC', 'mETH'] },
    { id: 'yield-strategy-5', title: 'Mantle Ecosystem Yield', totalApr: '+5.92%', tokens: ['MNT', 'USDY', 'MNT-LP'] },
    { id: 'yield-strategy-6', title: 'RWA Risk Management', totalApr: '+2.08%', tokens: ['USDC', 'mETH', 'wstETH'] },
  ] as StrategyOpportunityCardData[],
  rows: [
    { id: 'yield-1', rank: 1, symbol: 'USDY', name: 'Ondo US Dollar Yield', price: '$1.00', change24h: '+0.02%', marketCap: '$2.4B', volume: '$180M', chartValues: [50, 50, 50, 50, 50, 50, 50], filterCategory: 'rwa' },
    { id: 'yield-2', rank: 2, symbol: 'mETH', name: 'Mantle Ether', price: '$3,542.10', change24h: '+1.85%', marketCap: '$1.8B', volume: '$120M', chartValues: [48, 50, 52, 54, 56, 58, 60], filterCategory: 'rwa' },
    { id: 'yield-3', rank: 3, symbol: 'MNT', name: 'Mantle', price: '$1.09', change24h: '+3.42%', marketCap: '$3.6B', volume: '$214M', chartValues: [24, 26, 28, 29, 33, 35, 39], filterCategory: 'staking' },
    { id: 'yield-4', rank: 4, symbol: 'USDC', name: 'USD Coin', price: '$1.00', change24h: '+0.01%', marketCap: '$32.9B', volume: '$5.4B', chartValues: [50, 50, 50, 50, 50, 50, 50], filterCategory: 'stable' },
    { id: 'yield-5', rank: 5, symbol: 'wstETH', name: 'Wrapped Staked ETH', price: '$3,850.42', change24h: '+2.15%', marketCap: '$28.4B', volume: '$450M', chartValues: [45, 47, 49, 51, 53, 55, 57], filterCategory: 'staking' },
    { id: 'yield-6', rank: 6, symbol: 'Mantle-LSP', name: 'Mantle Liquid Staking', price: '$1.12', change24h: '+2.84%', marketCap: '$890M', volume: '$65M', chartValues: [40, 42, 44, 46, 48, 50, 52], filterCategory: 'staking' },
  ] as YieldTokenRow[],
}

const iconBySymbol = {
  USDC: tokenIcons.TokenUSDC,
  MNT: tokenIcons.TokenMNT,
  USDY: tokenIcons.TokenUSDC,
  mETH: tokenIcons.TokenETH,
  WETH: tokenIcons.TokenETH,
  WBTC: tokenIcons.TokenBTC,
  DAI: tokenIcons.TokenDAI,
  USDT: tokenIcons.TokenUSDT,
  wstETH: tokenIcons.TokenETH,
  'MNT-LP': tokenIcons.TokenMNT,
  'Mantle-LSP': tokenIcons.TokenMNT,
} as const

const tokenDetailBySymbol: Record<StrategyOpportunityTokenDetail['symbol'], StrategyOpportunityTokenDetail> = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    price: '$1.00',
    change24h: '+0.01%',
    description: 'Stablecoin backed by USD reserves, primary settlement asset on Mantle.',
    marketCap: '$32.9B',
    chartValues: [50, 50, 50, 50, 50, 50, 50],
  },
  MNT: {
    symbol: 'MNT',
    name: 'Mantle',
    price: '$1.09',
    change24h: '+3.42%',
    description: 'Native token of Mantle network, used for gas and staking rewards.',
    marketCap: '$3.6B',
    chartValues: [24, 26, 28, 29, 33, 35, 39],
  },
  USDY: {
    symbol: 'USDY',
    name: 'Ondo US Dollar Yield',
    price: '$1.00',
    change24h: '+0.02%',
    description: 'RWA stablecoin with yield, backed by US Treasury bills and short-term bonds.',
    marketCap: '$2.4B',
    chartValues: [50, 50, 50, 50, 50, 50, 50],
  },
  mETH: {
    symbol: 'mETH',
    name: 'Mantle Ether',
    price: '$3,542.10',
    change24h: '+1.85%',
    description: 'RWA asset representing real-world ETH exposure on Mantle with yield generation.',
    marketCap: '$1.8B',
    chartValues: [48, 50, 52, 54, 56, 58, 60],
  },
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    price: '$3,542.10',
    change24h: '+1.85%',
    description: 'Wrapped ETH on Mantle for DeFi composability and trading.',
    marketCap: '$425.7B',
    chartValues: [48, 50, 52, 54, 56, 58, 60],
  },
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    price: '$68,421.22',
    change24h: '+1.39%',
    description: 'Wrapped BTC on Mantle for diversification and collateral.',
    marketCap: '$1.34T',
    chartValues: [58, 60, 61, 63, 62, 66, 68],
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    price: '$1.00',
    change24h: '+0.00%',
    description: 'Decentralized stablecoin alternative for settlement and yield.',
    marketCap: '$5.2B',
    chartValues: [50, 50, 50, 50, 50, 50, 50],
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    price: '$1.00',
    change24h: '+0.01%',
    description: 'Stablecoin alternative for trading and settlement on Mantle.',
    marketCap: '$118.5B',
    chartValues: [50, 50, 50, 50, 50, 50, 50],
  },
  wstETH: {
    symbol: 'wstETH',
    name: 'Wrapped Staked ETH',
    price: '$3,850.42',
    change24h: '+2.15%',
    description: 'Liquid staking token for ETH with yield generation from staking rewards.',
    marketCap: '$28.4B',
    chartValues: [45, 47, 49, 51, 53, 55, 57],
  },
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
    change24h: '+1.85%',
    description: 'Smart-contract network powering onchain apps, DeFi protocols, and rollups.',
    marketCap: '$425.7B',
    chartValues: [48, 50, 52, 54, 56, 58, 60],
  },
}

export default function YieldContent() {
  const [activeFilterId, setActiveFilterId] = useState<YieldFilterId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('change24h')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<YieldPageSize>(5)
  const [isPageSizeMenuOpen, setIsPageSizeMenuOpen] = useState(false)

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredRows = useMemo(() => {
    return yieldDataset.rows.filter((row) => {
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
      <MarketTickerCarousel items={yieldDataset.marketTickers} />

      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1.05 }}>{yieldDataset.strategiesTitle}</div>
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
          {yieldDataset.strategies.map((strategy) => (
            <StrategyOpportunityCard key={strategy.id} strategy={strategy} tokenDetails={tokenDetailBySymbol} />
          ))}
        </DashboardCard>
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1.05 }}>{yieldDataset.title}</div>

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
                placeholder="Search asset"
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
              {yieldDataset.filters.map((filter) => {
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

            <div data-yield-page-size-menu-root="true" style={{ position: 'relative', justifySelf: 'end' }}>
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

function getSortableValue(row: YieldTokenRow, field: SortField) {
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
