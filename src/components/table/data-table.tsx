import { CaretDown, CaretLeft, CaretRight, MagnifyingGlass, UserPlus } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { DashboardCard } from '../card/dashboard-card'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

type PageSize = 10 | 30 | 50

const PAGE_SIZE_OPTIONS: PageSize[] = [10, 30, 50]

export type DataTableFilterOption = {
  id: string
  label: string
}

export type DataTableColumn = {
  id: string
  header: ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

type DataTableProps<Row> = {
  title: string
  description?: string
  rows: Row[]
  columns: DataTableColumn[]
  fillHeight?: boolean
  style?: CSSProperties
  searchPlaceholder?: string
  searchValue?: string
  onSearchValueChange?: (value: string) => void
  filterOptions?: DataTableFilterOption[]
  activeFilterId?: string
  onFilterChange?: (filterId: string) => void
  emptyTitle?: string
  emptyDescription?: string
  renderRow: (row: Row, rowIndex: number) => ReactNode
}

export function DataTable<Row>({
  title,
  description,
  rows,
  columns,
  fillHeight = false,
  style,
  searchPlaceholder = 'Search',
  searchValue,
  onSearchValueChange,
  filterOptions = [],
  activeFilterId,
  onFilterChange,
  emptyTitle = 'No data yet',
  emptyDescription = 'There is no data to display right now.',
  renderRow,
}: DataTableProps<Row>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)
  const [isPageSizeMenuOpen, setIsPageSizeMenuOpen] = useState(false)

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [rows, pageSize])

  useEffect(() => {
    setCurrentPage((current) => Math.min(current, totalPages))
  }, [totalPages])

  useEffect(() => {
    if (!isPageSizeMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.closest('[data-data-table-page-size-menu-root="true"]')) {
        return
      }

      setIsPageSizeMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isPageSizeMenuOpen])

  const paginatedRows = useMemo(() => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize), [currentPage, pageSize, rows])
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  const pageSizeMenuGroups = [
    {
      items: PAGE_SIZE_OPTIONS.map((sizeOption) => ({
        label: `${sizeOption} rows`,
        value: String(sizeOption),
        active: sizeOption === pageSize,
      })),
    },
  ]

  const handlePageSizeMenuClick = (item: DropdownMenuItem) => {
    const nextPageSize = Number(item.value) as PageSize

    if (PAGE_SIZE_OPTIONS.includes(nextPageSize)) {
      setPageSize(nextPageSize)
    }

    setIsPageSizeMenuOpen(false)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: fillHeight ? 'auto minmax(0, 1fr)' : 'auto auto',
        gap: 16,
        minHeight: 0,
        height: fillHeight ? '100%' : 'auto',
        ...style,
      }}
    >
      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ color: 'var(--canvas-text-primary)', fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
        {description ? <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>{description}</div> : null}
      </div>

      <DashboardCard
        style={{
          padding: '22px 22px 18px',
          display: 'grid',
          gridTemplateRows: 'auto minmax(0, 1fr) auto',
          gap: 18,
          minHeight: 0,
          height: fillHeight ? '100%' : 'auto',
          alignSelf: fillHeight ? 'stretch' : 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div
            style={{
              minWidth: 220,
              flex: '1 1 280px',
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
              value={searchValue ?? ''}
              onChange={(event) => onSearchValueChange?.(event.target.value)}
              placeholder={searchPlaceholder}
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

          {filterOptions.length > 0 ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: 4,
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'var(--canvas-surface-soft)',
              }}
            >
              {filterOptions.map((option) => {
                const active = option.id === activeFilterId

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onFilterChange?.(option.id)}
                    style={{
                      height: 28,
                      padding: '0 12px',
                      border: 'none',
                      borderRadius: 999,
                      background: active ? 'var(--canvas-accent)' : 'transparent',
                      color: active ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-tertiary)',
                      cursor: 'pointer',
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'var(--canvas-font-sans)',
                    }}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <div style={{ overflow: 'hidden', borderRadius: 18, border: '1px solid var(--canvas-panel-divider)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: 'var(--canvas-surface-soft)' }}>
                {columns.map((column) => (
                  <th key={column.id} style={{ ...sharedTableHeaderCellStyle, width: column.width, textAlign: column.align ?? 'left' }}>
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
          <div
            className="dataTableBodyScrollArea"
            style={{
              minHeight: 0,
              maxHeight: fillHeight ? 'none' : 420,
              height: fillHeight ? '100%' : 'auto',
              overflowY: 'auto',
              overflowX: 'hidden',
              background: 'var(--canvas-surface-soft-subtle)',
              boxShadow: 'var(--canvas-shadow-inset-soft)',
            }}
          >
            {paginatedRows.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <tbody>{paginatedRows.map((row, rowIndex) => renderRow(row, rowIndex))}</tbody>
              </table>
            ) : (
              <div
                style={{
                  minHeight: 260,
                  padding: 20,
                  boxSizing: 'border-box',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    minHeight: 220,
                    display: 'grid',
                    alignContent: 'center',
                    justifyItems: 'center',
                    gap: 14,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--canvas-text-primary)',
                    }}
                  >
                    <UserPlus size={18} weight="fill" />
                  </div>
                  <div style={{ color: 'var(--canvas-text-primary)', fontSize: 16, fontWeight: 700, lineHeight: 1.25 }}>{emptyTitle}</div>
                  <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>{emptyDescription}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 14 }}>
          <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11, fontWeight: 500 }}>
            {rows.length > 0 ? `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, rows.length)} of ${rows.length}` : 'Showing 0 of 0'}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              style={{ ...paginationButtonStyle, opacity: currentPage === 1 ? 0.45 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}
            >
              <CaretLeft size={14} weight="bold" />
            </button>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {pageNumbers.map((pageNumber) => {
                const active = pageNumber === currentPage

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{
                      minWidth: 32,
                      height: 32,
                      padding: '0 10px',
                      borderRadius: 999,
                      border: '1px solid var(--canvas-panel-divider)',
                      background: active ? 'var(--canvas-accent)' : 'transparent',
                      color: active ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-primary)',
                      cursor: 'pointer',
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'var(--canvas-font-sans)',
                    }}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
              style={{ ...paginationButtonStyle, opacity: currentPage === totalPages ? 0.45 : 1, cursor: currentPage === totalPages ? 'default' : 'pointer' }}
            >
              <CaretRight size={14} weight="bold" />
            </button>
          </div>
          <div data-data-table-page-size-menu-root="true" style={{ justifySelf: 'end', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsPageSizeMenuOpen((current) => !current)}
              style={{
                height: 34,
                padding: '0 12px',
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'transparent',
                color: 'var(--canvas-text-primary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: 'var(--canvas-font-sans)',
              }}
            >
              {pageSize} rows
              <CaretDown size={12} weight="bold" style={{ transform: `rotate(${isPageSizeMenuOpen ? '180deg' : '0deg'})`, transition: 'transform 140ms ease' }} />
            </button>

            {isPageSizeMenuOpen ? (
              <DropdownMenu
                open={isPageSizeMenuOpen}
                position="top"
                groups={pageSizeMenuGroups}
                onItemClick={handlePageSizeMenuClick}
                style={{ left: 'auto', right: 0, top: 'auto', bottom: 'calc(100% + 10px)', transform: 'translateY(0)', minWidth: 140 }}
              />
            ) : null}
          </div>
        </div>
      </DashboardCard>
    </div>
  )
}

export const sharedTableHeaderCellStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '14px 16px',
  color: 'var(--canvas-text-secondary)',
  fontSize: 11,
  fontWeight: 600,
}

export const sharedTableBodyCellStyle: React.CSSProperties = {
  padding: '15px 16px',
  color: 'var(--canvas-text-primary)',
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const paginationButtonStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 999,
  border: '1px solid var(--canvas-panel-divider)',
  background: 'transparent',
  color: 'var(--canvas-text-primary)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}
