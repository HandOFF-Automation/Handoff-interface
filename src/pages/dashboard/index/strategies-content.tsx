import type { UTCTimestamp } from 'lightweight-charts'
import { CaretDown, CaretLeft, CaretRight, Coins, Question, Rows, SquaresFour } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import { DashboardCard, DashboardMetricCard, DashboardSectionCard } from '../../../components/card/dashboard-card'
import DropdownMenu, { type DropdownMenuItem } from '../../../components/dropdown/dropdown-menu'
import FundsModalController from '../../../components/funds/funds-modal-controller'
import type { FundsModalMode } from '../../../components/funds/funds-types'
import { SocialActionCard } from '../../../components/card/social-action-card'
import { StrategyPreviewCard, type StrategyCollaborator } from '../../../components/card/strategy-preview-card'
import { StrategyTrendChart } from '../../../components/chart/strategy-trend-chart'

type StrategyPeriodId = '1D' | '1W' | '1M' | '1Y' | 'ALL'
type StrategyListFilterId = 'all' | 'new' | 'solo' | 'collaborate'
type StrategyViewType = 'card' | 'list'
type StrategyPageSize = 3 | 6 | 9

const STRATEGY_PAGE_SIZE_OPTIONS: StrategyPageSize[] = [3, 6, 9]

type StrategyPeriodOption = {
  id: StrategyPeriodId
  label: string
}

type StrategyMetric = {
  id: string
  label: string
  value: string
  inlineDetail?: string
  labelSuffix?: 'info'
  meta?: {
    icon: 'info'
    text: string
  }
}

type StrategyPreview = {
  id: string
  title: string
  href: string
  lastEditedLabel: string
  collaborators?: StrategyCollaborator[]
  previewVariant?: 'default' | 'shifted' | 'wide'
  previewEmpty?: boolean
  category: Exclude<StrategyListFilterId, 'all'>
}

type StrategyDataset = {
  periods: StrategyPeriodOption[]
  activePeriodId: StrategyPeriodId
  totalValueLabel: string
  totalValue: number
  chartLabel: string
  chartSeries: Array<{ time: UTCTimestamp; value: number }>
  metrics: StrategyMetric[]
  strategyPreviews: StrategyPreview[]
  actions: Array<{
    id: string
    title: string
    description: string
    icon: 'email' | 'x' | 'invite'
    connected?: boolean
    connectedLabel?: string
    connectedValue?: string
  }>
}

const strategyDataset: StrategyDataset = {
  periods: [
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M', label: '1M' },
    { id: '1Y', label: '1Y' },
    { id: 'ALL', label: 'All' },
  ],
  activePeriodId: 'ALL',
  totalValueLabel: 'Total Value',
  totalValue: 0,
  chartLabel: 'Total Value',
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
      id: 'points',
      label: 'Points',
      value: '0 Point',
      labelSuffix: 'info',
      meta: {
        icon: 'info',
        text: 'Earning 0/day',
      },
    },
    {
      id: 'change-24h',
      label: '24h Change',
      value: '$0.00',
      inlineDetail: '(+0.00%)',
    },
    {
      id: 'gas-saved',
      label: 'Gas Saved',
      value: '+$0.00',
    },
  ],
  strategyPreviews: [
    {
      id: 'strategy-solo-alpha',
      title: 'Momentum Alpha',
      href: '/canvas/momentum-alpha',
      lastEditedLabel: 'Last edited 2h ago',
      previewEmpty: true,
      category: 'new',
    },
    {
      id: 'strategy-collab-yield',
      title: 'Yield Rotation',
      href: '/canvas/yield-rotation',
      lastEditedLabel: 'Last edited May 18, 2026',
      previewEmpty: true,
      category: 'collaborate',
      collaborators: [
        { id: 'user-1', name: 'Mika' },
        { id: 'user-2', name: 'Rafi' },
        { id: 'user-3', name: 'Nadia' },
      ],
    },
    {
      id: 'strategy-collab-arb',
      title: 'Stablecoin Arb',
      href: '/canvas/stablecoin-arb',
      lastEditedLabel: 'Last edited yesterday',
      previewEmpty: true,
      category: 'solo',
    },
    {
      id: 'strategy-collab-balance',
      title: 'Balanced Flow',
      href: '/canvas/balanced-flow',
      lastEditedLabel: 'Last edited 4d ago',
      previewEmpty: true,
      category: 'collaborate',
      collaborators: [
        { id: 'user-6', name: 'Sena' },
        { id: 'user-7', name: 'Bima' },
      ],
    },
  ],
  actions: [
    {
      id: 'connect-email',
      title: 'Connect Email',
      description: 'Link your email to unlock recovery and notification flows.',
      icon: 'email',
      connected: true,
      connectedLabel: 'Connected',
      connectedValue: 'handoff@handoff.app',
    },
    {
      id: 'connect-x',
      title: 'Connect X/Twitter',
      description: 'Connect your X account to verify social identity and activity.',
      icon: 'x',
    },
    {
      id: 'invite-friend',
      title: 'Invite Friend',
      description: 'Invite friends to your strategy workspace and grow your network.',
      icon: 'invite',
    },
  ],
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

