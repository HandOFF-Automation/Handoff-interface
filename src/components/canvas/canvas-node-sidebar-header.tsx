import { useState } from 'react'

type CanvasNodeSidebarHeaderProps = {
  title: string
  description: string
  helpTitle: string
  helpBody: string
  closeLabel: string
  onClose: () => void
}

export default function CanvasNodeSidebarHeader({
  title,
  description,
  helpTitle,
  helpBody,
  closeLabel,
  onClose,
}: CanvasNodeSidebarHeaderProps) {
  const [isHelpHovered, setIsHelpHovered] = useState(false)

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        padding: '16px 18px',
        borderBottom: '1px solid var(--canvas-panel-divider)',
        background: 'color-mix(in srgb, var(--canvas-surface) 96%, transparent)',
        backdropFilter: 'blur(16px)',
        zIndex: 1,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span
            style={{
              color: 'var(--canvas-text-primary)',
              fontFamily: 'var(--canvas-font-sans)',
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </span>

          <div
            style={{ position: 'relative', flex: 'none' }}
            onMouseEnter={() => setIsHelpHovered(true)}
            onMouseLeave={() => setIsHelpHovered(false)}
          >
            <span
              aria-label={`${title} help`}
              style={{
                width: 20,
                height: 20,
                borderRadius: '999px',
                border: '1px solid var(--canvas-panel-divider)',
                background: 'var(--canvas-surface-soft)',
                color: 'var(--canvas-text-secondary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 11,
                fontWeight: 700,
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'help',
                boxSizing: 'border-box',
              }}
            >
              ?
            </span>

            {isHelpHovered ? (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 220,
                  padding: 12,
                  borderRadius: 14,
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'color-mix(in srgb, var(--canvas-surface) 94%, transparent)',
                  boxShadow: '0 16px 40px var(--canvas-shadow-soft)',
                  backdropFilter: 'blur(16px)',
                  zIndex: 5,
                }}
              >
                <div
                  style={{
                    color: 'var(--canvas-text-primary)',
                    fontFamily: 'var(--canvas-font-sans)',
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: 1.25,
                    marginBottom: 6,
                  }}
                >
                  {helpTitle}
                </div>
                <div
                  style={{
                    color: 'var(--canvas-text-secondary)',
                    fontFamily: 'var(--canvas-font-sans)',
                    fontSize: 11,
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {helpBody}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <span
          style={{
            color: 'var(--canvas-text-secondary)',
            fontFamily: 'var(--canvas-font-sans)',
            fontSize: 12,
            lineHeight: 1.3,
          }}
        >
          {description}
        </span>
      </div>

      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          border: '1px solid var(--canvas-panel-divider)',
          background: 'var(--canvas-surface-soft)',
          color: 'var(--canvas-text-secondary)',
          fontSize: 18,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flex: 'none',
        }}
      >
        x
      </button>
    </div>
  )
}
