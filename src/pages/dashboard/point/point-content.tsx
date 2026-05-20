import { CheckCircle, Coins, MagnifyingGlass, Question, TrendUp, Wallet } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'

import { DashboardCard } from '../../../components/card/dashboard-card'
import { DataTable, type DataTableColumn, type DataTableFilterOption, sharedTableBodyCellStyle } from '../../../components/table/data-table'

type PointSummaryCard = {
  id: string
  title: string
  value: string
  icon: 'deposit' | 'referral' | 'daily' | 'checked'
  checkedCount?: number
  checkedTotal?: number
}

type PointHistoryType = 'deposit' | 'referral' | 'daily'

type PointHistoryRow = {
  id: string
  type: PointHistoryType
  source: string
  points: string
  status: string
  createdAt: string
}

type PointTask = {
  id: string
  title: string
  points: string
  icon: 'deposit' | 'referral' | 'daily'
}

const pointDataset = {
  title: 'Refer and Earn',
  pointsLabel: 'Your Points',
  pointsValue: '0 Point',
  summaries: [
    { id: 'deposit-points', title: 'Total Deposit Points', value: '0 Point', icon: 'deposit' },
    { id: 'referral-points', title: 'Total Referral Points', value: '0 Point', icon: 'referral' },
    { id: 'daily-points', title: 'Daily Points', value: '0/day', icon: 'daily' },
    { id: 'checked-in', title: 'Checked In', value: '0 Day', icon: 'checked', checkedCount: 2, checkedTotal: 7 },
  ] as PointSummaryCard[],
  historyTable: {
    title: 'Points History',
    description: 'Review where your points came from and how they were earned over time.',
    rows: [
      { id: 'point-1', type: 'deposit', source: 'Deposit Reward', points: '+120 Point', status: 'Completed', createdAt: '2026-05-20' },
      { id: 'point-2', type: 'referral', source: 'Referral Bonus', points: '+80 Point', status: 'Completed', createdAt: '2026-05-18' },
      { id: 'point-3', type: 'daily', source: 'Daily Streak', points: '+15 Point', status: 'Completed', createdAt: '2026-05-17' },
      { id: 'point-4', type: 'deposit', source: 'Deposit Reward', points: '+60 Point', status: 'Completed', createdAt: '2026-05-15' },
      { id: 'point-5', type: 'referral', source: 'Referral Bonus', points: '+40 Point', status: 'Pending', createdAt: '2026-05-14' },
    ] as PointHistoryRow[],
  },
  tasks: {
    title: 'Tasks',
    description: 'Review where your points came from and how they were earned over time.',
    items: [
      { id: 'task-1', title: 'Make your first deposit', points: '120 Point', icon: 'deposit' },
      { id: 'task-2', title: 'Invite one friend', points: '80 Point', icon: 'referral' },
      { id: 'task-3', title: 'Keep a 7 day streak', points: '45 Point', icon: 'daily' },
      { id: 'task-4', title: 'Transfer to a strategy vault', points: '30 Point', icon: 'deposit' },
      { id: 'task-5', title: 'Complete your profile setup', points: '20 Point', icon: 'daily' },
      { id: 'task-6', title: 'Connect your email', points: '25 Point', icon: 'referral' },
      { id: 'task-7', title: 'Make a second deposit', points: '60 Point', icon: 'deposit' },
      { id: 'task-8', title: 'Invite three friends', points: '140 Point', icon: 'referral' },
      { id: 'task-9', title: 'Maintain a 30 day streak', points: '200 Point', icon: 'daily' },
    ] as PointTask[],
  },
}

const summaryIconByType = {
  deposit: <Wallet size={18} weight="fill" color="var(--canvas-text-primary)" />,
  referral: <Coins size={18} weight="fill" color="var(--canvas-text-primary)" />,
  daily: <TrendUp size={18} weight="fill" color="var(--canvas-text-primary)" />,
  checked: <CheckCircle size={18} weight="fill" color="var(--canvas-text-primary)" />,
} as const

