import { CaretDown, MagnifyingGlass, Rows, SquaresFour } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'

import { DashboardCard } from '../../../components/card/dashboard-card'
import DropdownMenu, { type DropdownMenuItem } from '../../../components/dropdown/dropdown-menu'
import { StrategyPreviewCard, type StrategyCollaborator } from '../../../components/card/strategy-preview-card'

type CommunityFilterId = 'all' | 'featured' | 'trade' | 'yield'
type CommunityViewType = 'card' | 'list'
type CommunityPageSize = 3 | 6 | 9

const COMMUNITY_PAGE_SIZE_OPTIONS: CommunityPageSize[] = [3, 6, 9]

type CommunityProject = {
  id: string
  title: string
  href: string
  lastEditedLabel: string
  createdBy: string
  collaborators?: StrategyCollaborator[]
  previewEmpty?: boolean
  previewVariant?: 'default' | 'shifted' | 'wide'
  category: Exclude<CommunityFilterId, 'all'>
}

const communityDataset = {
  title: 'Community',
  description: 'Explore project templates from the community and use them as starting points for your own strategy workspace.',
  filters: [
    { id: 'all', label: 'All' },
    { id: 'featured', label: 'Featured' },
    { id: 'trade', label: 'Trade' },
    { id: 'yield', label: 'Yield' },
  ] as Array<{ id: CommunityFilterId; label: string }>,
  projects: [
    {
      id: 'community-1',
      title: 'Starter Momentum',
      href: '/canvas/community-starter-momentum',
      lastEditedLabel: 'Updated 1h ago',
      createdBy: 'Raka',
      previewEmpty: true,
      category: 'featured',
    },
    {
      id: 'community-2',
      title: 'Yield Farming Loop',
      href: '/canvas/community-yield-loop',
      lastEditedLabel: 'Updated May 18, 2026',
      createdBy: 'Anya',
      previewEmpty: true,
      previewVariant: 'shifted',
      category: 'yield',
      collaborators: [
        { id: 'member-1', name: 'Anya' },
        { id: 'member-2', name: 'Raka' },
        { id: 'member-3', name: 'Dito' },
      ],
    },
    {
      id: 'community-3',
      title: 'Stable Vault Basis',
      href: '/canvas/community-stable-basis',
      lastEditedLabel: 'Updated yesterday',
      createdBy: 'Dito',
      previewEmpty: true,
      previewVariant: 'wide',
      category: 'trade',
    },
    {
      id: 'community-4',
      title: 'DEX Rotation Board',
      href: '/canvas/community-dex-rotation',
      lastEditedLabel: 'Updated 3d ago',
      createdBy: 'Nina',
      previewEmpty: true,
      category: 'yield',
      collaborators: [
        { id: 'member-4', name: 'Nina' },
        { id: 'member-5', name: 'Hiro' },
      ],
    },
    {
      id: 'community-5',
      title: 'Risk Watchlist',
      href: '/canvas/community-risk-watchlist',
      lastEditedLabel: 'Updated 5d ago',
      createdBy: 'Luca',
      previewEmpty: true,
      category: 'featured',
    },
    {
      id: 'community-6',
      title: 'Team Rebalance Grid',
      href: '/canvas/community-team-rebalance',
      lastEditedLabel: 'Updated May 12, 2026',
      createdBy: 'Miko',
      previewEmpty: true,
      previewVariant: 'shifted',
      category: 'yield',
      collaborators: [
        { id: 'member-6', name: 'Miko' },
        { id: 'member-7', name: 'Tara' },
        { id: 'member-8', name: 'Luca' },
      ],
    },
  ] as CommunityProject[],
}

