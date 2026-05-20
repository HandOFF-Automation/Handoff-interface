import { CaretDown, CaretUp } from '@phosphor-icons/react'
import { tokenIcons } from '@web3icons/react'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { DataTable, type DataTableColumn, type DataTableFilterOption, sharedTableBodyCellStyle } from '../../../components/table/data-table'

type LeaderboardTabId = 'strategies' | 'points' | 'referrals'
type SortField = 'balance' | 'oneDay' | 'sevenDay' | 'oneMonth' | 'oneYear'
type SortDirection = 'asc' | 'desc'

type LeaderboardEntry = {
  id: string
  rank: number
  name: string
  balance: string
  oneDay: string
  sevenDay: string
  oneMonth: string
  oneYear: string
}

type LeaderboardDataset = {
  tabs: Array<{
    id: LeaderboardTabId
    label: string
  }>
  sections: Record<
    LeaderboardTabId,
    {
      title: string
      description: string
      entries: LeaderboardEntry[]
    }
  >
}

const leaderboardDataset: LeaderboardDataset = {
  tabs: [
    { id: 'strategies', label: 'Top Strategies' },
    { id: 'points', label: 'Top Point' },
    { id: 'referrals', label: 'Top Referral' },
  ],
  sections: {
    strategies: {
      title: 'Top Strategies',
      description: 'The highest performing strategy accounts in the current cycle.',
      entries: [
        { id: 's-1', rank: 1, name: 'Aurora Delta', balance: '$148,240', oneDay: '+1.28%', sevenDay: '+5.82%', oneMonth: '+12.44%', oneYear: '+48.18%' },
        { id: 's-2', rank: 2, name: 'Luma Prime', balance: '$132,980', oneDay: '+1.11%', sevenDay: '+5.24%', oneMonth: '+10.92%', oneYear: '+44.06%' },
        { id: 's-3', rank: 3, name: 'North Grid', balance: '$121,540', oneDay: '+0.94%', sevenDay: '+4.73%', oneMonth: '+9.88%', oneYear: '+40.12%' },
        { id: 's-4', rank: 4, name: 'Helio Wave', balance: '$118,210', oneDay: '+0.88%', sevenDay: '+4.21%', oneMonth: '+8.64%', oneYear: '+36.55%' },
        { id: 's-5', rank: 5, name: 'Vertex One', balance: '$109,775', oneDay: '+0.76%', sevenDay: '+3.98%', oneMonth: '+7.92%', oneYear: '+33.47%' },
        { id: 's-6', rank: 6, name: 'Cinder Loop', balance: '$102,310', oneDay: '+0.64%', sevenDay: '+3.42%', oneMonth: '+7.18%', oneYear: '+29.84%' },
        { id: 's-7', rank: 7, name: 'Atlas Sync', balance: '$97,460', oneDay: '+0.58%', sevenDay: '+3.08%', oneMonth: '+6.44%', oneYear: '+27.22%' },
        { id: 's-8', rank: 8, name: 'Echo Bloom', balance: '$93,840', oneDay: '+0.49%', sevenDay: '+2.86%', oneMonth: '+5.92%', oneYear: '+24.76%' },
        { id: 's-9', rank: 9, name: 'Pillar Nine', balance: '$89,130', oneDay: '+0.43%', sevenDay: '+2.44%', oneMonth: '+5.30%', oneYear: '+22.14%' },
        { id: 's-10', rank: 10, name: 'Crane Flux', balance: '$84,720', oneDay: '+0.38%', sevenDay: '+2.18%', oneMonth: '+4.76%', oneYear: '+19.87%' },
        { id: 's-11', rank: 11, name: 'Nexa Ridge', balance: '$80,540', oneDay: '+0.31%', sevenDay: '+1.92%', oneMonth: '+4.12%', oneYear: '+17.66%' },
        { id: 's-12', rank: 12, name: 'Solar Mint', balance: '$78,905', oneDay: '+0.28%', sevenDay: '+1.75%', oneMonth: '+3.86%', oneYear: '+16.28%' },
      ],
    },
    points: {
      title: 'Top Point',
      description: 'Users earning the highest amount of reward points right now.',
      entries: [
        { id: 'p-1', rank: 1, name: 'Rina Hart', balance: '24,800 Point', oneDay: '+420', sevenDay: '+2,840', oneMonth: '+8,920', oneYear: '+24,800' },
        { id: 'p-2', rank: 2, name: 'Miko Lane', balance: '21,640 Point', oneDay: '+380', sevenDay: '+2,410', oneMonth: '+7,880', oneYear: '+21,640' },
        { id: 'p-3', rank: 3, name: 'Ares Kim', balance: '19,200 Point', oneDay: '+340', sevenDay: '+2,120', oneMonth: '+7,210', oneYear: '+19,200' },
        { id: 'p-4', rank: 4, name: 'Nova Bell', balance: '17,520 Point', oneDay: '+315', sevenDay: '+1,940', oneMonth: '+6,680', oneYear: '+17,520' },
        { id: 'p-5', rank: 5, name: 'Juno Vale', balance: '16,100 Point', oneDay: '+290', sevenDay: '+1,730', oneMonth: '+6,050', oneYear: '+16,100' },
        { id: 'p-6', rank: 6, name: 'Eli Stone', balance: '15,420 Point', oneDay: '+274', sevenDay: '+1,640', oneMonth: '+5,720', oneYear: '+15,420' },
        { id: 'p-7', rank: 7, name: 'Tara Moss', balance: '14,980 Point', oneDay: '+260', sevenDay: '+1,560', oneMonth: '+5,440', oneYear: '+14,980' },
        { id: 'p-8', rank: 8, name: 'Ivan Reed', balance: '13,870 Point', oneDay: '+240', sevenDay: '+1,420', oneMonth: '+5,020', oneYear: '+13,870' },
        { id: 'p-9', rank: 9, name: 'Mara Cole', balance: '12,940 Point', oneDay: '+222', sevenDay: '+1,260', oneMonth: '+4,680', oneYear: '+12,940' },
        { id: 'p-10', rank: 10, name: 'Noel Pierce', balance: '11,660 Point', oneDay: '+205', sevenDay: '+1,140', oneMonth: '+4,210', oneYear: '+11,660' },
        { id: 'p-11', rank: 11, name: 'Sia Grant', balance: '10,840 Point', oneDay: '+188', sevenDay: '+1,020', oneMonth: '+3,940', oneYear: '+10,840' },
        { id: 'p-12', rank: 12, name: 'Owen Clay', balance: '9,920 Point', oneDay: '+170', sevenDay: '+920', oneMonth: '+3,520', oneYear: '+9,920' },
      ],
    },
    referrals: {
      title: 'Top Referral',
      description: 'Users bringing the most active referrals into the platform.',
      entries: [
        { id: 'r-1', rank: 1, name: 'Kai Mercer', balance: '42 Referral', oneDay: '+3', sevenDay: '+8', oneMonth: '+17', oneYear: '+42' },
        { id: 'r-2', rank: 2, name: 'Nora Tate', balance: '36 Referral', oneDay: '+2', sevenDay: '+7', oneMonth: '+14', oneYear: '+36' },
        { id: 'r-3', rank: 3, name: 'Ezra Quinn', balance: '31 Referral', oneDay: '+2', sevenDay: '+6', oneMonth: '+12', oneYear: '+31' },
        { id: 'r-4', rank: 4, name: 'Lena Frost', balance: '27 Referral', oneDay: '+2', sevenDay: '+5', oneMonth: '+10', oneYear: '+27' },
        { id: 'r-5', rank: 5, name: 'Theo Ash', balance: '24 Referral', oneDay: '+1', sevenDay: '+4', oneMonth: '+9', oneYear: '+24' },
        { id: 'r-6', rank: 6, name: 'Pia North', balance: '22 Referral', oneDay: '+1', sevenDay: '+4', oneMonth: '+8', oneYear: '+22' },
        { id: 'r-7', rank: 7, name: 'Rex Wilde', balance: '20 Referral', oneDay: '+1', sevenDay: '+3', oneMonth: '+7', oneYear: '+20' },
        { id: 'r-8', rank: 8, name: 'Iris Dawn', balance: '18 Referral', oneDay: '+1', sevenDay: '+3', oneMonth: '+6', oneYear: '+18' },
        { id: 'r-9', rank: 9, name: 'Milan Shore', balance: '16 Referral', oneDay: '+1', sevenDay: '+2', oneMonth: '+5', oneYear: '+16' },
        { id: 'r-10', rank: 10, name: 'Vera Gold', balance: '15 Referral', oneDay: '+1', sevenDay: '+2', oneMonth: '+5', oneYear: '+15' },
        { id: 'r-11', rank: 11, name: 'Niko Vale', balance: '13 Referral', oneDay: '+0', sevenDay: '+2', oneMonth: '+4', oneYear: '+13' },
        { id: 'r-12', rank: 12, name: 'Luca Storm', balance: '12 Referral', oneDay: '+0', sevenDay: '+1', oneMonth: '+4', oneYear: '+12' },
      ],
    },
  },
}

