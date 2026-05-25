import React from 'react'

import CryptoLogo from './crypto-logo'
import TickerLogo from './ticker-logo'
import handoffIcon from '../../assets/icon/icon handoff.png'

export type BrandedAssetLogoProps = {
  symbol: string
  assetType?: 'stock' | 'crypto' | 'yield'
  size?: number
  showBadge?: boolean
  badgeSrc?: string
  badgeBackground?: string
  badgePosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
  style?: React.CSSProperties
}

export default function BrandedAssetLogo({
  symbol,
  assetType = 'crypto',
  size = 40,
  showBadge = true,
  badgeSrc,
  badgeBackground = 'var(--canvas-dashboard-card-bg)',
  badgePosition = 'bottom-right',
  className,
  style,
}: BrandedAssetLogoProps) {
  const innerSize = size
  const badgeSize = Math.max(14, Math.round(size * 0.5))
  const badgeOffset = Math.max(0, Math.round(size * 0.02))

  const isStock = assetType === 'stock'
  const isCryptoLike = assetType === 'crypto' || assetType === 'yield'

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    width: badgeSize,
    height: badgeSize,
    borderRadius: Math.round(badgeSize * 0.3),
    background: badgeBackground,
    display: showBadge ? 'inline-flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--canvas-panel-divider)',
    overflow: 'hidden',
  }

  if (badgePosition === 'bottom-right') {
    badgeStyle.right = -badgeOffset
    badgeStyle.bottom = -badgeOffset
  } else if (badgePosition === 'bottom-left') {
    badgeStyle.left = -badgeOffset
    badgeStyle.bottom = -badgeOffset
  } else if (badgePosition === 'top-right') {
    badgeStyle.right = -badgeOffset
    badgeStyle.top = -badgeOffset
  } else if (badgePosition === 'top-left') {
    badgeStyle.left = -badgeOffset
    badgeStyle.top = -badgeOffset
  }

  return (
    <span
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: 999,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--canvas-dashboard-card-bg)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Center logo (uses global theme-aware logo util) */}
      {isStock ? (
        <TickerLogo ticker={symbol} size={innerSize} alt={`${symbol} logo`} style={{ border: '2px solid var(--canvas-panel-divider)' }} />
      ) : isCryptoLike ? (
        <CryptoLogo symbol={symbol} size={innerSize} alt={`${symbol} logo`} style={{ border: '2px solid var(--canvas-panel-divider)' }} />
      ) : null}

      {/* Overlay badge */}
      {showBadge ? (
        <span style={badgeStyle}>
          <img
            src={badgeSrc ?? handoffIcon}
            alt="badge"
            width={badgeSize}
            height={badgeSize}
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </span>
      ) : null}
    </span>
  )
}
