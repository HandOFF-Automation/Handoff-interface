import type { ReactNode } from 'react'

type CanvasSidebarFieldSectionProps = {
  title: string
  description?: string
  children: ReactNode
  showDivider?: boolean
}

export default function CanvasSidebarFieldSection({ title, description, children, showDivider = true }: CanvasSidebarFieldSectionProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        paddingBottom: showDivider ? 14 : 0,
        borderBottom: showDivider ? '1px solid var(--canvas-panel-divider)' : 'none',
      }}
    >
      <span
        style={{
          color: 'var(--canvas-text-secondary)',
          fontFamily: 'var(--canvas-font-sans)',
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        {title}
      </span>

      {children}

      {description ? (
        <span
          style={{
            color: 'var(--canvas-text-secondary)',
            fontFamily: 'var(--canvas-font-sans)',
            fontSize: 11,
            lineHeight: 1.45,
          }}
        >
          {description}
        </span>
      ) : null}
    </div>
  )
}
