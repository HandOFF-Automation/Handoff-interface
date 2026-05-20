import { ArrowSquareOut, ChartPieSlice, Coins } from '@phosphor-icons/react'
import { tokenIcons } from '@web3icons/react'
import { useRef, useState } from 'react'

import { TradeTokenMiniChart } from '../chart/trade-token-mini-chart'
import TickerLogo from '../icon/ticker-logo'
import { DashboardCard } from './dashboard-card'

type StrategyOpportunitySymbol = 'BTC' | 'ETH' | 'SOL' | 'USDC' | 'ARB' | 'MNT' | 'AAPL' | 'MSFT' | 'NVDA' | 'AMZN' | 'GOOGL' | 'TSLA'

type StrategyOpportunityTokenDetail = {
  symbol: StrategyOpportunitySymbol
  name: string
  price: string
  change24h: string
  description: string
  marketCap: string
  chartValues: number[]
  assetType?: 'crypto' | 'stock'
}

type StrategyOpportunityCardData = {
  id: string
  title: string
  totalApr: string
  tokens: StrategyOpportunitySymbol[]
}

type StrategyOpportunityCardProps = {
  strategy: StrategyOpportunityCardData
  tokenDetails: Record<StrategyOpportunitySymbol, StrategyOpportunityTokenDetail>
}

const iconBySymbol = {
  BTC: tokenIcons.TokenBTC,
  ETH: tokenIcons.TokenETH,
  SOL: tokenIcons.TokenSOL,
  USDC: tokenIcons.TokenUSDC,
  ARB: tokenIcons.TokenARB,
  MNT: tokenIcons.TokenMNT,
} as const

function parsePercent(value: string) {
  return Number(value.replace('%', '')) || 0
}

export function StrategyOpportunityCard({ strategy, tokenDetails }: StrategyOpportunityCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [hoveredTokenSymbol, setHoveredTokenSymbol] = useState<StrategyOpportunitySymbol | null>(null)
  const hoverCloseTimeoutRef = useRef<number | null>(null)
  const hoveredToken = hoveredTokenSymbol ? tokenDetails[hoveredTokenSymbol] : null

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

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setExpanded((current) => !current)}
      style={{
        width: '100%',
        padding: 0,
        border: 'none',
        background: 'transparent',
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <DashboardCard
        style={{
          padding: '18px 18px 16px',
          borderRadius: 22,
          display: 'grid',
          height: '100%',
          gridTemplateRows: 'auto minmax(0, 1fr) auto',
          gap: 16,
          transition: 'background-color 180ms ease, border-color 180ms ease, transform 180ms ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
            {strategy.tokens.map((symbol, index) => {
              const Icon = iconBySymbol[symbol]
              const detail = tokenDetails[symbol]
              const isStock = detail?.assetType === 'stock'

              return (
                <span
                  key={`${strategy.id}-${symbol}-${index}`}
                  onMouseEnter={() => {
                    cancelHoverClose()
                    setHoveredTokenSymbol(symbol)
                  }}
                  onMouseLeave={scheduleHoverClose}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '999px',
                    overflow: 'hidden',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: index === 0 ? 0 : -10,
                    flex: 'none',
                    position: 'relative',
                    zIndex: hoveredTokenSymbol === symbol ? 3 : index + 1,
                  }}
                >
                  {isStock ? (
                    <TickerLogo ticker={symbol} size={30} alt={`${symbol} logo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : Icon ? (
                    <Icon width={30} height={30} />
                  ) : (
                    <TickerLogo ticker={symbol} size={30} alt={`${symbol} logo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
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
                        return hoveredToken.assetType === 'stock' ? (
                          <TickerLogo ticker={hoveredToken.symbol} size={34} alt={`${hoveredToken.symbol} logo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : HoveredIcon ? (
                          <HoveredIcon width={34} height={34} />
                        ) : (
                          <TickerLogo ticker={hoveredToken.symbol} size={34} alt={`${hoveredToken.symbol} logo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )
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
                  onClick={(event) => event.stopPropagation()}
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
                  }}
                >
                  <ArrowSquareOut size={14} weight="bold" />
                  <span>View detail</span>
                </button>
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 28,
              padding: '0 10px',
              borderRadius: 999,
              border: '1px solid var(--canvas-panel-divider)',
              background: 'transparent',
              color: parsePercent(strategy.totalApr) >= 0 ? 'var(--canvas-accent)' : 'var(--canvas-negative)',
              fontSize: 11,
              fontWeight: 600,
              lineHeight: 1,
              boxSizing: 'border-box',
              whiteSpace: 'nowrap',
              flex: 'none',
            }}
          >
            {strategy.totalApr} Alltime APR
          </div>
        </div>

        <div style={{ display: 'grid', alignContent: 'start', gap: 12, minHeight: 0 }}>
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{strategy.title}</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateRows: expanded ? '1fr' : '0fr',
            transition: 'grid-template-rows 220ms ease',
            alignSelf: 'end',
            marginTop: 14,
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 10,
                paddingTop: 2,
                opacity: expanded ? 1 : 0,
                transform: `translateY(${expanded ? '0' : '-6px'})`,
                transition: 'opacity 180ms ease 80ms, transform 180ms ease 80ms',
              }}
            >
              <button
                type="button"
                onClick={(event) => event.stopPropagation()}
                style={{
                  height: 34,
                  borderRadius: 999,
                  border: '1px solid var(--canvas-accent)',
                  background: 'var(--canvas-accent)',
                  color: 'var(--canvas-text-on-accent)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 11,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Coins size={14} weight="bold" />
                <span>Invest now</span>
              </button>
              <button
                type="button"
                onClick={(event) => event.stopPropagation()}
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
                }}
              >
                <ChartPieSlice size={14} weight="bold" />
                <span>View strategies</span>
              </button>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  )
}

export type { StrategyOpportunityCardData, StrategyOpportunitySymbol, StrategyOpportunityTokenDetail }
