const LOGO_DEV_BASE_URL = 'https://img.logo.dev'

type LogoDevOptions = {
  size?: number
  format?: 'png' | 'jpg' | 'webp'
  theme?: 'auto' | 'dark' | 'light'
  greyscale?: boolean
  fallback?: 'monogram' | '404'
  retina?: boolean
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
  function getGlobalTheme(): 'dark' | 'light' | undefined {
    if (typeof document !== 'undefined') {
      const ds = (document.documentElement.dataset?.theme || '').toLowerCase()
      if (ds === 'dark' || ds === 'light') return ds as 'dark' | 'light'
    }
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return undefined
  }

  const token = getLogoDevToken()
  const searchParams = new URLSearchParams()

  if (token) {
    searchParams.set('token', token)
  }

  if (options.size) {
    searchParams.set('size', String(options.size))
  }

  const format = options.format || 'png'
  searchParams.set('format', format)

  const effectiveTheme = options.theme ?? getGlobalTheme()
  if (effectiveTheme && effectiveTheme !== 'auto') {
    searchParams.set('theme', effectiveTheme)
  }

  if (typeof options.greyscale === 'boolean') {
    searchParams.set('greyscale', String(options.greyscale))
  }

  if (options.fallback) {
    searchParams.set('fallback', options.fallback)
  }

  if (typeof options.retina === 'boolean') {
    searchParams.set('retina', String(options.retina))
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
