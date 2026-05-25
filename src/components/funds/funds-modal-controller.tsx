import { useMemo, useState, type CSSProperties } from 'react'

import DepositModalContent from './deposit-modal-content'
import FundsModalShell from './funds-modal-shell'
import TransferModalContent from './transfer-modal-content'
import WithdrawModalContent from './withdraw-modal-content'
import type { FundsModalMode, FundsSharedFormState, FundsTransferFormState } from './funds-types'

type FundsModalControllerProps = {
  mode: FundsModalMode | null
  onClose: () => void
}

const defaultSharedFormState: FundsSharedFormState = {
  assetSymbol: 'USDC',
  amount: '',
}

const defaultTransferFormState: FundsTransferFormState = {
  assetSymbol: 'USDC',
  amount: '',
  destination: '',
}

export default function FundsModalController({ mode, onClose }: FundsModalControllerProps) {
  const [depositForm, setDepositForm] = useState<FundsSharedFormState>(defaultSharedFormState)
  const [withdrawForm, setWithdrawForm] = useState<FundsSharedFormState>(defaultSharedFormState)
  const [transferForm, setTransferForm] = useState<FundsTransferFormState>(defaultTransferFormState)

  const modalCopy = useMemo(() => {
    if (mode === 'deposit') {
      return {
        title: 'Deposit Funds',
        description: 'Move assets from your wallet into the investing account so strategies can use them.',
        ctaLabel: 'Confirm Deposit',
      }
    }

    if (mode === 'withdraw') {
      return {
        title: 'Withdraw Funds',
        description: 'Move assets out of the investing account back to your connected wallet.',
        ctaLabel: 'Confirm Withdrawal',
      }
    }

    return {
      title: 'Transfer Funds',
      description: 'Move assets between internal accounts or to another destination address.',
      ctaLabel: 'Confirm Transfer',
    }
  }, [mode])

  return (
    <FundsModalShell
      open={mode !== null}
      title={modalCopy.title}
      description={modalCopy.description}
      onClose={onClose}
      footer={(
        <>
          <button type="button" onClick={onClose} style={secondaryButtonStyle}>Cancel</button>
          <button type="button" onClick={onClose} style={primaryButtonStyle}>{modalCopy.ctaLabel}</button>
        </>
      )}
    >
      {mode === 'deposit' ? <DepositModalContent form={depositForm} onChange={setDepositForm} /> : null}
      {mode === 'withdraw' ? <WithdrawModalContent form={withdrawForm} onChange={setWithdrawForm} /> : null}
      {mode === 'transfer' ? <TransferModalContent form={transferForm} onChange={setTransferForm} /> : null}
    </FundsModalShell>
  )
}

const secondaryButtonStyle: CSSProperties = {
  height: 40,
  padding: '0 16px',
  borderRadius: 999,
  border: '1px solid var(--canvas-panel-divider)',
  background: 'transparent',
  color: 'var(--canvas-text-primary)',
  fontFamily: 'var(--canvas-font-sans)',
  fontSize: 13,
  fontWeight: 600,
}

const primaryButtonStyle: CSSProperties = {
  height: 40,
  padding: '0 16px',
  borderRadius: 999,
  border: '1px solid var(--canvas-accent)',
  background: 'var(--canvas-accent)',
  color: 'var(--canvas-text-on-accent)',
  fontFamily: 'var(--canvas-font-sans)',
  fontSize: 13,
  fontWeight: 600,
}
