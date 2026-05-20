import type { CSSProperties, ReactNode } from 'react'

type DashboardCardProps = {
  children: ReactNode
  style?: CSSProperties
}

export function DashboardCard({ children, style }: DashboardCardProps) {
  return (
    <div
      style={{
        minHeight: 0,
        borderRadius: 28,
        border: '1px solid var(--canvas-panel-divider)',
        background: 'var(--canvas-dashboard-card-bg)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

type DashboardSectionCardProps = {
  header: ReactNode
  children: ReactNode
  style?: CSSProperties
  bodyStyle?: CSSProperties
  headerStyle?: CSSProperties
}

export function DashboardSectionCard({ header, children, style, bodyStyle, headerStyle }: DashboardSectionCardProps) {
  return (
    <DashboardCard
      style={{
        display: 'grid',
        gridTemplateRows: '148px minmax(0, 1fr)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          padding: '24px 24px 18px',
          display: 'grid',
          alignContent: 'start',
          gap: 12,
          borderBottom: '1px solid var(--canvas-panel-divider)',
          ...headerStyle,
        }}
      >
        {header}
      </div>

      <div
        style={{
          minHeight: 0,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          ...bodyStyle,
        }}
      >
        {children}
      </div>
    </DashboardCard>
  )
}

type DashboardMetricCardProps = {
  label: string
  value: string
  inlineDetail?: string
  style?: CSSProperties
  labelSuffix?: ReactNode
  meta?: ReactNode
}

export function DashboardMetricCard({ label, value, inlineDetail, style, labelSuffix, meta }: DashboardMetricCardProps) {
  return (
    <DashboardCard
      style={{
        flex: 1,
        borderRadius: 24,
        padding: '18px 20px',
        display: 'grid',
        alignContent: 'center',
        gap: 18,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 13, fontWeight: 600 }}>{label}</div>
        {labelSuffix ? <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{labelSuffix}</div> : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ color: 'var(--canvas-text-primary)', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{value}</div>
        {inlineDetail ? <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500 }}>{inlineDetail}</div> : null}
      </div>
      {meta ? <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{meta}</div> : null}
    </DashboardCard>
  )
}
