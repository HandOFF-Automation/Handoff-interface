import { useRef, useState } from 'react'
import { CaretDown, MagnifyingGlass } from '@phosphor-icons/react'
import DropdownMenu from '../dropdown/dropdown-menu'
import CryptoLogo from '../icon/crypto-logo'

export type FundsAssetOption = {
  symbol: string
  label: string
  available?: string
}

type FundsAssetDropdownProps = {
  value: string
  options: FundsAssetOption[]
  onChange: (value: string) => void
}

export default function FundsAssetDropdown({ value, options, onChange }: FundsAssetDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)

  const selectedOption = options.find((o) => o.symbol === value) ?? options[0]

  const filteredOptions = options.filter(
    (o) => o.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || o.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const dropdownGroups = [
    {
      className: 'dropdownMenuScrollableGroup',
      style: { maxHeight: 200, overflowY: 'auto' as const },
      items: filteredOptions.map((option) => ({
        label: option.label,
        value: option.symbol,
        active: option.symbol === value,
        icon: <CryptoLogo symbol={option.symbol} size={20} />,
      })),
    },
  ]

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', height: 36, background: 'var(--canvas-surface-soft)', borderRadius: 8, border: '1px solid var(--canvas-panel-divider)' }}>
      <MagnifyingGlass size={16} color="var(--canvas-text-tertiary)" />
      <input
        autoFocus
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search asset..."
        style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--canvas-text-primary)', width: '100%', fontSize: 13 }}
      />
    </div>
  )

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {selectedOption ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <CryptoLogo symbol={selectedOption.symbol} size={24} />
            <span>{selectedOption.label}</span>
          </span>
        ) : (
          <span style={{ color: 'var(--canvas-text-tertiary)' }}>Select Asset</span>
        )}
        <CaretDown size={16} weight="bold" color="var(--canvas-text-tertiary)" />
      </button>

      <DropdownMenu
        open={isOpen}
        position="bottom"
        header={header}
        groups={dropdownGroups}
        anchorRef={triggerRef}
        onClose={() => setIsOpen(false)}
        onItemClick={(item) => {
          if (item.value) {
            onChange(item.value)
            setSearchQuery('')
          }
          setIsOpen(false)
        }}
        style={{ width: '100%', marginTop: 4, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      />
    </div>
  )
}
