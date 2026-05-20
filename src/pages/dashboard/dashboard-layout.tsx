import {
  ArrowsLeftRight,
  CaretDown,
  Check,
  Copy,
  DownloadSimple,
  MagnifyingGlass,
  Plus,
  SidebarSimple,
  UploadSimple,
} from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import DropdownMenu, { type DropdownMenuItem } from '../../components/dropdown/dropdown-menu'
import brandImage from '../../assets/icon with text/icon-text-no-bg-dark-txt.png'
import profileImage from '../../assets/icon/icon-dark-bg.png'
import { toggleDashboardSidebarMinimized, useDashboardSidebarMinimized } from '../../state/dashboard-sidebar-store'
import { setCanvasTheme, useCanvasTheme } from '../../state/theme-store'
import { dashboardBottomItem, dashboardProfile, dashboardSidebarGroups, type DashboardActiveItem } from './dashboard-config'
import { navigateTo } from '../../state/location-store'

type DashboardLayoutProps = {
  activeItem: DashboardActiveItem
  showPortfolioAction?: boolean
  showHeaderActions?: boolean
  disableContentScroll?: boolean
  children?: React.ReactNode
}

export default function DashboardLayout({ activeItem, showPortfolioAction = false, showHeaderActions, disableContentScroll = false, children }: DashboardLayoutProps) {
  const profileRef = useRef<HTMLDivElement | null>(null)
  const isSidebarMinimized = useDashboardSidebarMinimized()
  const activeTheme = useCanvasTheme()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isWalletAddressCopied, setIsWalletAddressCopied] = useState(false)
  const bottomItem = dashboardBottomItem
  const { balanceLabel, disconnectLabel, strategiesHeaderActions, walletAddress, walletAddressFull } = dashboardProfile
  const sidebarWidth = isSidebarMinimized ? 74 : 236
  const shouldShowHeaderActions = showHeaderActions ?? activeItem === 'Strategies'
  const isExplorePage = activeItem === 'Explore'
  const contentInsetRight = isExplorePage ? 12 : 20
  const contentInsetLeft = sidebarWidth + (isExplorePage ? 16 : 25)

  const profileMenuGroups = [
    {
      items: [
        { label: 'Settings', value: 'settings' },
        { label: disconnectLabel, value: 'disconnect' },
      ],
    },
  ]

  const handleProfileMenuClick = (item: DropdownMenuItem) => {
    setIsProfileMenuOpen(false)

    if (item.value === 'settings') {
      navigateTo('/dashboard/settings')
    }
  }

  const handleCopyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddressFull)
      setIsWalletAddressCopied(true)
      window.setTimeout(() => {
        setIsWalletAddressCopied(false)
      }, 1200)
    } catch {
      // Ignore clipboard failures for now; UI wiring is ready for future toast/error handling.
    }
  }

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (profileRef.current?.contains(event.target as Node)) {
        return
      }

      setIsProfileMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isProfileMenuOpen])

  return (
    <div
      style={{
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--canvas-bg)',
        color: 'var(--canvas-text-primary)',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 74,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 16,
          padding: '0 18px',
          boxSizing: 'border-box',
          borderBottom: '1px solid var(--canvas-panel-divider)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            justifySelf: 'start',
            height: 46,
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 999,
            border: '1px solid var(--canvas-panel-divider)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={brandImage}
            alt="Handoff"
            style={{
              display: 'block',
              height: 34,
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>

        <div
          style={{
            height: 48,
            minWidth: 400,
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 999,
            border: '1px solid var(--canvas-panel-divider)',
            background: 'transparent',
            color: 'var(--canvas-text-tertiary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 10,
            fontFamily: 'var(--canvas-font-sans)',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
              color: 'var(--canvas-text-tertiary)',
            }}
          >
            <MagnifyingGlass size={17} weight="bold" />
          </span>
          <input
            aria-label="Search"
            placeholder="Search"
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
        </div>

        <div ref={profileRef} style={{ justifySelf: 'end', position: 'relative' }}>
          <button
            type="button"
            aria-label="Profile summary"
            title="Profile summary"
            onClick={() => setIsProfileMenuOpen((current) => !current)}
            style={{
              minWidth: 188,
              height: 52,
              paddingLeft: 10,
              paddingRight: 14,
              border: '1px solid var(--canvas-panel-divider)',
              borderRadius: 999,
              background: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: 36,
                height: 36,
                borderRadius: '999px',
                objectFit: 'cover',
                display: 'block',
                flex: 'none',
              }}
            />

            <div style={{ minWidth: 0, textAlign: 'left', flex: 1 }}>
              <div
                style={{
                  color: 'var(--canvas-text-primary)',
                  fontSize: 13,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {walletAddress}
              </div>
            </div>

            <CaretDown
              size={14}
              weight="bold"
              style={{
                color: 'var(--canvas-text-secondary)',
                flex: 'none',
                transform: `rotate(${isProfileMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
              }}
            />
          </button>

          {isProfileMenuOpen ? (
            <DropdownMenu
              open={isProfileMenuOpen}
              groups={profileMenuGroups}
              onItemClick={handleProfileMenuClick}
              header={
                <div style={{ padding: 12, paddingBottom: 6, display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div
                      style={{
                        minWidth: 0,
                        color: 'var(--canvas-text-primary)',
                        fontSize: 13,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {walletAddress}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyWalletAddress}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--canvas-text-secondary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0,
                        flex: 'none',
                        color: isWalletAddressCopied ? 'var(--canvas-accent)' : 'var(--canvas-text-secondary)',
                        transform: `scale(${isWalletAddressCopied ? 1.08 : 1})`,
                        opacity: isWalletAddressCopied ? 1 : 0.9,
                        transition: 'transform 140ms ease, color 140ms ease, opacity 140ms ease',
                      }}
                    >
                      {isWalletAddressCopied ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
                    </button>
                  </div>

                  <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12 }}>{balanceLabel}</div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setCanvasTheme('light')}
                      style={{
                        height: 34,
                        padding: '0 12px',
                        borderRadius: 999,
                        border: `1px solid ${activeTheme === 'light' ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
                        background: activeTheme === 'light' ? 'var(--canvas-accent)' : 'transparent',
                        color: activeTheme === 'light' ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        fontFamily: 'var(--canvas-font-sans)',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      <span>Light Mode</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCanvasTheme('dark')}
                      style={{
                        height: 34,
                        padding: '0 12px',
                        borderRadius: 999,
                        border: `1px solid ${activeTheme === 'dark' ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
                        background: activeTheme === 'dark' ? 'var(--canvas-accent)' : 'transparent',
                        color: activeTheme === 'dark' ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        fontFamily: 'var(--canvas-font-sans)',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      <span>Dark Mode</span>
                    </button>
                  </div>
                </div>
              }
              style={{
                left: 'auto',
                right: 0,
                top: 'calc(100% + 10px)',
                bottom: 'auto',
                transform: 'translateY(0)',
                minWidth: 240,
              }}
            />
          ) : null}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          height: '100%',
          paddingTop: 74,
          boxSizing: 'border-box',
        }}
      >
        <aside
          style={{
            position: 'absolute',
            left: 0,
            top: 74,
            bottom: 0,
            width: isSidebarMinimized ? 74 : 236,
            borderRight: '1px solid var(--canvas-panel-divider)',
            padding: '12px 10px',
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gap: 22,
            boxSizing: 'border-box',
            transition: 'width 200ms ease',
            zIndex: 2,
          }}
        >
          <button
            type="button"
            aria-label="Toggle sidebar"
              title="Toggle sidebar"
              onClick={toggleDashboardSidebarMinimized}
              style={{
              width: '100%',
              height: 38,
              border: 'none',
              borderRadius: 14,
              background: 'transparent',
              color: 'var(--canvas-text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: isSidebarMinimized ? 'center' : 'space-between',
              paddingLeft: isSidebarMinimized ? 0 : 14,
              paddingRight: isSidebarMinimized ? 0 : 14,
              cursor: 'pointer',
              fontFamily: 'var(--canvas-font-sans)',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {!isSidebarMinimized ? <span>Sidebar</span> : null}
            <SidebarSimple size={20} weight="fill" />
          </button>

          <div style={{ display: 'grid', gridTemplateRows: '1fr auto', minHeight: 0 }}>
            <div style={{ display: 'grid', alignContent: 'start', gap: 18 }}>
              {dashboardSidebarGroups.map((group) => (
                <div key={group.heading} style={{ display: 'grid', alignContent: 'start', gap: 10 }}>
                  {!isSidebarMinimized ? (
                    <div
                      style={{
                        color: 'var(--canvas-text-tertiary)',
                        fontSize: 11,
                        fontWeight: 400,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        paddingLeft: 14,
                        paddingRight: 14,
                      }}
                    >
                      {group.heading}
                    </div>
                  ) : null}

                  <div style={{ display: 'grid', alignContent: 'start', gap: 12 }}>
                    {group.items.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          navigateTo(item.href)
                        }}
                        style={{
                          width: '100%',
                          height: 40,
                          border: 'none',
                          borderRadius: 12,
                          background: activeItem === item.label ? 'var(--canvas-accent)' : 'transparent',
                          color: activeItem === item.label ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-tertiary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: isSidebarMinimized ? 'center' : 'flex-start',
                          gap: 12,
                          paddingLeft: isSidebarMinimized ? 0 : 14,
                          paddingRight: isSidebarMinimized ? 0 : 14,
                          cursor: 'pointer',
                          fontFamily: 'var(--canvas-font-sans)',
                          fontSize: 13,
                          fontWeight: 700,
                          transition: 'background-color 140ms ease, color 140ms ease, transform 140ms ease',
                        }}
                        onMouseEnter={(event) => {
                          if (activeItem === item.label) {
                            return
                          }

                          event.currentTarget.style.background = 'var(--canvas-accent)'
                          event.currentTarget.style.color = 'var(--canvas-text-on-accent)'
                          event.currentTarget.style.transform = 'translateX(1px)'
                        }}
                        onMouseLeave={(event) => {
                          if (activeItem === item.label) {
                            event.currentTarget.style.background = 'var(--canvas-accent)'
                            event.currentTarget.style.color = 'var(--canvas-text-on-accent)'
                            event.currentTarget.style.transform = 'none'
                            return
                          }

                          event.currentTarget.style.background = 'transparent'
                          event.currentTarget.style.color = 'var(--canvas-text-tertiary)'
                          event.currentTarget.style.transform = 'none'
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{item.icon}</span>
                        {!isSidebarMinimized ? <span>{item.label}</span> : null}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gap: 12, alignContent: 'end', paddingTop: 18 }}>
              <div style={{ height: 1, background: 'var(--canvas-panel-divider)' }} />
              <button
                type="button"
                onClick={() => {
                  navigateTo(bottomItem.href)
                }}
                style={{
                  width: '100%',
                  height: 40,
                  border: 'none',
                  borderRadius: 12,
                  background: activeItem === bottomItem.label ? 'var(--canvas-accent)' : 'transparent',
                  color: activeItem === bottomItem.label ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-tertiary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: isSidebarMinimized ? 'center' : 'flex-start',
                  gap: 12,
                  paddingLeft: isSidebarMinimized ? 0 : 14,
                  paddingRight: isSidebarMinimized ? 0 : 14,
                  cursor: 'pointer',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 13,
                  fontWeight: 700,
                  transition: 'background-color 140ms ease, color 140ms ease, transform 140ms ease',
                }}
                onMouseEnter={(event) => {
                  if (activeItem === bottomItem.label) {
                    return
                  }

                  event.currentTarget.style.background = 'var(--canvas-accent)'
                  event.currentTarget.style.color = 'var(--canvas-text-on-accent)'
                  event.currentTarget.style.transform = 'translateX(1px)'
                }}
                onMouseLeave={(event) => {
                  if (activeItem === bottomItem.label) {
                    event.currentTarget.style.background = 'var(--canvas-accent)'
                    event.currentTarget.style.color = 'var(--canvas-text-on-accent)'
                    event.currentTarget.style.transform = 'none'
                    return
                  }

                  event.currentTarget.style.background = 'transparent'
                  event.currentTarget.style.color = 'var(--canvas-text-tertiary)'
                  event.currentTarget.style.transform = 'none'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{bottomItem.icon}</span>
                {!isSidebarMinimized ? <span>{bottomItem.label}</span> : null}
              </button>
            </div>
          </div>
        </aside>

        <main
          style={{
            position: 'absolute',
            top: 79,
            right: contentInsetRight,
            bottom: 20,
            left: contentInsetLeft,
            display: 'grid',
            gridTemplateRows: '1fr',
            minHeight: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            transition: 'left 200ms ease',
          }}
        >
          <div
            style={{
              alignSelf: 'stretch',
              justifySelf: 'stretch',
              width: '100%',
              height: '100%',
              borderRadius: 28,
              paddingTop: 25,
              boxSizing: 'border-box',
              pointerEvents: 'auto',
              display: 'grid',
              gridTemplateRows: '1fr',
              minHeight: 0,
            }}
          >
            <div
              className="dashboardContentScrollArea"
              style={{
                minHeight: 0,
                height: '100%',
                overflowY: disableContentScroll ? 'hidden' : 'auto',
                overflowX: 'hidden',
                pointerEvents: 'auto',
                overscrollBehavior: 'contain',
                paddingRight: 2,
                paddingBottom: 24,
                boxSizing: 'border-box',
              }}
            >
              {shouldShowHeaderActions ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    flexWrap: 'wrap',
                    marginBottom: 24,
                  }}
                >
                  <div style={{ color: 'var(--canvas-text-primary)', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{activeItem}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {strategiesHeaderActions.map((action) => {
                      const isPrimary = action.variant === 'primary'
                      const actionIcon =
                        action.id === 'deposit' ? (
                          <DownloadSimple size={14} weight="bold" />
                        ) : action.id === 'withdrawal' ? (
                          <UploadSimple size={14} weight="bold" />
                        ) : (
                          <ArrowsLeftRight size={14} weight="bold" />
                        )

                      return (
                        <button
                          key={action.id}
                          type="button"
                          style={{
                            height: 34,
                            padding: '0 14px',
                            borderRadius: 999,
                            border: `1px solid ${isPrimary ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
                            background: isPrimary ? 'var(--canvas-accent)' : 'transparent',
                            color: isPrimary ? 'var(--canvas-text-on-accent)' : 'var(--canvas-text-primary)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--canvas-font-sans)',
                            fontSize: 11,
                            fontWeight: 600,
                            gap: 8,
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{actionIcon}</span>
                          {action.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
