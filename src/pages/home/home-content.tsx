export type HomeStatItem = {
  label: string
  baseValue: number
  speed: number
  decimals?: number
}

export const homeStats: HomeStatItem[] = [
  { label: 'Active Wallets', baseValue: 1100, speed: 5.4 },
  { label: 'Trading Volume', baseValue: 28400, speed: 18.5 },
  { label: 'Total Value Locked', baseValue: 125600, speed: 42.75 },
]

export const homeContent = {
  connectWalletLabel: 'Connect Wallet',
  scrollCtaLabel: 'Scroll to explore',
}
