import { CheckCircle, EnvelopeSimple, UserPlus, XLogo } from '@phosphor-icons/react'

import { DashboardCard } from './dashboard-card'

type SocialActionCardProps = {
  title: string
  description?: string
  icon: 'email' | 'x' | 'invite'
  connected?: boolean
  connectedLabel?: string
  connectedValue?: string
  compact?: boolean
}

const iconByType = {
  email: <EnvelopeSimple size={18} weight="fill" color="var(--canvas-text-primary)" />,
  x: <XLogo size={18} weight="fill" color="var(--canvas-text-primary)" />,
  invite: <UserPlus size={18} weight="fill" color="var(--canvas-text-primary)" />,
} as const

export function SocialActionCard({ title, description, icon, connected, connectedLabel, connectedValue, compact = false }: SocialActionCardProps) {
  return (
    <button
      type="button"
      className="settingsSocialCardButton"
      style={{
        border: 'none',
        padding: 0,
        background: 'transparent',
        textAlign: 'left',
      }}
    >
      <DashboardCard
        style={{
          padding: compact ? '16px 16px 14px' : '18px 18px 16px',
          display: 'grid',
          alignContent: 'start',
          gap: compact ? 12 : 14,
          minHeight: compact ? 132 : 148,
        }}
      >
        <div
          style={{
            width: compact ? 30 : 34,
            height: compact ? 30 : 34,
            borderRadius: 12,
            border: '1px solid var(--canvas-panel-divider)',
            background: 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {iconByType[icon]}
        </div>
        <div style={{ display: 'grid', gap: compact ? 8 : 10 }}>
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: compact ? 15 : 16, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
          {connected ? (
            <div style={{ display: 'grid', gap: 6 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--canvas-text-primary)',
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                <CheckCircle size={14} weight="fill" color="var(--canvas-accent)" />
                <span>{connectedLabel}</span>
              </div>
              <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.5 }}>{connectedValue}</div>
            </div>
          ) : (
            <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.5 }}>{description}</div>
          )}
        </div>
      </DashboardCard>
    </button>
  )
}
