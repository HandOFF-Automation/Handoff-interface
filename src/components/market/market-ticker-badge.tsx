import { tokenIcons } from '@web3icons/react'

import TickerLogo from '../icon/ticker-logo'

type MarketTickerBadgeProps = {
  symbol: string
  price: string
  changePercent: number
  assetType?: 'crypto' | 'stock'
}

function formatPercentChange(value: number) {
  const sign = value >= 0 ? '+' : '-'
  return `${sign}${Math.abs(value).toFixed(2)}%`
}

const iconBySymbol = {
  BTC: tokenIcons.TokenBTC,
  ETH: tokenIcons.TokenETH,
  SOL: tokenIcons.TokenSOL,
  USDC: tokenIcons.TokenUSDC,
  ARB: tokenIcons.TokenARB,
  MNT: tokenIcons.TokenMNT,
} as const

export function MarketTickerBadge({ symbol, price, changePercent, assetType = 'crypto' }: MarketTickerBadgeProps) {
  const isPositive = changePercent >= 0
  const isStock = assetType === 'stock'
  const Icon = iconBySymbol[symbol as keyof typeof iconBySymbol]

  return (
    <button
      type="button"
      className="marketTickerBadgeButton"
      style={{
        height: 46,
        padding: '0 14px',
        borderRadius: 999,
        border: '1px solid var(--canvas-panel-divider)',
        background: 'transparent',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        flex: 'none',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: '999px',
          overflow: 'hidden',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        {isStock ? (
          <TickerLogo ticker={symbol} size={28} alt={`${symbol} logo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          Icon ? <Icon width={28} height={28} /> : <TickerLogo ticker={symbol} size={28} alt={`${symbol} logo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </span>
      <span style={{ color: 'var(--canvas-text-primary)', fontSize: 12, fontWeight: 700 }}>{symbol}</span>
      <span style={{ color: 'var(--canvas-text-secondary)', fontSize: 12, fontWeight: 600 }}>{price}</span>
      <span style={{ color: isPositive ? 'var(--canvas-accent)' : 'var(--canvas-negative)', fontSize: 12, fontWeight: 600 }}>{formatPercentChange(changePercent)}</span>
    </button>
  )
}

export type { MarketTickerBadgeProps }
