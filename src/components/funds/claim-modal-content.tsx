import { useRef, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import type { FundsSharedFormState } from './funds-types'
import CryptoLogo from '../icon/crypto-logo'
import FundsAssetDropdown from './funds-asset-dropdown'

type ClaimModalContentProps = {
  form: FundsSharedFormState
  onChange: (next: FundsSharedFormState) => void
}

const protocolOptions = [
  { symbol: 'MNT', label: 'MNT (Staking Rewards)', available: '15.50' },
  { symbol: 'COOK', label: 'COOK (LSP Rewards)', available: '420.00' },
  { symbol: 'USDC', label: 'USDC (Yield Accumulation)', available: '1,250.00' },
]

export default function ClaimModalContent({ form, onChange }: ClaimModalContentProps) {
  const selectedProtocol = protocolOptions.find((p) => p.symbol === form.assetSymbol) ?? protocolOptions[0]

  return (
    <>
      <FundsField label="Protocol Yield" description="Choose which yield or reward you want to claim to your investing account.">
        <FundsAssetDropdown
          value={form.assetSymbol}
          options={protocolOptions}
          onChange={(value) => onChange({ ...form, assetSymbol: value })}
        />
      </FundsField>

      <FundsField label="Amount to Claim" description="Leave empty to claim all available rewards.">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input 
            value={form.amount} 
            onChange={(event) => onChange({ ...form, amount: event.target.value })} 
            placeholder="All available" 
            inputMode="decimal" 
            style={{ ...inputStyle, paddingRight: 140 }} 
          />
          <button 
            type="button"
            onClick={() => onChange({ ...form, amount: selectedProtocol.available.replace(/,/g, '') })}
            style={{ 
              position: 'absolute', 
              right: 10, 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 6,
              background: 'var(--canvas-panel-bg)',
              padding: '4px 8px',
              borderRadius: 999,
              border: '1px solid var(--canvas-panel-divider)',
              cursor: 'pointer',
              transition: 'background 140ms ease, opacity 140ms ease'
            }}
            onPointerEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onPointerLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <CryptoLogo symbol={selectedProtocol.symbol} size={14} />
            <span style={{ color: 'var(--canvas-text-secondary)', fontSize: 11, fontWeight: 600 }}>
              Max: {selectedProtocol.available}
            </span>
          </button>
        </div>
      </FundsField>

      <FundsSummary fromLabel="Yield Source" fromValue="Smart Contract Vault" toLabel="Destination" toValue="Investing Account" />
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
