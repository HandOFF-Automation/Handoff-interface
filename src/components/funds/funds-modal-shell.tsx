import { X } from '@phosphor-icons/react'
import { useEffect, type ReactNode } from 'react'

type FundsModalShellProps = {
  open: boolean
  title: string
  description: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export default function FundsModalShell({ open, title, description, onClose, children, footer }: FundsModalShellProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        display: 'grid',
        placeItems: 'center',
        padding: 20,
        background: 'var(--canvas-overlay-scrim)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(100%, 520px)',
          borderRadius: 28,
          border: '1px solid var(--canvas-panel-divider)',
          background: 'var(--canvas-dashboard-card-bg)',
          boxShadow: 'var(--canvas-shadow-floating)',
          display: 'grid',
          overflow: 'hidden',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          style={{
            padding: '22px 22px 18px',
            display: 'grid',
            gap: 14,
            borderBottom: '1px solid var(--canvas-panel-divider)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
              <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>{description}</div>
            </div>

            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'transparent',
                color: 'var(--canvas-text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <X size={16} weight="bold" />
            </button>
          </div>
        </div>

        <div style={{ padding: 22, display: 'grid', gap: 16 }}>{children}</div>

        {footer ? (
          <div
            style={{
              padding: '0 22px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 10,
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