export default function CommunityContent() {
  const [activeFilterId, setActiveFilterId] = useState<CommunityFilterId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewType, setViewType] = useState<CommunityViewType>('card')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<CommunityPageSize>(3)
  const [isPageSizeMenuOpen, setIsPageSizeMenuOpen] = useState(false)

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredProjects = useMemo(() => {
    return communityDataset.projects.filter((project) => {
      const matchesFilter =
        activeFilterId === 'all'
          ? true
          : project.category === activeFilterId
      const matchesSearch = normalizedQuery.length === 0 ? true : project.title.toLowerCase().includes(normalizedQuery)

      return matchesFilter && matchesSearch
    })
  }, [activeFilterId, normalizedQuery])

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize))
  const clampedPage = Math.min(currentPage, totalPages)
  const paginatedProjects = filteredProjects.slice((clampedPage - 1) * pageSize, clampedPage * pageSize)
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const pageSizeMenuGroups = [
    {
      items: COMMUNITY_PAGE_SIZE_OPTIONS.map((sizeOption) => ({
        label: `${sizeOption} items`,
        value: String(sizeOption),
        active: sizeOption === pageSize,
      })),
    },
  ]

  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilterId, normalizedQuery, viewType, pageSize])

  useEffect(() => {
    if (!isPageSizeMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.closest('[data-community-page-size-menu-root="true"]')) {
        return
      }

      setIsPageSizeMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isPageSizeMenuOpen])

  const handlePageSizeMenuClick = (item: DropdownMenuItem) => {
    const nextPageSize = Number(item.value) as CommunityPageSize

    if (COMMUNITY_PAGE_SIZE_OPTIONS.includes(nextPageSize)) {
      setPageSize(nextPageSize)
    }

    setIsPageSizeMenuOpen(false)
  }

  return (
    <div
      style={{
        height: '100%',
        minHeight: 0,
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        gap: 18,
      }}
    >
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1.05 }}>{communityDataset.title}</div>
        <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>{communityDataset.description}</div>
      </div>

      <DashboardCard
        style={{
          minHeight: 0,
          height: '100%',
          padding: 22,
          display: 'grid',
          gridTemplateRows: 'auto minmax(0, 1fr) auto',
          gap: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
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
            {communityDataset.filters.map((filter) => {
              const active = filter.id === activeFilterId

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilterId(filter.id)}
                  style={{
                    height: 30,
                    padding: '0 12px',
                    border: 'none',
                    borderRadius: 999,
                    background: active ? 'var(--canvas-accent)' : 'transparent',
                    color: active ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-tertiary)',
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: 'var(--canvas-font-sans)',
                    transition: 'background 120ms ease, color 120ms ease',
                  }}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'nowrap', justifyContent: 'flex-end', marginLeft: 'auto' }}>
            <label
              style={{
                width: 280,
                minWidth: 220,
                height: 40,
                paddingLeft: 14,
                paddingRight: 14,
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'transparent',
                flex: 'none',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--canvas-text-tertiary)' }}>
                <MagnifyingGlass size={16} weight="bold" />
              </span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search projects"
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--canvas-text-primary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: 0,
                }}
              />
            </label>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: 4,
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'var(--canvas-surface-soft)',
                flex: 'none',
              }}
            >
              <button
                type="button"
                aria-label="Card view"
                title="Card view"
                onClick={() => setViewType('card')}
                style={{
                  width: 30,
                  height: 30,
                  border: 'none',
                  borderRadius: 999,
                  background: viewType === 'card' ? 'var(--canvas-accent)' : 'transparent',
                  color: viewType === 'card' ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-tertiary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <SquaresFour size={14} weight={viewType === 'card' ? 'fill' : 'regular'} />
              </button>
              <button
                type="button"
                aria-label="List view"
                title="List view"
                onClick={() => setViewType('list')}
                style={{
                  width: 30,
                  height: 30,
                  border: 'none',
                  borderRadius: 999,
                  background: viewType === 'list' ? 'var(--canvas-accent)' : 'transparent',
                  color: viewType === 'list' ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-tertiary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Rows size={14} weight={viewType === 'list' ? 'fill' : 'regular'} />
              </button>
            </div>
          </div>
        </div>

        <div
          className="dashboardContentScrollArea"
          style={{
            minHeight: 0,
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: 2,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: viewType === 'card' ? 'repeat(3, minmax(0, 1fr))' : 'minmax(0, 1fr)',
              gap: viewType === 'card' ? 18 : 0,
              minHeight: viewType === 'list' ? '100%' : undefined,
              alignContent: 'start',
            }}
          >
            {viewType === 'list' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '92px minmax(180px, 1.2fr) minmax(120px, 0.8fr) minmax(160px, 1fr)',
                  gap: 14,
                  padding: '0 14px',
                  marginBottom: 8,
                  color: 'var(--canvas-text-secondary)',
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  boxSizing: 'border-box',
                }}
              >
                <div>Preview</div>
                <div>Name</div>
                <div>Creator</div>
                <div>Type</div>
              </div>
            ) : null}

            {paginatedProjects.map((project, index) => (
              <StrategyPreviewCard
                key={project.id}
                title={project.title}
                href={project.href}
                lastEditedLabel={project.lastEditedLabel}
                collaborators={project.collaborators}
                previewVariant={project.previewVariant}
                previewEmpty={project.previewEmpty}
                viewType={viewType}
                isLastInList={viewType === 'list' && index === paginatedProjects.length - 1}
                metadataLabel={`by ${project.createdBy}`}
                metadataPresentation="badge"
                showCollaborators={false}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: 12,
            minHeight: 44,
            paddingTop: 12,
            borderTop: '1px solid var(--canvas-panel-divider)',
          }}
        >
          <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500 }}>
            Showing {paginatedProjects.length === 0 ? 0 : (clampedPage - 1) * pageSize + 1}-{Math.min(clampedPage * pageSize, filteredProjects.length)} of {filteredProjects.length}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
              disabled={clampedPage === 1}
              style={{
                minWidth: 32,
                height: 32,
                padding: '0 10px',
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'transparent',
                color: clampedPage === 1 ? 'var(--canvas-text-tertiary)' : 'var(--canvas-text-primary)',
                cursor: clampedPage === 1 ? 'default' : 'pointer',
                opacity: clampedPage === 1 ? 0.6 : 1,
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Prev
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {pageNumbers.map((pageNumber) => {
                const active = pageNumber === clampedPage

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      border: '1px solid var(--canvas-panel-divider)',
                      background: active ? 'var(--canvas-accent)' : 'transparent',
                      color: active ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-primary)',
                      cursor: 'pointer',
                      fontFamily: 'var(--canvas-font-sans)',
                      fontSize: 11,
                      fontWeight: 600,
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
              disabled={clampedPage === totalPages}
              style={{
                minWidth: 32,
                height: 32,
                padding: '0 10px',
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'transparent',
                color: clampedPage === totalPages ? 'var(--canvas-text-tertiary)' : 'var(--canvas-text-primary)',
                cursor: clampedPage === totalPages ? 'default' : 'pointer',
                opacity: clampedPage === totalPages ? 0.6 : 1,
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Next
            </button>
          </div>

          <div data-community-page-size-menu-root="true" style={{ position: 'relative', justifySelf: 'end' }}>
            <button
              type="button"
              onClick={() => setIsPageSizeMenuOpen((current) => !current)}
              style={{
                height: 32,
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
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {pageSize} items
              <CaretDown size={12} weight="bold" style={{ transform: `rotate(${isPageSizeMenuOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
            </button>

            {isPageSizeMenuOpen ? (
              <DropdownMenu
                open={isPageSizeMenuOpen}
                groups={pageSizeMenuGroups}
                onItemClick={handlePageSizeMenuClick}
                style={{
                  left: '50%',
                  bottom: 'calc(100% + 10px)',
                  minWidth: 132,
                }}
              />
            ) : null}
          </div>
        </div>
      </DashboardCard>
    </div>
  )
}
