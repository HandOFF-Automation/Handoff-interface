import { useState } from 'react'

import { MarketTickerBadge, type MarketTickerBadgeProps } from './market-ticker-badge'

type MarketTickerCarouselProps = {
  items: MarketTickerBadgeProps[]
}

export function MarketTickerCarousel({ items }: MarketTickerCarouselProps) {
  const [paused, setPaused] = useState(false)
  const marqueeItems = [...items, ...items]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        boxSizing: 'border-box',
      }}
    >
      <div
        className="marketTickerCarouselTrack"
        style={{
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {marqueeItems.map((item, index) => (
          <MarketTickerBadge key={`${item.symbol}-${item.price}-${index}`} symbol={item.symbol} price={item.price} changePercent={item.changePercent} />
        ))}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 42,
          pointerEvents: 'none',
          background: 'linear-gradient(90deg, var(--canvas-bg) 0%, color-mix(in srgb, var(--canvas-bg) 72%, transparent) 22%, transparent 100%)',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 42,
          pointerEvents: 'none',
          background: 'linear-gradient(270deg, var(--canvas-bg) 0%, color-mix(in srgb, var(--canvas-bg) 72%, transparent) 22%, transparent 100%)',
        }}
      />
    </div>
  )
}
