import type { FundsSharedFormState } from './funds-types'

type WithdrawModalContentProps = {
  form: FundsSharedFormState
  onChange: (next: FundsSharedFormState) => void
}

export default function WithdrawModalContent({ form, onChange }: WithdrawModalContentProps) {
  return (
    <>
      <FundsField label="Asset" description="Choose which asset you want to withdraw from your investing account.">
        <select value={form.assetSymbol} onChange={(event) => onChange({ ...form, assetSymbol: event.target.value })} style={inputStyle}>
          <option value="USDC">USDC</option>
          <option value="USDY">USDY</option>
          <option value="mETH">mETH</option>
        </select>
      </FundsField>

      <FundsField label="Amount" description="Enter how much you want to move out of your investing account.">
        <input value={form.amount} onChange={(event) => onChange({ ...form, amount: event.target.value })} placeholder="0.00" inputMode="decimal" style={inputStyle} />
      </FundsField>

      <FundsSummary fromLabel="Investing Account" fromValue="Primary Investing Vault" toLabel="Destination Wallet" toValue="0x8F21...A91C" />
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
