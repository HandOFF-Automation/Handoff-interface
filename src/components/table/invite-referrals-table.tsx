import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'

import { DataTable, type DataTableColumn, type DataTableFilterOption, sharedTableBodyCellStyle } from './data-table'

export type InviteReferralStatus = 'active' | 'pending'

export type InviteReferralRow = {
  id: string
  invitee: string
  referralCode: string
  pointsEarned: string
  status: InviteReferralStatus
  joinedAt: string
}

type InviteReferralsTableProps = {
  title: string
  description?: string
  rows: InviteReferralRow[]
  fillHeight?: boolean
  style?: CSSProperties
}

type InviteFilter = 'all' | 'active' | 'pending'

const FILTER_OPTIONS: DataTableFilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
]

const INVITE_COLUMNS: DataTableColumn[] = [
  { id: 'invitee', header: 'Invite' },
  { id: 'referralCode', header: 'Referral Code' },
  { id: 'pointsEarned', header: 'Points Earned' },
  { id: 'status', header: 'Status' },
  { id: 'joinedAt', header: 'Joined' },
]

export function InviteReferralsTable({ title, description, rows, fillHeight = false, style }: InviteReferralsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<InviteFilter>('all')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesFilter = activeFilter === 'all' ? true : row.status === activeFilter
      const matchesSearch =
        normalizedQuery.length === 0
          ? true
          : row.invitee.toLowerCase().includes(normalizedQuery) || row.referralCode.toLowerCase().includes(normalizedQuery)

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, normalizedQuery, rows])

  return (
    <DataTable
      title={title}
      description={description}
      rows={filteredRows}
      columns={INVITE_COLUMNS}
      fillHeight={fillHeight}
      style={style}
      searchPlaceholder="Search invite or code"
      searchValue={searchQuery}
      onSearchValueChange={setSearchQuery}
      filterOptions={FILTER_OPTIONS}
      activeFilterId={activeFilter}
      onFilterChange={(filterId) => setActiveFilter(filterId as InviteFilter)}
      emptyTitle="No invites yet"
      emptyDescription="You haven&apos;t invited anyone yet. Once you share your code and someone joins, their details will appear here."
      renderRow={(row) => (
        <tr key={row.id} className="interactiveTableRow" style={{ borderTop: '1px solid var(--canvas-panel-divider)' }}>
          <td style={sharedTableBodyCellStyle}>{row.invitee}</td>
          <td style={sharedTableBodyCellStyle}>{row.referralCode}</td>
          <td style={sharedTableBodyCellStyle}>{row.pointsEarned}</td>
          <td style={sharedTableBodyCellStyle}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 26,
                padding: '0 10px',
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                color: row.status === 'active' ? 'var(--canvas-text-primary)' : 'var(--canvas-text-tertiary)',
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {row.status}
            </span>
          </td>
          <td style={sharedTableBodyCellStyle}>{row.joinedAt}</td>
        </tr>
      )}
    />
  )
}
