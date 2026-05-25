import { ArrowsLeftRight, Check, Copy, DownloadSimple, Gift, UploadSimple } from '@phosphor-icons/react'
import { tokenIcons } from '@web3icons/react'
import { useMemo, useState } from 'react'

import { DashboardCard } from '../../../components/card/dashboard-card'
import FundsModalController from '../../../components/funds/funds-modal-controller'
import { DataTable, type DataTableColumn, type DataTableFilterOption, sharedTableBodyCellStyle } from '../../../components/table/data-table'
import type { FundsModalMode } from '../../../components/funds/funds-types'

type InvestingHistoryType = 'deposit' | 'withdrawal' | 'transfer' | 'claim'

type InvestingHistoryRow = {
  id: string
  type: InvestingHistoryType
  amount: string
  status: string
  from: string
  to: string
  createdAt: string
}

type AssetRow = {
  id: string
  asset: string
  symbol: string
  balance: string
  value: string
  change24h: string
}

const investingAccountDataset = {
  title: 'Investing Account',
  description: 'Manage your balance, move funds, and monitor your available investing capital.',
  balanceCard: {
    label: 'Investing Account Balance',
    value: 0,
    actions: [
      {
        id: 'deposit',
        label: 'Deposit',
        icon: 'deposit',
        variant: 'primary',
      },
      {
        id: 'withdraw',
        label: 'Withdraw',
        icon: 'withdraw',
      },
      {
        id: 'transfer',
        label: 'Transfer',
        icon: 'transfer',
      },
      {
        id: 'claim',
        label: 'Claim',
        icon: 'claim',
      },
    ],
  },
  assetsTable: {
    title: 'Your Assets',
    description: 'View your current asset holdings and their values.',
    rows: [
      { id: 'asset-1', asset: 'USDC', symbol: 'USDC', balance: '12,840.00', value: '$12,840.00', change24h: '+0.00%' },
      { id: 'asset-2', asset: 'MNT', symbol: 'MNT', balance: '0.00', value: '$0.00', change24h: '+0.00%' },
    ] as AssetRow[],
  },
  historyTable: {
    title: 'History',
    description: 'Track your latest deposit, withdrawal, and transfer activity.',
    rows: [
      { id: 'history-1', type: 'deposit', amount: '$2,400.00', status: 'Completed', from: '0x8F21...A91C', to: '0x19D4...7BE2', createdAt: '2026-05-20' },
      { id: 'history-2', type: 'withdrawal', amount: '$850.00', status: 'Pending', from: '0x19D4...7BE2', to: '0x8F21...A91C', createdAt: '2026-05-19' },
      { id: 'history-3', type: 'transfer', amount: '$1,200.00', status: 'Completed', from: '0x19D4...7BE2', to: '0xA55C...113F', createdAt: '2026-05-18' },
      { id: 'history-4', type: 'deposit', amount: '$940.00', status: 'Completed', from: '0x2DD8...A1F0', to: '0x19D4...7BE2', createdAt: '2026-05-17' },
      { id: 'history-5', type: 'transfer', amount: '$315.00', status: 'Completed', from: '0xA55C...113F', to: '0x19D4...7BE2', createdAt: '2026-05-16' },
      { id: 'history-6', type: 'withdrawal', amount: '$120.00', status: 'Rejected', from: '0x19D4...7BE2', to: '0xC8A1...02DE', createdAt: '2026-05-14' },
    ] as InvestingHistoryRow[],
  },
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function InvestingAccountContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | InvestingHistoryType>('all')
  const [copiedFieldId, setCopiedFieldId] = useState<string | null>(null)
  const [activeFundsModal, setActiveFundsModal] = useState<FundsModalMode | null>(null)

  const actionIconByType = {
    withdraw: <UploadSimple size={14} weight="bold" />,
    deposit: <DownloadSimple size={14} weight="bold" />,
    transfer: <ArrowsLeftRight size={14} weight="bold" />,
    claim: <Gift size={14} weight="bold" />,
  } as const

  const historyFilterOptions: DataTableFilterOption[] = [
    { id: 'all', label: 'All' },
    { id: 'deposit', label: 'Deposit' },
    { id: 'withdrawal', label: 'Withdrawal' },
    { id: 'transfer', label: 'Transfer' },
    { id: 'claim', label: 'Claim' },
  ]

  const assetsColumns: DataTableColumn[] = [
    { id: 'asset', header: 'Asset' },
    { id: 'balance', header: 'Balance' },
    { id: 'value', header: 'Value' },
    { id: 'change24h', header: '24h Change' },
  ]

  const historyColumns: DataTableColumn[] = [
    { id: 'type', header: 'Type' },
    { id: 'amount', header: 'Amount' },
    { id: 'status', header: 'Status' },
    { id: 'from', header: 'From' },
    { id: 'to', header: 'To' },
    { id: 'createdAt', header: 'Date' },
  ]

  const UsdcIcon = tokenIcons.TokenUSDC
  const MntIcon = tokenIcons.TokenMNT

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredHistoryRows = useMemo(() => {
    return investingAccountDataset.historyTable.rows.filter((row) => {
      const matchesFilter = activeFilter === 'all' ? true : row.type === activeFilter
      const matchesSearch =
        normalizedQuery.length === 0
          ? true
          : row.reference.toLowerCase().includes(normalizedQuery) || row.amount.toLowerCase().includes(normalizedQuery)

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, normalizedQuery])

  const handleCopyAddress = async (fieldId: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedFieldId(fieldId)
      window.setTimeout(() => {
        setCopiedFieldId((current) => (current === fieldId ? null : current))
      }, 1200)
    } catch {
      // Ignore clipboard failures for now; UI wiring is ready for future toast/error handling.
    }
  }

  const renderAddressCell = (fieldId: string, value: string) => {
    const copied = copiedFieldId === fieldId

    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <button
          type="button"
          onClick={() => handleCopyAddress(fieldId, value)}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: copied ? 'var(--canvas-accent)' : 'var(--canvas-text-tertiary)',
            transform: `scale(${copied ? 1.08 : 1})`,
            opacity: copied ? 1 : 0.9,
            transition: 'transform 140ms ease, color 140ms ease, opacity 140ms ease',
            flex: 'none',
          }}
        >
          {copied ? <Check size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
        </button>
      </span>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 20,
      }}
    >
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1.05 }}>{investingAccountDataset.title}</div>
        <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>{investingAccountDataset.description}</div>
      </div>

      <DashboardCard
        style={{
          padding: '22px',
          display: 'grid',
          gap: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 14, fontWeight: 600 }}>{investingAccountDataset.balanceCard.label}</div>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0 }}>
              <span style={{ color: 'var(--canvas-text-primary)', fontSize: 34, fontWeight: 700, lineHeight: 1 }}>${formatCurrency(investingAccountDataset.balanceCard.value)}</span>
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
            {investingAccountDataset.balanceCard.actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => setActiveFundsModal(action.id as FundsModalMode)}
                style={{
                  height: 34,
                  padding: '0 14px',
                  borderRadius: 999,
                  border: `1px solid ${action.variant === 'primary' ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
                  background: action.variant === 'primary' ? 'var(--canvas-accent)' : 'transparent',
                  color: action.variant === 'primary' ? '#ffffff' : 'var(--canvas-text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: 'var(--canvas-font-sans)',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{actionIconByType[action.icon as keyof typeof actionIconByType]}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </DashboardCard>

      <DataTable
        title={investingAccountDataset.assetsTable.title}
        description={investingAccountDataset.assetsTable.description}
        rows={investingAccountDataset.assetsTable.rows}
        columns={assetsColumns}
        emptyTitle="No assets yet"
        emptyDescription="Your assets will appear here once you deposit funds."
        renderRow={(row) => (
          <tr key={row.id} className="interactiveTableRow" style={{ borderTop: '1px solid var(--canvas-panel-divider)' }}>
            <td style={sharedTableBodyCellStyle}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {row.symbol === 'USDC' ? <UsdcIcon width={16} height={16} /> : row.symbol === 'MNT' ? <MntIcon width={16} height={16} /> : null}
                <span>{row.asset}</span>
              </span>
            </td>
            <td style={sharedTableBodyCellStyle}>{row.balance}</td>
            <td style={sharedTableBodyCellStyle}>{row.value}</td>
            <td style={sharedTableBodyCellStyle}>
              <span
                style={{
                  color: row.change24h.startsWith('+') ? 'var(--canvas-accent)' : row.change24h.startsWith('-') ? 'var(--canvas-negative)' : 'var(--canvas-text-primary)',
                }}
              >
                {row.change24h}
              </span>
            </td>
          </tr>
        )}
      />

      <DataTable
        title={investingAccountDataset.historyTable.title}
        description={investingAccountDataset.historyTable.description}
        rows={filteredHistoryRows}
        columns={historyColumns}
        searchPlaceholder="Search history"
        searchValue={searchQuery}
        onSearchValueChange={setSearchQuery}
        filterOptions={historyFilterOptions}
        activeFilterId={activeFilter}
        onFilterChange={(filterId) => setActiveFilter(filterId as 'all' | InvestingHistoryType)}
        emptyTitle="No history yet"
        emptyDescription="Your deposit, withdrawal, and transfer activity will appear here once you start moving funds."
        renderRow={(row) => (
          <tr key={row.id} className="interactiveTableRow" style={{ borderTop: '1px solid var(--canvas-panel-divider)' }}>
            <td style={sharedTableBodyCellStyle}>{row.type}</td>
            <td style={sharedTableBodyCellStyle}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <UsdcIcon width={16} height={16} />
                <span>{row.amount}</span>
              </span>
            </td>
            <td style={sharedTableBodyCellStyle}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 26,
                  padding: '0 10px',
                  borderRadius: 999,
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'transparent',
                  color: 'var(--canvas-text-primary)',
                  fontSize: 10,
                  fontWeight: 600,
                  lineHeight: 1,
                }}
            >
                {row.status}
              </span>
            </td>
            <td style={sharedTableBodyCellStyle}>{renderAddressCell(`${row.id}-from`, row.from)}</td>
            <td style={sharedTableBodyCellStyle}>{renderAddressCell(`${row.id}-to`, row.to)}</td>
            <td style={sharedTableBodyCellStyle}>{row.createdAt}</td>
          </tr>
        )}
      />

      <FundsModalController mode={activeFundsModal} onClose={() => setActiveFundsModal(null)} />
    </div>
  )
}
