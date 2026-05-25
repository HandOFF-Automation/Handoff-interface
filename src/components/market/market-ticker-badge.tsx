import BrandedAssetLogo from '../icon/branded-asset-logo'

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

export function MarketTickerBadge({ symbol, price, changePercent, assetType = 'crypto' }: MarketTickerBadgeProps) {
  const isPositive = changePercent >= 0
  const isStock = assetType === 'stock'

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
      <BrandedAssetLogo symbol={symbol} assetType={assetType} size={28} />
      <span style={{ color: 'var(--canvas-text-primary)', fontSize: 12, fontWeight: 700 }}>{symbol}</span>
      <span style={{ color: 'var(--canvas-text-secondary)', fontSize: 12, fontWeight: 600 }}>{price}</span>
      <span style={{ color: isPositive ? 'var(--canvas-accent)' : 'var(--canvas-negative)', fontSize: 12, fontWeight: 600 }}>{formatPercentChange(changePercent)}</span>
    </button>
  )
}

export type { MarketTickerBadgeProps }
