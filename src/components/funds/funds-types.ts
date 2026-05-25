export type FundsModalMode = 'deposit' | 'withdraw' | 'transfer'

export type FundsSharedFormState = {
  assetSymbol: string
  amount: string
}

export type FundsTransferFormState = FundsSharedFormState & {
  destination: string
}