const historyFilterOptions: DataTableFilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'deposit', label: 'Deposit' },
  { id: 'referral', label: 'Referral' },
  { id: 'daily', label: 'Daily' },
]

  const historyColumns: DataTableColumn[] = [
  { id: 'type', header: 'Type' },
  { id: 'source', header: 'Source' },
  { id: 'points', header: 'Points' },
  { id: 'status', header: 'Status' },
  { id: 'createdAt', header: 'Date' },
]

export default function PointContent() {
  const [activeFilter, setActiveFilter] = useState<'all' | PointHistoryType>('all')
  const [historySearchQuery, setHistorySearchQuery] = useState('')
  const [taskSearchQuery, setTaskSearchQuery] = useState('')

  const normalizedHistoryQuery = historySearchQuery.trim().toLowerCase()
  const normalizedTaskQuery = taskSearchQuery.trim().toLowerCase()
  const isPointValue = (value: string) => value.toLowerCase().includes('point')

  const filteredHistoryRows = useMemo(() => {
    return pointDataset.historyTable.rows.filter((row) => {
      const matchesFilter = activeFilter === 'all' ? true : row.type === activeFilter
      const matchesSearch = normalizedHistoryQuery.length === 0 ? true : row.source.toLowerCase().includes(normalizedHistoryQuery) || row.points.toLowerCase().includes(normalizedHistoryQuery)

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, normalizedHistoryQuery])

  const filteredTasks = useMemo(() => {
    return pointDataset.tasks.items.filter((task) => (normalizedTaskQuery.length === 0 ? true : task.title.toLowerCase().includes(normalizedTaskQuery) || task.points.toLowerCase().includes(normalizedTaskQuery)))
  }, [normalizedTaskQuery])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto auto minmax(0, 1fr)',
        gap: 24,
        minHeight: '100%',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 18,
        }}
      >
        <div style={{ color: 'var(--canvas-text-primary)', fontSize: 28, fontWeight: 700, lineHeight: 1.08 }}>{pointDataset.title}</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 13, fontWeight: 600 }}>{pointDataset.pointsLabel}</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--canvas-text-tertiary)' }}>
              <Question size={14} weight="fill" />
            </span>
          </div>
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{pointDataset.pointsValue}</div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 18,
        }}
      >
        {pointDataset.summaries.map((summary) => (
          <DashboardCard
            key={summary.id}
            style={{
              padding: '20px 20px 18px',
              display: 'grid',
              alignContent: 'start',
              gap: 16,
              minHeight: 154,
            }}
          >
            {summary.icon === 'checked' ? (
              <>
                <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>{summary.title}</div>
                <div
                  style={{
                    position: 'relative',
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 10,
                      right: 10,
                      top: '50%',
                      height: 1,
                      transform: 'translateY(-50%)',
                      background: 'var(--canvas-panel-divider)',
                    }}
                  />
                  {Array.from({ length: summary.checkedTotal ?? 0 }, (_, index) => {
                    const active = index < (summary.checkedCount ?? 0)

                    return (
                      <span
                        key={`${summary.id}-check-${index}`}
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          width: 20,
                          height: 20,
                          borderRadius: '999px',
                          border: `1px solid ${active ? 'var(--canvas-panel-divider)' : 'var(--canvas-panel-divider)'}`,
                          background: active ? 'rgba(255, 255, 255, 0.04)' : 'var(--canvas-dashboard-card-bg)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: active ? 'var(--canvas-text-primary)' : 'var(--canvas-text-tertiary)',
                          flex: 'none',
                        }}
                      >
                        {active ? <CheckCircle size={12} weight="fill" color="var(--canvas-text-primary)" /> : null}
                      </span>
                    )
                  })}
                </div>
                <div style={{ color: 'var(--canvas-text-primary)', fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>{summary.value}</div>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    border: '1px solid var(--canvas-panel-divider)',
                    background: 'transparent',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {summaryIconByType[summary.icon]}
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>{summary.title}</div>
                  <div style={{ color: 'var(--canvas-text-primary)', fontSize: isPointValue(summary.value) ? 18 : 20, fontWeight: 700, lineHeight: 1.1 }}>{summary.value}</div>
                </div>
              </>
            )}
          </DashboardCard>
        ))}
      </div>

      <div
        style={{
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 0.9fr)',
          gap: 18,
          alignItems: 'stretch',
        }}
      >
        <DataTable
          title={pointDataset.historyTable.title}
          description={pointDataset.historyTable.description}
          rows={filteredHistoryRows}
          columns={historyColumns}
          fillHeight
          style={{ height: '100%' }}
          searchPlaceholder="Search point history"
          searchValue={historySearchQuery}
          onSearchValueChange={setHistorySearchQuery}
          filterOptions={historyFilterOptions}
          activeFilterId={activeFilter}
          onFilterChange={(filterId) => setActiveFilter(filterId as 'all' | PointHistoryType)}
          emptyTitle="No point history yet"
          emptyDescription="Your point activity will appear here once you start earning rewards."
          renderRow={(row) => (
            <tr key={row.id} className="interactiveTableRow" style={{ borderTop: '1px solid var(--canvas-panel-divider)' }}>
              <td style={sharedTableBodyCellStyle}>{row.type}</td>
              <td style={sharedTableBodyCellStyle}>{row.source}</td>
              <td style={sharedTableBodyCellStyle}>{row.points}</td>
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
              <td style={sharedTableBodyCellStyle}>{row.createdAt}</td>
            </tr>
          )}
        />

        <div
          style={{
            minHeight: 0,
            height: '100%',
            display: 'grid',
            gridTemplateRows: 'auto minmax(0, 1fr)',
            gap: 16,
          }}
        >
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ color: 'var(--canvas-text-primary)', fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{pointDataset.tasks.title}</div>
            <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>{pointDataset.tasks.description}</div>
          </div>

          <DashboardCard
            style={{
              minHeight: 320,
              maxHeight: '56vh',
              height: '100%',
              padding: '22px',
              display: 'grid',
              gridTemplateRows: 'auto minmax(0, 1fr)',
              gap: 16,
            }}
          >
            <div
              style={{
                height: 44,
                padding: '0 14px',
                borderRadius: 14,
                border: '1px solid var(--canvas-panel-divider)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                boxSizing: 'border-box',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--canvas-text-tertiary)' }}>
                <MagnifyingGlass size={16} weight="bold" />
              </span>
              <input
                value={taskSearchQuery}
                onChange={(event) => setTaskSearchQuery(event.target.value)}
                placeholder="Search tasks"
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--canvas-text-primary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
            </div>

            <div style={{ minHeight: 0, display: 'grid', alignContent: 'start', gap: 12, overflowY: 'auto', overflowX: 'hidden', paddingTop: 2, paddingBottom: 2, boxSizing: 'border-box' }}>
              {filteredTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  className="pointTaskCardButton"
                  style={{
                    border: 'none',
                    padding: 0,
                    background: 'transparent',
                    textAlign: 'left',
                    display: 'block',
                    width: '100%',
                  }}
                >
                  <DashboardCard
                    style={{
                      padding: '16px',
                      display: 'grid',
                      gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'background-color 180ms ease, border-color 180ms ease, transform 180ms ease',
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 12,
                        border: '1px solid var(--canvas-panel-divider)',
                        background: 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 'none',
                      }}
                    >
                      {summaryIconByType[task.icon]}
                    </div>
                    <div style={{ color: 'var(--canvas-text-primary)', fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{task.title}</div>
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
                        flex: 'none',
                      }}
                    >
                      {task.points}
                    </span>
                  </DashboardCard>
                </button>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
