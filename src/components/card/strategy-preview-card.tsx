import type { CSSProperties } from 'react'

import profileImage from '../../assets/icon/icon-dark-bg.png'
import { CanvasThumbnailPreview } from '../canvas/canvas-thumbnail-preview'
import { navigateTo } from '../../state/location-store'
import { DashboardCard } from './dashboard-card'

type StrategyCollaborator = {
  id: string
  name: string
  avatarSrc?: string
}

type StrategyPreviewCardProps = {
  title: string
  href: string
  lastEditedLabel: string
  collaborators?: StrategyCollaborator[]
  previewVariant?: 'default' | 'shifted' | 'wide'
  previewEmpty?: boolean
  viewType?: 'card' | 'list'
  isLastInList?: boolean
  metadataLabel?: string
  metadataPresentation?: 'text' | 'badge'
  showCollaborators?: boolean
  style?: CSSProperties
}

function renderCollaboratorCountLabel(count: number) {
  return `${count} Collaborator${count === 1 ? '' : 's'}`
}

export function StrategyPreviewCard({ title, href, lastEditedLabel, collaborators = [], previewVariant = 'default', previewEmpty = false, viewType = 'card', isLastInList = false, metadataLabel, metadataPresentation = 'text', showCollaborators = true, style }: StrategyPreviewCardProps) {
  const collaboratorPreview = collaborators.slice(0, 2)
  const remainingCollaborators = collaborators.length - collaboratorPreview.length
  const hasCollaborators = showCollaborators && collaborators.length > 0
  const isListView = viewType === 'list'
  const secondaryLabel = metadataLabel ?? lastEditedLabel
  const metadataNode =
    metadataPresentation === 'badge' ? (
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
          width: 'fit-content',
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          boxSizing: 'border-box',
        }}
      >
        {secondaryLabel}
      </span>
    ) : (
      <span
        style={{
          color: 'var(--canvas-text-tertiary)',
          fontSize: 12,
          fontWeight: 500,
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {secondaryLabel}
      </span>
    )

  const collaboratorContent = hasCollaborators ? (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        {collaboratorPreview.map((collaborator, index) => (
          <div
            key={collaborator.id}
            title={collaborator.name}
            style={{
              width: 20,
              height: 20,
              borderRadius: '999px',
              overflow: 'hidden',
              border: '1px solid var(--canvas-dashboard-card-bg)',
              marginLeft: index === 0 ? 0 : -7,
              background: 'var(--canvas-surface-muted)',
              flex: 'none',
            }}
          >
            <img
              src={collaborator.avatarSrc ?? profileImage}
              alt={collaborator.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}

        {remainingCollaborators > 0 ? (
          <div
            style={{
              minWidth: 20,
              height: 20,
              paddingLeft: 4,
              paddingRight: 4,
              borderRadius: '999px',
              border: '1px solid var(--canvas-dashboard-card-bg)',
              marginLeft: collaboratorPreview.length > 0 ? -7 : 0,
              background: 'var(--canvas-surface-muted)',
              color: 'var(--canvas-text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--canvas-font-sans)',
              fontSize: 10,
              fontWeight: 700,
              flex: 'none',
              boxSizing: 'border-box',
            }}
          >
            +{remainingCollaborators}
          </div>
        ) : null}
      </div>

      <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{renderCollaboratorCountLabel(collaborators.length)}</div>
    </div>
  ) : (
    <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500 }}>Solo</div>
  )

  return (
    <button
      type="button"
      onClick={() => navigateTo(href)}
      style={{
        width: '100%',
        padding: 0,
        border: 'none',
        background: 'transparent',
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <DashboardCard
        style={{
          padding: isListView ? '10px 14px' : 14,
          display: 'grid',
          gridTemplateColumns: isListView ? '92px minmax(180px, 1.2fr) minmax(120px, 0.8fr) minmax(160px, 1fr)' : undefined,
          alignItems: isListView ? 'center' : undefined,
          gap: isListView ? 10 : 14,
          borderRadius: isListView ? 0 : 28,
          border: isListView ? 'none' : '1px solid var(--canvas-panel-divider)',
          borderBottom: isListView && !isLastInList ? '1px solid var(--canvas-panel-divider)' : undefined,
          background: isListView ? 'transparent' : 'var(--canvas-dashboard-card-bg)',
          transition: 'transform 160ms ease, border-color 160ms ease, background-color 160ms ease',
          ...style,
        }}
      >
        <div
          style={{
            aspectRatio: isListView ? '16 / 10' : '16 / 10',
            width: isListView ? 72 : undefined,
            borderRadius: isListView ? 10 : 20,
            overflow: 'hidden',
            border: '1px solid var(--canvas-panel-divider)',
            background: 'rgba(255, 255, 255, 0.03)',
          }}
        >
          <CanvasThumbnailPreview title={title} variant={previewVariant} empty={previewEmpty} />
        </div>

        {isListView ? (
          <>
            <div style={{ minWidth: 0, color: 'var(--canvas-text-primary)', fontSize: 15, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </div>
            <div style={{ minWidth: 0 }}>{metadataNode}</div>
            <div style={{ minWidth: 0 }}>
              {showCollaborators ? collaboratorContent : null}
            </div>
          </>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ color: 'var(--canvas-text-primary)', fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 22 }}>
              <div style={{ minWidth: 0 }}>{metadataNode}</div>
              {showCollaborators ? (hasCollaborators ? collaboratorContent : null) : null}
            </div>
          </div>
        )}
      </DashboardCard>
    </button>
  )
}

export type { StrategyCollaborator }
