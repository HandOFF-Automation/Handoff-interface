import { useMemo } from 'react'
import { getCryptoLogoUrl } from '../../utils/logo-dev'

type CryptoLogoProps = {
  symbol: string
  alt?: string
  size?: number
  style?: React.CSSProperties
  className?: string
}

export default function CryptoLogo({ symbol, alt, size = 20, style, className }: CryptoLogoProps) {
  const src = useMemo(() => getCryptoLogoUrl(symbol, { size }), [symbol, size])
  const innerSize = Math.max(10, Math.round(size * 0.8))

  if (!src) {
    return null
  }

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
      <img
        src={src}
        alt={alt ?? `${symbol} logo`}
        width={size}
        height={size}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </span>
  )
}
