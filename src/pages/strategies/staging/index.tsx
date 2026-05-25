import type { UTCTimestamp } from 'lightweight-charts'
import type { ReactNode } from 'react'
import { ArrowSquareOut, CaretDown, CaretLeft, CaretRight, CaretUp, Coins, MagnifyingGlass, Question, Rows, ShareNetwork, SquaresFour } from '@phosphor-icons/react'
import { tokenIcons } from '@web3icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import handoffIcon from '../../../assets/icon/icon handoff.png'
import { DashboardCard, DashboardMetricCard, DashboardSectionCard } from '../../../components/card/dashboard-card'
import { StrategyPreviewCard } from '../../../components/card/strategy-preview-card'
import { TradeTokenMiniChart } from '../../../components/chart/trade-token-mini-chart'
import DropdownMenu, { type DropdownMenuItem } from '../../../components/dropdown/dropdown-menu'
import FundsModalController from '../../../components/funds/funds-modal-controller'
import type { FundsModalMode } from '../../../components/funds/funds-types'
import { StrategyTrendChart } from '../../../components/chart/strategy-trend-chart'
import DashboardLayout from '../../dashboard/dashboard-layout'

const strategyTokens = ['BTC', 'ETH', 'SOL'] as const
type StrategyTokenSymbol = (typeof strategyTokens)[number]

const iconBySymbol = {
  BTC: tokenIcons.TokenBTC,
  ETH: tokenIcons.TokenETH,
  SOL: tokenIcons.TokenSOL,
} as const

const tokenDetails: Record<
  StrategyTokenSymbol,
  {
    symbol: StrategyTokenSymbol
    name: string
    price: string
    change24h: string
    description: string
    marketCap: string
    chartValues: number[]
  }
> = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$103,200.45',
    change24h: '+2.18%',
    description: 'Bitcoin is the primary reserve asset in this strategy and drives the portfolio beta.',
    marketCap: '$2.03T',
    chartValues: [92, 95, 94, 98, 101, 100, 104],
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '$4,860.12',
    change24h: '+1.44%',
    description: 'Ethereum adds smart contract exposure and yield routing flexibility for the allocation.',
    marketCap: '$584.7B',
    chartValues: [66, 67, 69, 68, 71, 73, 74],
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    price: '$219.34',
    change24h: '-0.82%',
    description: 'Solana contributes high-throughput ecosystem exposure for growth-oriented strategy legs.',
    marketCap: '$101.9B',
    chartValues: [48, 50, 49, 47, 46, 45, 44],
  },
}

type StrategyPeriodId = '1D' | '1W' | '1M' | '1Y' | 'ALL'
type StagingStrategyViewType = 'card' | 'list'
type StagingStrategyPageSize = 3 | 6 | 9
type StrategyTableSortField = 'price' | 'change24h' | 'marketCap' | 'volume' | 'miniChart'
type StrategyTableSortDirection = 'asc' | 'desc'
type StrategyTablePageSize = 5 | 10 | 20

type StrategyTableRow = {
  id: string
  rank: number
  symbol: StrategyTokenSymbol
  name: string
  price: string
  change24h: string
  marketCap: string
  volume: string
  chartValues: number[]
}

const STAGING_STRATEGY_PAGE_SIZE_OPTIONS: StagingStrategyPageSize[] = [3, 6, 9]
const STRATEGY_TABLE_PAGE_SIZE_OPTIONS: StrategyTablePageSize[] = [5, 10, 20]

const strategySummaryDataset = {
  periods: [
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M', label: '1M' },
    { id: '1Y', label: '1Y' },
    { id: 'ALL', label: 'All' },
  ] as Array<{ id: StrategyPeriodId; label: string }>,
  activePeriodId: 'ALL' as StrategyPeriodId,
  totalValueLabel: 'Total Value',
  totalValue: 0,
  chartLabel: 'Total Return',
  chartSeries: [
    { time: 1717200000 as UTCTimestamp, value: 0 },
    { time: 1717286400 as UTCTimestamp, value: 0 },
    { time: 1717372800 as UTCTimestamp, value: 0 },
    { time: 1717459200 as UTCTimestamp, value: 0 },
    { time: 1717545600 as UTCTimestamp, value: 0 },
    { time: 1717632000 as UTCTimestamp, value: 0 },
    { time: 1717718400 as UTCTimestamp, value: 0 },
    { time: 1717804800 as UTCTimestamp, value: 0 },
    { time: 1717891200 as UTCTimestamp, value: 0 },
    { time: 1717977600 as UTCTimestamp, value: 0 },
  ],
  metrics: [
    {
      id: 'total-invested',
      label: 'Total Invested',
      value: '$0.00',
    },
    {
      id: 'users',
      label: 'Users',
      value: '0',
      meta: {
        icon: 'info' as const,
        text: 'No investors yet',
      },
    },
    {
      id: 'total-apr',
      label: 'Total APR',
      value: '+0.00%',
    },
  ],
}

