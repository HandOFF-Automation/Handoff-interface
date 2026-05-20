const LOGO_DEV_BASE_URL = 'https://img.logo.dev'

type LogoDevOptions = {
  size?: number
  format?: 'png' | 'jpg' | 'webp'
}

export function getLogoDevToken() {
  const publishableKey = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY?.trim() ?? ''
  const legacyToken = import.meta.env.VITE_LOGO_DEV_TOKEN?.trim() ?? ''
  const token = publishableKey || legacyToken

  if (token.startsWith('sk_')) {
    return ''
  }

  return token
}

function buildLogoDevUrl(pathname: string, options: LogoDevOptions = {}) {
  const token = getLogoDevToken()
  const searchParams = new URLSearchParams()

  if (token) {
    searchParams.set('token', token)
  }

  if (options.size) {
    searchParams.set('size', String(options.size))
  }

  if (options.format) {
    searchParams.set('format', options.format)
  }

  const queryString = searchParams.toString()

  return `${LOGO_DEV_BASE_URL}/${pathname}${queryString ? `?${queryString}` : ''}`
}

export function getTickerLogoUrl(ticker: string, options: LogoDevOptions = {}) {
  const normalizedTicker = ticker.trim().toLowerCase()

  if (!normalizedTicker) {
    return ''
  }

  return buildLogoDevUrl(`ticker/${normalizedTicker}`, options)
}

export function getCryptoLogoUrl(symbol: string, options: LogoDevOptions = {}) {
  const normalizedSymbol = symbol.trim().toLowerCase()

  if (!normalizedSymbol) {
    return ''
  }

  return buildLogoDevUrl(`crypto/${normalizedSymbol}`, options)
}
