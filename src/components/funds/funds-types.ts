export type FundsModalMode = 'deposit' | 'withdraw' | 'transfer' | 'claim'

export type FundsSharedFormState = {
  assetSymbol: string
  amount: string
}

export type FundsTransferFormState = FundsSharedFormState & {
  destination: string
}
