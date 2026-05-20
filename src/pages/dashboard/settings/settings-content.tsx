import { Moon, Sun, UploadSimple } from '@phosphor-icons/react'
import { useState } from 'react'

import { DashboardCard } from '../../../components/card/dashboard-card'
import { SocialActionCard } from '../../../components/card/social-action-card'
import profileImage from '../../../assets/icon/icon-dark-bg.png'
import { setCanvasTheme, useCanvasTheme } from '../../../state/theme-store'

const settingsDataset = {
  title: 'Settings',
  profileCard: {
    title: 'Profile Settings',
    description: 'Update your profile photo and username that appear across your dashboard.',
    usernamePlaceholder: 'Enter your username',
    submitLabel: 'Send',
  },
  themeCard: {
    title: 'Theme',
    description: 'Choose between dark mode and light mode for your dashboard experience.',
    options: [
      {
        id: 'dark',
        label: 'Dark Mode',
        icon: 'dark',
      },
      {
        id: 'light',
        label: 'Light Mode',
        icon: 'light',
      },
    ],
  },
  connectionsCard: {
    title: 'Social',
    description: 'Link external channels and invite users to expand your account reach.',
    actions: [
      {
        id: 'connect-email',
        title: 'Connect Email',
        description: 'Link your email to enable recovery and notifications.',
        icon: 'email',
        connected: true,
        connectedLabel: 'Connected',
        connectedValue: 'handoff@handoff.app',
      },
      {
        id: 'connect-x',
        title: 'Connect X/Twitter',
        description: 'Connect your X profile for identity and social presence.',
        icon: 'x',
        connected: false,
      },
      {
        id: 'invite-friend',
        title: 'Invite Friend',
        description: 'Invite friends into your network and grow your ecosystem.',
        icon: 'invite',
        connected: false,
      },
    ],
  },
}

export default function SettingsContent() {
  const [username, setUsername] = useState('')
  const hasUsername = username.trim().length > 0
  const activeTheme = useCanvasTheme()

  const themeIconByType = {
    dark: <Moon size={18} weight="fill" color="var(--canvas-text-primary)" />,
    light: <Sun size={18} weight="fill" color="var(--canvas-text-primary)" />,
  } as const

  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
      }}
    >
      <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1.05 }}>{settingsDataset.title}</div>

      <DashboardCard
        style={{
          padding: '20px',
          display: 'grid',
          gap: 16,
        }}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{settingsDataset.profileCard.title}</div>
          <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>{settingsDataset.profileCard.description}</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto minmax(0, 1fr)',
            gap: 20,
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            aria-label="Change profile photo"
            style={{
              width: 46,
              height: 46,
              borderRadius: '999px',
              border: '1px solid var(--canvas-panel-divider)',
              background: 'transparent',
              color: 'var(--canvas-text-primary)',
              display: 'grid',
              placeItems: 'center',
              padding: 0,
              boxSizing: 'border-box',
              flex: 'none',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={profileImage}
              alt="Current profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <span
              style={{
                position: 'absolute',
                inset: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--canvas-overlay-scrim)',
                backdropFilter: 'blur(2px)',
                color: 'var(--canvas-text-on-accent)',
                opacity: 0,
                transition: 'opacity 160ms ease',
                borderRadius: '999px',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.opacity = '1'
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.opacity = '0'
              }}
            >
              <UploadSimple size={18} weight="bold" />
            </span>
          </button>

          <div style={{ display: 'grid', gap: 10 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                minHeight: 46,
                padding: 6,
                borderRadius: 14,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'transparent',
                boxSizing: 'border-box',
              }}
            >
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={settingsDataset.profileCard.usernamePlaceholder}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 34,
                  padding: '0 12px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--canvas-text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'var(--canvas-font-sans)',
                }}
              />
              <button
                type="button"
                style={{
                  height: 32,
                  padding: '0 14px',
                  borderRadius: 999,
                  border: `1px solid ${hasUsername ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
                  background: hasUsername ? 'var(--canvas-accent)' : 'transparent',
                  color: hasUsername ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: 'var(--canvas-font-sans)',
                  flex: 'none',
                }}
              >
                {settingsDataset.profileCard.submitLabel}
              </button>
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard
        style={{
          padding: '20px',
          display: 'grid',
          gap: 16,
        }}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{settingsDataset.themeCard.title}</div>
          <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>{settingsDataset.themeCard.description}</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 16,
          }}
        >
          {settingsDataset.themeCard.options.map((option) => {
            const active = activeTheme === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setCanvasTheme(option.id)}
                style={{
                  border: 'none',
                  padding: 0,
                  background: 'transparent',
                  textAlign: 'left',
                }}
              >
                <DashboardCard
                  style={{
                    padding: '16px 16px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: active ? 'var(--canvas-hover-accent-soft)' : 'var(--canvas-dashboard-card-bg)',
                    border: `1px solid ${active ? 'var(--canvas-hover-accent-strong)' : 'var(--canvas-panel-divider)'}`,
                    transition: 'background-color 180ms ease, border-color 180ms ease',
                  }}
                >
                  <span
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
                    {themeIconByType[option.icon as keyof typeof themeIconByType]}
                  </span>
                  <span
                    style={{
                      color: active ? 'var(--canvas-text-primary)' : 'var(--canvas-text-secondary)',
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: 1.2,
                      fontFamily: 'var(--canvas-font-sans)',
                    }}
                  >
                    {option.label}
                  </span>
                </DashboardCard>
              </button>
            )
          })}
        </div>
      </DashboardCard>

      <DashboardCard
        style={{
          padding: '20px',
          display: 'grid',
          gap: 16,
        }}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{settingsDataset.connectionsCard.title}</div>
          <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12, fontWeight: 500, lineHeight: 1.6 }}>{settingsDataset.connectionsCard.description}</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 18,
          }}
        >
          {settingsDataset.connectionsCard.actions.map((action) => (
            <SocialActionCard
              key={action.id}
              title={action.title}
              description={action.description}
              icon={action.icon}
              connected={action.connected}
              connectedLabel={action.connectedLabel}
              connectedValue={action.connectedValue}
              compact
            />
          ))}
        </div>
      </DashboardCard>
    </div>
  )
}
