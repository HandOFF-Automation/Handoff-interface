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

  if (!src || hasError) {
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
          background: 'var(--canvas-surface-soft-strong)',
          color: 'var(--canvas-text-primary)',
          fontSize: Math.max(10, Math.floor(size * 0.34)),
          fontWeight: 700,
          lineHeight: 1,
          flex: 'none',
          textTransform: 'uppercase',
          ...style,
        }}
      >
        {ticker.slice(0, 2)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt ?? `${ticker} logo`}
      width={size}
      height={size}
      className={className}
      onError={() => setHasError(true)}
      style={{
        display: 'block',
        width: size,
        height: size,
        objectFit: 'contain',
        flex: 'none',
        ...style,
      }}
    />
  )
}