export default function LeaderboardContent() {
  const [activeTabId, setActiveTabId] = useState<LeaderboardTabId>('strategies')
  const [sortField, setSortField] = useState<SortField>('oneDay')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const activeSection = leaderboardDataset.sections[activeTabId]
  const normalizedQuery = searchQuery.trim().toLowerCase()

  useEffect(() => {
    setSortField('oneDay')
    setSortDirection('desc')
  }, [activeTabId])

  const filteredEntries = useMemo(() => {
    return activeSection.entries.filter((entry) => {
      if (normalizedQuery.length === 0) {
        return true
      }

      return entry.name.toLowerCase().includes(normalizedQuery) || entry.balance.toLowerCase().includes(normalizedQuery)
    })
  }, [activeSection.entries, normalizedQuery])

  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((left, right) => {
      const leftValue = parseSortableMetric(left[sortField])
      const rightValue = parseSortableMetric(right[sortField])

      if (leftValue === rightValue) {
        return left.rank - right.rank
      }

      return sortDirection === 'asc' ? leftValue - rightValue : rightValue - leftValue
    })
  }, [filteredEntries, sortDirection, sortField])

  const UsdcIcon = tokenIcons.TokenUSDC
  const leaderboardFilterOptions: DataTableFilterOption[] = leaderboardDataset.tabs.map((tab) => ({ id: tab.id, label: tab.label }))
  const leaderboardColumns: DataTableColumn[] = [
    { id: 'rank', header: 'Rank' },
    { id: 'name', header: 'Name' },
    {
      id: 'balance',
      header: (
        <button type="button" onClick={() => handleSort('balance')} style={getHeaderSortButtonStyle()}>
          <span style={getHeaderSortLabelStyle()}>Value {renderSortIcon(sortField === 'balance', sortDirection)}</span>
        </button>
      ),
    },
    {
      id: 'oneDay',
      header: (
        <button type="button" onClick={() => handleSort('oneDay')} style={getHeaderSortButtonStyle()}>
          <span style={getHeaderSortLabelStyle()}>1D {renderSortIcon(sortField === 'oneDay', sortDirection)}</span>
        </button>
      ),
    },
    {
      id: 'sevenDay',
      header: (
        <button type="button" onClick={() => handleSort('sevenDay')} style={getHeaderSortButtonStyle()}>
          <span style={getHeaderSortLabelStyle()}>7D {renderSortIcon(sortField === 'sevenDay', sortDirection)}</span>
        </button>
      ),
    },
    {
      id: 'oneMonth',
      header: (
        <button type="button" onClick={() => handleSort('oneMonth')} style={getHeaderSortButtonStyle()}>
          <span style={getHeaderSortLabelStyle()}>1 Month {renderSortIcon(sortField === 'oneMonth', sortDirection)}</span>
        </button>
      ),
    },
    {
      id: 'oneYear',
      header: (
        <button type="button" onClick={() => handleSort('oneYear')} style={getHeaderSortButtonStyle()}>
          <span style={getHeaderSortLabelStyle()}>1 Year {renderSortIcon(sortField === 'oneYear', sortDirection)}</span>
        </button>
      ),
    },
  ]

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))
      return
    }

    setSortField(field)
    setSortDirection('desc')
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: '1fr',
      }}
    >
      <DataTable
        title={activeSection.title}
        description={activeSection.description}
        rows={sortedEntries}
        columns={leaderboardColumns}
        fillHeight
        style={{ height: '100%' }}
        searchPlaceholder="Search leaderboard"
        searchValue={searchQuery}
        onSearchValueChange={setSearchQuery}
        filterOptions={leaderboardFilterOptions}
        activeFilterId={activeTabId}
        onFilterChange={(filterId) => setActiveTabId(filterId as LeaderboardTabId)}
        emptyTitle="No leaderboard entries yet"
        emptyDescription="No users are ranked yet for this leaderboard. Once activity starts, rankings will appear here."
        renderRow={(entry) => (
          <tr key={entry.id} className="interactiveTableRow" style={{ borderTop: '1px solid var(--canvas-panel-divider)' }}>
            <td style={sharedTableBodyCellStyle}>#{entry.rank}</td>
            <td style={sharedTableBodyCellStyle}>{entry.name}</td>
            <td style={sharedTableBodyCellStyle}>
              {activeTabId === 'strategies' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <UsdcIcon width={16} height={16} />
                  <span>{entry.balance}</span>
                </span>
              ) : (
                entry.balance
              )}
            </td>
            <td style={sharedTableBodyCellStyle}>{entry.oneDay}</td>
            <td style={sharedTableBodyCellStyle}>{entry.sevenDay}</td>
            <td style={sharedTableBodyCellStyle}>{entry.oneMonth}</td>
            <td style={sharedTableBodyCellStyle}>{entry.oneYear}</td>
          </tr>
        )}
      />
    </div>
  )
}

function getHeaderSortLabelStyle(): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    color: 'var(--canvas-text-secondary)',
  }
}

function getHeaderSortButtonStyle(): React.CSSProperties {
  return {
    border: 'none',
    padding: 0,
    margin: 0,
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    cursor: 'pointer',
    borderRadius: 0,
    opacity: 1,
  }
}

function parseSortableMetric(value: string) {
  const normalized = value.replace(/[^0-9+.-]/g, '')
  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : 0
}

function renderSortIcon(active: boolean, direction: SortDirection): ReactNode {
  const upColor = active && direction === 'desc' ? 'var(--canvas-accent)' : 'var(--canvas-text-tertiary)'
  const downColor = active && direction === 'asc' ? 'var(--canvas-accent)' : 'var(--canvas-text-tertiary)'

  return (
    <span style={{ display: 'inline-grid', gridTemplateRows: 'repeat(2, 5px)', alignItems: 'center', lineHeight: 1 }}>
      <CaretUp size={10} weight={active && direction === 'desc' ? 'fill' : 'bold'} color={upColor} />
      <CaretDown size={10} weight={active && direction === 'asc' ? 'fill' : 'bold'} color={downColor} />
    </span>
  )
}
