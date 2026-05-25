import type { FundsSharedFormState } from './funds-types'
import FundsAssetDropdown from './funds-asset-dropdown'

const standardOptions = [
  { symbol: 'USDC', label: 'USDC (USD Coin)' },
  { symbol: 'USDY', label: 'USDY (Ondo Yield)' },
  { symbol: 'mETH', label: 'mETH (Mantle Staked ETH)' },
]

type DepositModalContentProps = {
  form: FundsSharedFormState
  onChange: (next: FundsSharedFormState) => void
}

export default function DepositModalContent({ form, onChange }: DepositModalContentProps) {
  return (
    <>
      <FundsField label="Asset" description="Choose which asset you want to deposit into your investing account.">
        <FundsAssetDropdown
          value={form.assetSymbol}
          options={standardOptions}
          onChange={(value) => onChange({ ...form, assetSymbol: value })}
        />
      </FundsField>

      <FundsField label="Amount" description="Enter how much you want to move into your investing account.">
        <input value={form.amount} onChange={(event) => onChange({ ...form, amount: event.target.value })} placeholder="0.00" inputMode="decimal" style={inputStyle} />
      </FundsField>

      <FundsSummary fromLabel="Source Wallet" fromValue="0x8F21...A91C" toLabel="Investing Account" toValue="Primary Investing Vault" />
    </>
  )
}

function FundsField({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return <div style={{ display: 'grid', gap: 10 }}><div style={{ display: 'grid', gap: 4 }}><div style={{ color: 'var(--canvas-text-primary)', fontSize: 13, fontWeight: 700 }}>{label}</div><div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11, fontWeight: 500, lineHeight: 1.5 }}>{description}</div></div>{children}</div>
}

function FundsSummary({ fromLabel, fromValue, toLabel, toValue }: { fromLabel: string; fromValue: string; toLabel: string; toValue: string }) {
  return <div style={{ display: 'grid', gap: 10, padding: 14, borderRadius: 20, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}><span style={summaryLabelStyle}>{fromLabel}</span><span style={summaryValueStyle}>{fromValue}</span></div><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}><span style={summaryLabelStyle}>{toLabel}</span><span style={summaryValueStyle}>{toValue}</span></div></div>
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 52,
  borderRadius: 16,
  border: '1px solid var(--canvas-panel-divider)',
  background: 'var(--canvas-surface-soft)',
  color: 'var(--canvas-text-primary)',
  fontFamily: 'var(--canvas-font-sans)',
  fontSize: 14,
  fontWeight: 600,
  padding: '0 14px',
  outline: 'none',
  boxSizing: 'border-box',
}

const summaryLabelStyle: React.CSSProperties = {
  color: 'var(--canvas-text-tertiary)',
  fontSize: 11,
  fontWeight: 500,
}

const summaryValueStyle: React.CSSProperties = {
  color: 'var(--canvas-text-primary)',
  fontSize: 12,
  fontWeight: 700,
}
