import { useEffect, useMemo, useState } from 'react'
import { getTickerLogoUrl } from '../../utils/logo-dev'

type TickerLogoProps = {
  ticker: string
  alt?: string
  size?: number
  style?: React.CSSProperties
  className?: string
}

export default function TickerLogo({ ticker, alt, size = 20, style, className }: TickerLogoProps) {
  const src = useMemo(() => getTickerLogoUrl(ticker, { size }), [ticker, size])
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  const innerSize = Math.max(10, Math.round(size * 0.8))

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '999px',
        background: 'var(--canvas-dashboard-card-bg)',
        border: '1px solid var(--canvas-panel-divider)',
        flex: 'none',
        overflow: 'hidden',
        ...style,
      }}
    >
      {!src || hasError ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: innerSize,
            height: innerSize,
            borderRadius: '999px',
            background: 'transparent',
            color: 'var(--canvas-text-primary)',
            fontSize: Math.max(10, Math.floor(innerSize * 0.34)),
            fontWeight: 700,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {ticker.slice(0, 2)}
        </span>
      ) : (
        <img
          src={src}
          alt={alt ?? `${ticker} logo`}
          width={size}
          height={size}
          onError={() => setHasError(true)}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </span>
  )
}