export default function StrategiesContent() {
  const [activePeriodId, setActivePeriodId] = useState<StrategyPeriodId>(strategyDataset.activePeriodId)
  const [activeStrategyFilterId, setActiveStrategyFilterId] = useState<StrategyListFilterId>('all')
  const [strategyViewType, setStrategyViewType] = useState<StrategyViewType>('list')
  const [strategyPage, setStrategyPage] = useState(1)
  const [strategyPageSize, setStrategyPageSize] = useState<StrategyPageSize>(3)
  const [isStrategyPageSizeMenuOpen, setIsStrategyPageSizeMenuOpen] = useState(false)
  const [activeFundsModal, setActiveFundsModal] = useState<FundsModalMode | null>(null)

  const selectedPeriod = strategyDataset.periods.find((period) => period.id === activePeriodId) ?? strategyDataset.periods[0]
  const currentValue = strategyDataset.chartSeries[strategyDataset.chartSeries.length - 1]?.value ?? strategyDataset.totalValue
  const openingValue = strategyDataset.chartSeries[0]?.value ?? strategyDataset.totalValue
  const absoluteChange = currentValue - openingValue
  const percentChange = openingValue === 0 ? 0 : (absoluteChange / openingValue) * 100
  const strategyFilterOptions: Array<{ id: StrategyListFilterId; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'solo', label: 'Solo' },
    { id: 'collaborate', label: 'Collaborate' },
  ]
  const filteredStrategyPreviews = strategyDataset.strategyPreviews.filter((strategy) => {
    if (activeStrategyFilterId === 'all') {
      return true
    }

    if (activeStrategyFilterId === 'solo') {
      return !strategy.collaborators?.length || strategy.category === 'solo'
    }

    if (activeStrategyFilterId === 'collaborate') {
      return Boolean(strategy.collaborators?.length)
    }

    return strategy.category === activeStrategyFilterId
  })
  const totalStrategyPages = Math.max(1, Math.ceil(filteredStrategyPreviews.length / strategyPageSize))
  const clampedStrategyPage = Math.min(strategyPage, totalStrategyPages)
  const paginatedStrategyPreviews = filteredStrategyPreviews.slice((clampedStrategyPage - 1) * strategyPageSize, clampedStrategyPage * strategyPageSize)
  const strategyPageNumbers = Array.from({ length: totalStrategyPages }, (_, index) => index + 1)
  const strategyPageSizeMenuGroups = [
    {
      items: STRATEGY_PAGE_SIZE_OPTIONS.map((sizeOption) => ({
        label: `${sizeOption} items`,
        value: String(sizeOption),
        active: sizeOption === strategyPageSize,
      })),
    },
  ]

  useEffect(() => {
    setStrategyPage(1)
  }, [activeStrategyFilterId, strategyViewType, strategyPageSize])

  useEffect(() => {
    if (!isStrategyPageSizeMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.closest('[data-strategy-page-size-menu-root="true"]')) {
        return
      }

      setIsStrategyPageSizeMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isStrategyPageSizeMenuOpen])

  const handleStrategyPageSizeMenuClick = (item: DropdownMenuItem) => {
    const nextPageSize = Number(item.value) as StrategyPageSize

    if (STRATEGY_PAGE_SIZE_OPTIONS.includes(nextPageSize)) {
      setStrategyPageSize(nextPageSize)
    }

    setIsStrategyPageSizeMenuOpen(false)
  }

  const metricMetaIconByType = {
    info: <Question size={14} weight="fill" color="var(--canvas-text-tertiary)" />,
  } as const

  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
      }}
    >
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
                <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 14, fontWeight: 600 }}>{strategyDataset.totalValueLabel}</div>
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
                  {strategyDataset.periods.map((period) => {
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
          <StrategyTrendChart data={strategyDataset.chartSeries} label={strategyDataset.chartLabel} />
        </DashboardSectionCard>

        <div
          style={{
            minHeight: 0,
            display: 'grid',
            gridTemplateRows: '1fr 1fr 1fr',
            gap: 18,
          }}
        >
          {strategyDataset.metrics.map((metric) => (
            <DashboardMetricCard
              key={metric.id}
              label={metric.label}
              value={metric.value}
              inlineDetail={metric.inlineDetail}
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 18,
        }}
      >
        {strategyDataset.actions.map((action) => (
          <SocialActionCard
            key={action.id}
            title={action.title}
            description={action.description}
            icon={action.icon}
            connected={action.connected}
            connectedLabel={action.connectedLabel}
            connectedValue={action.connectedValue}
          />
        ))}
      </div>

      <div style={{ color: 'var(--canvas-text-primary)', fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>Your Strategies</div>

      <DashboardCard
        style={{
          padding: 22,
          display: 'grid',
          gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
          gap: 14,
          minHeight: 0,
          height: strategyViewType === 'card' ? 520 : 430,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: 4,
              borderRadius: 999,
              border: '1px solid var(--canvas-panel-divider)',
              background: 'var(--canvas-surface-soft)',
              width: 'fit-content',
            }}
          >
            {strategyFilterOptions.map((filter) => {
              const active = filter.id === activeStrategyFilterId

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => {
                    setActiveStrategyFilterId(filter.id)
                  }}
                  style={{
                    height: 30,
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
                  {filter.label}
                </button>
              )
            })}
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
            <button
              type="button"
              aria-label="Card view"
              title="Card view"
              onClick={() => {
                setStrategyViewType('card')
              }}
              style={{
                width: 30,
                height: 30,
                border: 'none',
                borderRadius: 999,
                background: strategyViewType === 'card' ? 'var(--canvas-accent)' : 'transparent',
                color: strategyViewType === 'card' ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-tertiary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <SquaresFour size={14} weight={strategyViewType === 'card' ? 'fill' : 'regular'} />
            </button>
            <button
              type="button"
              aria-label="List view"
              title="List view"
              onClick={() => {
                setStrategyViewType('list')
              }}
              style={{
                width: 30,
                height: 30,
                border: 'none',
                borderRadius: 999,
                background: strategyViewType === 'list' ? 'var(--canvas-accent)' : 'transparent',
                color: strategyViewType === 'list' ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-tertiary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Rows size={14} weight={strategyViewType === 'list' ? 'fill' : 'regular'} />
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
          {strategyViewType === 'list' ? (
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
                gridTemplateColumns: strategyViewType === 'card' ? 'repeat(3, minmax(0, 1fr))' : 'minmax(0, 1fr)',
                gap: strategyViewType === 'card' ? 22 : 0,
                minHeight: strategyViewType === 'list' ? '100%' : undefined,
                alignContent: 'start',
              }}
            >
              {paginatedStrategyPreviews.map((strategy, index) => (
                <StrategyPreviewCard
                  key={strategy.id}
                  title={strategy.title}
                  href={strategy.href}
                  lastEditedLabel={strategy.lastEditedLabel}
                  collaborators={strategy.collaborators}
                  previewVariant={strategy.previewVariant}
                  previewEmpty={strategy.previewEmpty}
                  viewType={strategyViewType}
                  isLastInList={strategyViewType === 'list' && index === paginatedStrategyPreviews.length - 1}
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
            Showing {paginatedStrategyPreviews.length === 0 ? 0 : (clampedStrategyPage - 1) * strategyPageSize + 1}-{Math.min(clampedStrategyPage * strategyPageSize, filteredStrategyPreviews.length)} of {filteredStrategyPreviews.length}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setStrategyPage((current) => Math.max(1, current - 1))}
              disabled={clampedStrategyPage === 1}
              style={{
                minWidth: 32,
                height: 32,
                padding: '0 10px',
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'transparent',
                color: clampedStrategyPage === 1 ? 'var(--canvas-text-tertiary)' : 'var(--canvas-text-primary)',
                cursor: clampedStrategyPage === 1 ? 'default' : 'pointer',
                opacity: clampedStrategyPage === 1 ? 0.6 : 1,
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Prev
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {strategyPageNumbers.map((pageNumber) => {
                const active = pageNumber === clampedStrategyPage

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setStrategyPage(pageNumber)}
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
              onClick={() => setStrategyPage((current) => Math.min(totalStrategyPages, current + 1))}
              disabled={clampedStrategyPage === totalStrategyPages}
              style={{
                minWidth: 32,
                height: 32,
                padding: '0 10px',
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'transparent',
                color: clampedStrategyPage === totalStrategyPages ? 'var(--canvas-text-tertiary)' : 'var(--canvas-text-primary)',
                cursor: clampedStrategyPage === totalStrategyPages ? 'default' : 'pointer',
                opacity: clampedStrategyPage === totalStrategyPages ? 0.6 : 1,
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Next
            </button>
          </div>

          <div
            data-strategy-page-size-menu-root="true"
            style={{ position: 'relative', justifySelf: 'end' }}
          >
            <button
              type="button"
              onClick={() => setIsStrategyPageSizeMenuOpen((current) => !current)}
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
              {strategyPageSize} items
              <CaretDown size={12} weight="bold" style={{ transform: `rotate(${isStrategyPageSizeMenuOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
            </button>

            {isStrategyPageSizeMenuOpen ? (
              <DropdownMenu
                open={isStrategyPageSizeMenuOpen}
                groups={strategyPageSizeMenuGroups}
                onItemClick={handleStrategyPageSizeMenuClick}
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
  )
}

const smallActionButtonStyle: React.CSSProperties = {
  height: 34,
  padding: '0 14px',
  borderRadius: 999,
  border: '1px solid var(--canvas-panel-divider)',
  background: 'transparent',
  color: 'var(--canvas-text-primary)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--canvas-font-sans)',
  fontSize: 11,
  fontWeight: 600,
}
