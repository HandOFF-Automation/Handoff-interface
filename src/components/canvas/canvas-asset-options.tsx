import { tokenIcons } from '@web3icons/react'

import CryptoLogo from '../icon/crypto-logo'
import TickerLogo from '../icon/ticker-logo'

export type CanvasAssetOption = {
  symbol: string
  name: string
}

export const canvasStockOptions: CanvasAssetOption[] = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'TSLA', name: 'Tesla' },
]

export const canvasTokenOptions: CanvasAssetOption[] = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'USDC', name: 'USD Coin' },
]

const tokenIconBySymbol = {
  BTC: tokenIcons.TokenBTC,
  ETH: tokenIcons.TokenETH,
  SOL: tokenIcons.TokenSOL,
  USDC: tokenIcons.TokenUSDC,
} as const

type CanvasAssetLogoProps = {
  assetType: 'stock' | 'token'
  symbol: string
  size?: number
}

export function CanvasAssetLogo({ assetType, symbol, size = 28 }: CanvasAssetLogoProps) {
  if (assetType === 'stock') {
    return (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '999px',
          overflow: 'hidden',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        <TickerLogo ticker={symbol} size={size} alt={`${symbol} logo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </span>
    )
  }

  const Icon = tokenIconBySymbol[symbol as keyof typeof tokenIconBySymbol]

  if (Icon) {
    return <Icon width={size} height={size} />
  }

  return <CryptoLogo symbol={symbol} size={size} alt={`${symbol} logo`} style={{ width: size, height: size, objectFit: 'contain' }} />
}

export function getCanvasAssetOptions(type: 'stock' | 'token') {
  return type === 'stock' ? canvasStockOptions : canvasTokenOptions
}