const strategyTableDataset = {
  title: 'Strategies',
  rows: [
    { id: 'strategy-token-1', rank: 1, symbol: 'BTC', name: 'Bitcoin', price: '$103,200.45', change24h: '+2.18%', marketCap: '$2.03T', volume: '$44.1B', chartValues: [92, 95, 94, 98, 101, 100, 104] },
    { id: 'strategy-token-2', rank: 2, symbol: 'ETH', name: 'Ethereum', price: '$4,860.12', change24h: '+1.44%', marketCap: '$584.7B', volume: '$20.8B', chartValues: [66, 67, 69, 68, 71, 73, 74] },
    { id: 'strategy-token-3', rank: 3, symbol: 'SOL', name: 'Solana', price: '$219.34', change24h: '-0.82%', marketCap: '$101.9B', volume: '$7.9B', chartValues: [48, 50, 49, 47, 46, 45, 44] },
  ] as StrategyTableRow[],
}

const stagingStrategyPreviewDataset = [
  {
    id: 'staging-strategy-1',
    title: 'Strategy Name',
    href: '/strategies/staging',
    lastEditedLabel: 'Draft strategy',
    previewEmpty: true,
    previewVariant: 'default' as const,
  },
]

function parsePercent(value: string) {
  return Number(value.replace('%', '')) || 0
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatSignedCurrency(value: number) {
  const sign = value >= 0 ? '+' : '-'
  return `${sign}$${formatCurrency(Math.abs(value))}`
}

function formatSignedPercent(value: number) {
  const sign = value >= 0 ? '+' : '-'
  return `${sign}${Math.abs(value).toFixed(2)}%`
}

export default function StrategyStagingPage() {
  const [activePeriodId, setActivePeriodId] = useState<StrategyPeriodId>(strategySummaryDataset.activePeriodId)
  const [stagingStrategyViewType, setStagingStrategyViewType] = useState<StagingStrategyViewType>('list')
  const [stagingStrategyPage, setStagingStrategyPage] = useState(1)
  const [stagingStrategyPageSize, setStagingStrategyPageSize] = useState<StagingStrategyPageSize>(3)
  const [isStagingStrategyPageSizeMenuOpen, setIsStagingStrategyPageSizeMenuOpen] = useState(false)
  const [tableSearchQuery, setTableSearchQuery] = useState('')
  const [tableSortField, setTableSortField] = useState<StrategyTableSortField>('change24h')
  const [tableSortDirection, setTableSortDirection] = useState<StrategyTableSortDirection>('desc')
  const [tableCurrentPage, setTableCurrentPage] = useState(1)
  const [tablePageSize, setTablePageSize] = useState<StrategyTablePageSize>(5)
  const [isTablePageSizeMenuOpen, setIsTablePageSizeMenuOpen] = useState(false)
  const [hoveredTokenSymbol, setHoveredTokenSymbol] = useState<StrategyTokenSymbol | null>(null)
  const [activeFundsModal, setActiveFundsModal] = useState<FundsModalMode | null>(null)
  const hoverCloseTimeoutRef = useRef<number | null>(null)
  const hoveredToken = hoveredTokenSymbol ? tokenDetails[hoveredTokenSymbol] : null
  const selectedPeriod = strategySummaryDataset.periods.find((period) => period.id === activePeriodId) ?? strategySummaryDataset.periods[0]
  const currentValue = strategySummaryDataset.chartSeries[strategySummaryDataset.chartSeries.length - 1]?.value ?? strategySummaryDataset.totalValue
  const openingValue = strategySummaryDataset.chartSeries[0]?.value ?? strategySummaryDataset.totalValue
  const absoluteChange = currentValue - openingValue
  const percentChange = openingValue === 0 ? 0 : (absoluteChange / openingValue) * 100
  const normalizedTableQuery = tableSearchQuery.trim().toLowerCase()

  const filteredTableRows = useMemo(() => {
    return strategyTableDataset.rows.filter((row) => {
      const matchesSearch = normalizedTableQuery.length === 0 ? true : row.name.toLowerCase().includes(normalizedTableQuery) || row.symbol.toLowerCase().includes(normalizedTableQuery) || row.price.toLowerCase().includes(normalizedTableQuery)

      return matchesSearch
    })
  }, [normalizedTableQuery])

  const sortedTableRows = useMemo(() => {
    return [...filteredTableRows].sort((left, right) => {
      const leftValue = getStrategyTableSortableValue(left, tableSortField)
      const rightValue = getStrategyTableSortableValue(right, tableSortField)

      if (leftValue === rightValue) {
        return left.rank - right.rank
      }

      return tableSortDirection === 'asc' ? leftValue - rightValue : rightValue - leftValue
    })
  }, [filteredTableRows, tableSortDirection, tableSortField])

  const totalTablePages = Math.max(1, Math.ceil(sortedTableRows.length / tablePageSize))
  const clampedTablePage = Math.min(tableCurrentPage, totalTablePages)
  const paginatedTableRows = sortedTableRows.slice((clampedTablePage - 1) * tablePageSize, clampedTablePage * tablePageSize)
  const tablePageNumbers = Array.from({ length: totalTablePages }, (_, index) => index + 1)
  const tablePageSizeMenuGroups = [
    {
      items: STRATEGY_TABLE_PAGE_SIZE_OPTIONS.map((sizeOption) => ({
        label: `${sizeOption} items`,
        value: String(sizeOption),
        active: sizeOption === tablePageSize,
      })),
    },
  ]
  const totalStagingStrategyPages = Math.max(1, Math.ceil(stagingStrategyPreviewDataset.length / stagingStrategyPageSize))
  const clampedStagingStrategyPage = Math.min(stagingStrategyPage, totalStagingStrategyPages)
  const paginatedStagingStrategyPreviews = stagingStrategyPreviewDataset.slice((clampedStagingStrategyPage - 1) * stagingStrategyPageSize, clampedStagingStrategyPage * stagingStrategyPageSize)
  const stagingStrategyPageNumbers = Array.from({ length: totalStagingStrategyPages }, (_, index) => index + 1)
  const stagingStrategyPageSizeMenuGroups = [
    {
      items: STAGING_STRATEGY_PAGE_SIZE_OPTIONS.map((sizeOption) => ({
        label: `${sizeOption} items`,
        value: String(sizeOption),
        active: sizeOption === stagingStrategyPageSize,
      })),
    },
  ]

  const cancelHoverClose = () => {
    if (hoverCloseTimeoutRef.current !== null) {
      window.clearTimeout(hoverCloseTimeoutRef.current)
      hoverCloseTimeoutRef.current = null
    }
  }

  const scheduleHoverClose = () => {
    cancelHoverClose()
    hoverCloseTimeoutRef.current = window.setTimeout(() => {
      setHoveredTokenSymbol(null)
      hoverCloseTimeoutRef.current = null
    }, 180)
  }

  useEffect(() => {
    setTableCurrentPage((current) => Math.min(current, totalTablePages))
  }, [totalTablePages])

  useEffect(() => {
    setStagingStrategyPage((current) => Math.min(current, totalStagingStrategyPages))
  }, [totalStagingStrategyPages])

  useEffect(() => {
    if (!isTablePageSizeMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.closest('[data-staging-table-page-size-menu-root="true"]')) {
        return
      }

      setIsTablePageSizeMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isTablePageSizeMenuOpen])

  useEffect(() => {
    if (!isStagingStrategyPageSizeMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.closest('[data-staging-strategy-page-size-menu-root="true"]')) {
        return
      }

      setIsStagingStrategyPageSizeMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isStagingStrategyPageSizeMenuOpen])

  const metricMetaIconByType = {
    info: <Question size={14} weight="fill" color="var(--canvas-text-tertiary)" />,
  } as const

  const handleTableSort = (field: StrategyTableSortField) => {
    if (tableSortField === field) {
      setTableSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))
      return
    }

    setTableSortField(field)
    setTableSortDirection('desc')
  }

  const handleTablePageSizeMenuClick = (item: DropdownMenuItem) => {
    const nextPageSize = Number(item.value) as StrategyTablePageSize

    if (STRATEGY_TABLE_PAGE_SIZE_OPTIONS.includes(nextPageSize)) {
      setTablePageSize(nextPageSize)
      setTableCurrentPage(1)
    }

    setIsTablePageSizeMenuOpen(false)
  }

  const handleStagingStrategyPageSizeMenuClick = (item: DropdownMenuItem) => {
    const nextPageSize = Number(item.value) as StagingStrategyPageSize

    if (STAGING_STRATEGY_PAGE_SIZE_OPTIONS.includes(nextPageSize)) {
      setStagingStrategyPageSize(nextPageSize)
      setStagingStrategyPage(1)
    }

    setIsStagingStrategyPageSizeMenuOpen(false)
  }

  return (
    <DashboardLayout activeItem="Strategies" showHeaderActions={false}>
      <div
        style={{
          display: 'grid',
          gap: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ color: 'var(--canvas-text-primary)', fontSize: 30, fontWeight: 700, lineHeight: 1.05 }}>Strategy Name</div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
                {strategyTokens.map((symbol, index) => {
                  const Icon = iconBySymbol[symbol]

                  return (
                    <span
                      key={`${symbol}-${index}`}
                      onMouseEnter={() => {
                        cancelHoverClose()
                        setHoveredTokenSymbol(symbol)
                      }}
                      onMouseLeave={scheduleHoverClose}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '999px',
                        overflow: 'hidden',
                        border: '1px solid var(--canvas-bg)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: index === 0 ? 0 : -10,
                        flex: 'none',
                        position: 'relative',
                        zIndex: hoveredTokenSymbol === symbol ? 3 : index + 1,
                      }}
                    >
                      <Icon width={32} height={32} />
                    </span>
                  )
                })}

                {hoveredToken ? (
                  <div
                    onMouseEnter={() => {
                      cancelHoverClose()
                      setHoveredTokenSymbol(hoveredToken.symbol)
                    }}
                    onMouseLeave={scheduleHoverClose}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 'calc(100% + 12px)',
                      width: 280,
                      padding: 14,
                      borderRadius: 20,
                      border: '1px solid var(--canvas-panel-divider)',
                      background: 'var(--canvas-dashboard-card-bg)',
                      boxShadow: 'var(--canvas-shadow-floating)',
                      display: 'grid',
                      gap: 12,
                      zIndex: 10,
                      pointerEvents: 'auto',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: '100%',
                        height: 12,
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <span style={{ width: 34, height: 34, borderRadius: '999px', overflow: 'hidden', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                          {(() => {
                            const HoveredIcon = iconBySymbol[hoveredToken.symbol]

                            return <HoveredIcon width={34} height={34} />
                          })()}
                        </span>
                        <div style={{ minWidth: 0, display: 'grid', gap: 2 }}>
                          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{hoveredToken.name}</div>
                          <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11, fontWeight: 500, lineHeight: 1.2 }}>{hoveredToken.symbol}</div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', justifyItems: 'end', gap: 2, flex: 'none' }}>
                        <div style={{ color: 'var(--canvas-text-primary)', fontSize: 13, fontWeight: 700 }}>{hoveredToken.price}</div>
                        <div style={{ color: parsePercent(hoveredToken.change24h) >= 0 ? 'var(--canvas-accent)' : 'var(--canvas-negative)', fontSize: 11, fontWeight: 600 }}>{hoveredToken.change24h}</div>
                      </div>
                    </div>

                    <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 11, fontWeight: 500, lineHeight: 1.6 }}>{hoveredToken.description}</div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11, fontWeight: 500 }}>Market Cap</div>
                      <div style={{ color: 'var(--canvas-text-primary)', fontSize: 12, fontWeight: 700 }}>{hoveredToken.marketCap}</div>
                    </div>

                    <div style={{ width: '100%', height: 68 }}>
                      <TradeTokenMiniChart values={hoveredToken.chartValues} positive={parsePercent(hoveredToken.change24h) >= 0} />
                    </div>

                    <button
                      type="button"
                      style={{
                        height: 34,
                        borderRadius: 999,
                        border: '1px solid var(--canvas-panel-divider)',
                        background: 'transparent',
                        color: 'var(--canvas-text-primary)',
                        fontFamily: 'var(--canvas-font-sans)',
                        fontSize: 11,
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer',
                      }}
                    >
                      <ArrowSquareOut size={14} weight="bold" />
                      <span>View detail</span>
                    </button>
                  </div>
                ) : null}
              </div>

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
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              style={{
                height: 40,
                padding: '0 16px',
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'transparent',
                color: 'var(--canvas-text-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 13,
                fontWeight: 600,
                boxSizing: 'border-box',
              }}
            >
              <ShareNetwork size={16} weight="bold" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div
          style={{
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.55fr) minmax(280px, 0.95fr)',
            gap: 18,
          }}
        >
          <DashboardSectionCard
            headerStyle={{ gridTemplateRows: 'auto auto auto', gap: 10 }}
            header={
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 14, fontWeight: 600 }}>{strategySummaryDataset.totalValueLabel}</div>
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
                    {strategySummaryDataset.periods.map((period) => {
                      const active = period.id === selectedPeriod.id

                      return (
                        <button
                          key={period.id}
                          type="button"
                          onClick={() => setActivePeriodId(period.id)}
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
                            transition: 'background 120ms ease, color 120ms ease',
                          }}
                        >
                          {period.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div style={{ color: 'var(--canvas-text-primary)', fontSize: 38, fontWeight: 700, lineHeight: 1 }}>${formatCurrency(currentValue)}</div>
                <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 14, fontWeight: 500 }}>{`Change ${formatSignedCurrency(absoluteChange)} (${formatSignedPercent(percentChange)})`}</div>
              </div>
            }
          >
            <StrategyTrendChart data={strategySummaryDataset.chartSeries} label={strategySummaryDataset.chartLabel} />
          </DashboardSectionCard>

          <div
            style={{
              minHeight: 0,
              display: 'grid',
              gridTemplateRows: '1fr 1fr 1fr',
              gap: 18,
            }}
          >
            {strategySummaryDataset.metrics.map((metric) => (
              <DashboardMetricCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                labelSuffix={metric.meta ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      height: 28,
                      padding: '0 10px',
                      borderRadius: 999,
                      border: '1px solid var(--canvas-panel-divider)',
                      background: 'var(--canvas-surface-soft-strong)',
                      color: 'var(--canvas-text-primary)',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{metricMetaIconByType[metric.meta.icon]}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1 }}>{metric.meta.text}</span>
                  </span>
                ) : undefined}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1.05 }}>{strategyTableDataset.title}</div>

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
                  value={tableSearchQuery}
                  onChange={(event) => {
                    setTableSearchQuery(event.target.value)
                    setTableCurrentPage(1)
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
            </div>

            <div style={{ overflow: 'hidden', borderRadius: 18, border: '1px solid var(--canvas-panel-divider)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ background: 'var(--canvas-surface-soft)' }}>
                    <th style={tableHeaderCellStyle}>Token</th>
                    <th style={tableHeaderCellStyle}>{renderStrategyTableSortableHeader('Price', tableSortField === 'price', tableSortDirection, () => handleTableSort('price'))}</th>
                    <th style={tableHeaderCellStyle}>{renderStrategyTableSortableHeader('24h', tableSortField === 'change24h', tableSortDirection, () => handleTableSort('change24h'))}</th>
                    <th style={tableHeaderCellStyle}>{renderStrategyTableSortableHeader('Marketcap', tableSortField === 'marketCap', tableSortDirection, () => handleTableSort('marketCap'))}</th>
                    <th style={tableHeaderCellStyle}>{renderStrategyTableSortableHeader('Volume', tableSortField === 'volume', tableSortDirection, () => handleTableSort('volume'))}</th>
                    <th style={tableHeaderCellStyle}>{renderStrategyTableSortableHeader('24h', tableSortField === 'miniChart', tableSortDirection, () => handleTableSort('miniChart'))}</th>
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
                    {paginatedTableRows.map((row) => {
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
                {sortedTableRows.length > 0 ? `Showing ${(clampedTablePage - 1) * tablePageSize + 1}-${Math.min(clampedTablePage * tablePageSize, sortedTableRows.length)} of ${sortedTableRows.length}` : 'Showing 0 of 0'}
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setTableCurrentPage((current) => Math.max(1, current - 1))} disabled={clampedTablePage === 1} style={{ ...paginationButtonStyle, opacity: clampedTablePage === 1 ? 0.45 : 1, cursor: clampedTablePage === 1 ? 'default' : 'pointer' }}>
                  <span>Prev</span>
                </button>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {tablePageNumbers.map((pageNumber) => {
                    const active = pageNumber === clampedTablePage

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setTableCurrentPage(pageNumber)}
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
                <button type="button" onClick={() => setTableCurrentPage((current) => Math.min(totalTablePages, current + 1))} disabled={clampedTablePage === totalTablePages} style={{ ...paginationButtonStyle, opacity: clampedTablePage === totalTablePages ? 0.45 : 1, cursor: clampedTablePage === totalTablePages ? 'default' : 'pointer' }}>
                  <span>Next</span>
                </button>
              </div>

              <div data-staging-table-page-size-menu-root="true" style={{ position: 'relative', justifySelf: 'end' }}>
                <button
                  type="button"
                  onClick={() => setIsTablePageSizeMenuOpen((current) => !current)}
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
                  {tablePageSize} items
                  <CaretDown size={12} weight="bold" style={{ transform: `rotate(${isTablePageSizeMenuOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
                </button>

                {isTablePageSizeMenuOpen ? (
                  <DropdownMenu
                    open={isTablePageSizeMenuOpen}
                    groups={tablePageSizeMenuGroups}
                    onItemClick={handleTablePageSizeMenuClick}
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

        <DashboardCard
          style={{
            padding: 22,
            display: 'grid',
            gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
            gap: 14,
            minHeight: 0,
            height: stagingStrategyViewType === 'card' ? 520 : 430,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ color: 'var(--canvas-text-primary)', fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>Your Strategies</div>
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
              <button
                type="button"
                aria-label="Card view"
                title="Card view"
                onClick={() => {
                  setStagingStrategyViewType('card')
                }}
                style={{
                  width: 30,
                  height: 30,
                  border: 'none',
                  borderRadius: 999,
                  background: stagingStrategyViewType === 'card' ? 'var(--canvas-accent)' : 'transparent',
                  color: stagingStrategyViewType === 'card' ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-tertiary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <SquaresFour size={14} weight={stagingStrategyViewType === 'card' ? 'fill' : 'regular'} />
              </button>
              <button
                type="button"
                aria-label="List view"
                title="List view"
                onClick={() => {
                  setStagingStrategyViewType('list')
                }}
                style={{
                  width: 30,
                  height: 30,
                  border: 'none',
                  borderRadius: 999,
                  background: stagingStrategyViewType === 'list' ? 'var(--canvas-accent)' : 'transparent',
                  color: stagingStrategyViewType === 'list' ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-tertiary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Rows size={14} weight={stagingStrategyViewType === 'list' ? 'fill' : 'regular'} />
              </button>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              minHeight: 0,
              flex: '1 1 auto',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {stagingStrategyViewType === 'list' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '92px minmax(180px, 1.2fr) minmax(120px, 0.8fr) minmax(160px, 1fr)',
                  gap: 14,
                  padding: '0 14px',
                  color: 'var(--canvas-text-secondary)',
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  boxSizing: 'border-box',
                }}
              >
                <div>Preview</div>
                <div>Name</div>
                <div>Last Update</div>
                <div>Collaborate</div>
              </div>
            ) : null}

            <div
              className="dashboardContentScrollArea"
              style={{
                minHeight: 0,
                flex: '1 1 auto',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: 2,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: stagingStrategyViewType === 'card' ? 'repeat(3, minmax(0, 1fr))' : 'minmax(0, 1fr)',
                  gap: stagingStrategyViewType === 'card' ? 22 : 0,
                  minHeight: stagingStrategyViewType === 'list' ? '100%' : undefined,
                  alignContent: 'start',
                }}
              >
                {paginatedStagingStrategyPreviews.map((strategy, index) => (
                  <StrategyPreviewCard
                    key={strategy.id}
                    title={strategy.title}
                    href={strategy.href}
                    lastEditedLabel={strategy.lastEditedLabel}
                    previewVariant={strategy.previewVariant}
                    previewEmpty={strategy.previewEmpty}
                    viewType={stagingStrategyViewType}
                    isLastInList={stagingStrategyViewType === 'list' && index === paginatedStagingStrategyPreviews.length - 1}
                    showCollaborators={false}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              alignItems: 'center',
              gap: 12,
              flex: '0 0 auto',
              alignSelf: 'end',
              width: '100%',
              minHeight: 44,
              marginTop: 'auto',
              paddingTop: 12,
              borderTop: '1px solid var(--canvas-panel-divider)',
            }}
          >
            <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500 }}>
              Showing {paginatedStagingStrategyPreviews.length === 0 ? 0 : (clampedStagingStrategyPage - 1) * stagingStrategyPageSize + 1}-{Math.min(clampedStagingStrategyPage * stagingStrategyPageSize, stagingStrategyPreviewDataset.length)} of {stagingStrategyPreviewDataset.length}
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setStagingStrategyPage((current) => Math.max(1, current - 1))}
                disabled={clampedStagingStrategyPage === 1}
                style={{
                  minWidth: 32,
                  height: 32,
                  padding: '0 10px',
                  borderRadius: 999,
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'transparent',
                  color: clampedStagingStrategyPage === 1 ? 'var(--canvas-text-tertiary)' : 'var(--canvas-text-primary)',
                  cursor: clampedStagingStrategyPage === 1 ? 'default' : 'pointer',
                  opacity: clampedStagingStrategyPage === 1 ? 0.6 : 1,
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                <CaretLeft size={12} weight="bold" />
              </button>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {stagingStrategyPageNumbers.map((pageNumber) => {
                  const active = pageNumber === clampedStagingStrategyPage

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setStagingStrategyPage(pageNumber)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 999,
                        border: '1px solid var(--canvas-panel-divider)',
                        background: active ? 'var(--canvas-accent)' : 'transparent',
                        color: active ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-primary)',
                        cursor: 'pointer',
                        fontFamily: 'var(--canvas-font-sans)',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => setStagingStrategyPage((current) => Math.min(totalStagingStrategyPages, current + 1))}
                disabled={clampedStagingStrategyPage === totalStagingStrategyPages}
                style={{
                  minWidth: 32,
                  height: 32,
                  padding: '0 10px',
                  borderRadius: 999,
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'transparent',
                  color: clampedStagingStrategyPage === totalStagingStrategyPages ? 'var(--canvas-text-tertiary)' : 'var(--canvas-text-primary)',
                  cursor: clampedStagingStrategyPage === totalStagingStrategyPages ? 'default' : 'pointer',
                  opacity: clampedStagingStrategyPage === totalStagingStrategyPages ? 0.6 : 1,
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                <CaretRight size={12} weight="bold" />
              </button>
            </div>

            <div data-staging-strategy-page-size-menu-root="true" style={{ position: 'relative', justifySelf: 'end' }}>
              <button
                type="button"
                onClick={() => setIsStagingStrategyPageSizeMenuOpen((current) => !current)}
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
                {stagingStrategyPageSize} items
                <CaretDown size={12} weight="bold" style={{ transform: `rotate(${isStagingStrategyPageSizeMenuOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
              </button>

              {isStagingStrategyPageSizeMenuOpen ? (
                <DropdownMenu
                  open={isStagingStrategyPageSizeMenuOpen}
                  groups={stagingStrategyPageSizeMenuGroups}
                  onItemClick={handleStagingStrategyPageSizeMenuClick}
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

        <FundsModalController mode={activeFundsModal} onClose={() => setActiveFundsModal(null)} />
      </div>
    </DashboardLayout>
  )
}

function getStrategyTableSortableValue(row: StrategyTableRow, field: StrategyTableSortField) {
  if (field === 'miniChart') {
    return parsePercent(row.change24h)
  }

  return Number(row[field].replace(/[^0-9+.-]/g, '')) || 0
}

function renderStrategyTableSortableHeader(label: string, active: boolean, direction: StrategyTableSortDirection, onClick: () => void): ReactNode {
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
