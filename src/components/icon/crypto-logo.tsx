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

  if (!src) {
    return null
  }

  return (
    <img
      src={src}
      alt={alt ?? `${symbol} logo`}
      width={size}
      height={size}
      className={className}
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
