import BrandedAssetLogo from '../icon/branded-asset-logo'

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

export const canvasYieldOptions: CanvasAssetOption[] = [
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'MNT', name: 'Mantle' },
  { symbol: 'USDY', name: 'Ondo US Dollar Yield' },
  { symbol: 'mETH', name: 'Mantle Ether' },
  { symbol: 'WETH', name: 'Wrapped Ether' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin' },
  { symbol: 'DAI', name: 'Dai Stablecoin' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'wstETH', name: 'Wrapped Staked ETH' },
  { symbol: 'MNT-LP', name: 'Mantle LP Tokens' },
  { symbol: 'Mantle-LSP', name: 'Mantle Liquid Staking' },
]

type CanvasAssetLogoProps = {
  assetType: 'stock' | 'token' | 'yield'
  symbol: string
  size?: number
}

export function CanvasAssetLogo({ assetType, symbol, size = 28 }: CanvasAssetLogoProps) {
  return <BrandedAssetLogo symbol={symbol} assetType="crypto" size={size} />
}

export function getCanvasAssetOptions(type: 'stock' | 'token' | 'yield') {
  if (type === 'stock') return canvasStockOptions
  if (type === 'yield') return canvasYieldOptions
  return canvasTokenOptions
}
