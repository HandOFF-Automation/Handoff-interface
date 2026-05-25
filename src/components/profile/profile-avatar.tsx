import { CaretDown, Check, Copy, Play, UsersThree, CircleNotch, Pause } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'
import { StrategyTrendChart } from '../chart/strategy-trend-chart'
import type { UTCTimestamp } from 'lightweight-charts'
import CanvasNodeSidebarHeader from '../canvas/canvas-node-sidebar-header'
import profileImage from '../../assets/icon/icon-dark-bg.png'
import { navigateTo } from '../../state/location-store'
import { setCanvasTheme, useCanvasTheme } from '../../state/theme-store'

type CollaboratorPermission = 'full-collaborate' | 'view-only'

type CollaboratorInvite = {
  email: string
  permission: CollaboratorPermission
  status: 'invited'
}

export default function ProfileAvatar() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const activeTheme = useCanvasTheme()
  const [collaboratorEmail, setCollaboratorEmail] = useState('')
  const [collaboratorPermission, setCollaboratorPermission] = useState<CollaboratorPermission>('full-collaborate')
  const [invites, setInvites] = useState<CollaboratorInvite[]>([
    { email: 'handoff@handoff.app', permission: 'full-collaborate', status: 'invited' },
  ])
  const [isCollaborateMenuOpen, setIsCollaborateMenuOpen] = useState(false)
  const [isPermissionMenuOpen, setIsPermissionMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isWalletAddressCopied, setIsWalletAddressCopied] = useState(false)
  const walletAddress = '0x8F21...A91C'
  const walletAddressFull = '0x8F21D9A4C6B18E72A91C'

  const [executionState, setExecutionState] = useState<'idle' | 'configuring' | 'starting' | 'running'>('idle')
  const [startMode, setStartMode] = useState<'onchain' | 'realtime-test' | 'historical-test' | null>(null)
  const [backtestSpeed, setBacktestSpeed] = useState<'fast' | 'mid' | 'low'>('mid')
  const [realtimeDuration, setRealtimeDuration] = useState<number>(5)
  const [totalDuration, setTotalDuration] = useState<number>(120)
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [durationString, setDurationString] = useState('0s')

  const startStrategiesMenuGroups = useMemo(
    () => [
      {
        items: [
          { label: 'Start On-Chain Strategies', value: 'onchain' },
          { label: 'Start Real-Time Test', value: 'realtime-test' },
          { label: 'Start Historical Backtest', value: 'historical-test' },
        ],
      },
    ],
    [],
  )

  const mockChartData = useMemo(() => {
    const start = 1716483600 // some UTC timestamp
    return Array.from({ length: 8 }, (_, i) => ({
      time: (start + i * 86400) as UTCTimestamp,
      value: 1000 + i * (i * 8 + Math.random() * 20),
    }))
  }, [])

  // Toggle strategies running class on body
  useEffect(() => {
    if (executionState === 'running') {
      document.body.classList.add('strategies-running')
    } else {
      document.body.classList.remove('strategies-running')
    }
    return () => {
      document.body.classList.remove('strategies-running')
    }
  }, [executionState])

  const [remainingTime, setRemainingTime] = useState<number>(120)

  // Active Duration ticker
  useEffect(() => {
    if (executionState !== 'running' || !startedAt) {
      setDurationString('0s')
      return
    }
    const updateDuration = () => {
      const diffSeconds = Math.floor((Date.now() - startedAt) / 1000)
      if (diffSeconds < 60) {
        setDurationString(`${diffSeconds}s`)
      } else {
        const minutes = Math.floor(diffSeconds / 60)
        const seconds = diffSeconds % 60
        setDurationString(`${minutes}m ${seconds}s`)
      }
    }
    updateDuration()
    const timer = setInterval(updateDuration, 1000)
    return () => clearInterval(timer)
  }, [executionState, startedAt])

  // Remaining time ticker
  useEffect(() => {
    if (executionState !== 'running' || !startedAt) {
      setRemainingTime(totalDuration)
      return
    }
    if (startMode !== 'historical-test' && startMode !== 'realtime-test') {
      return
    }
    const updateRemaining = () => {
      const diffSeconds = Math.floor((Date.now() - startedAt) / 1000)
      const left = Math.max(0, totalDuration - diffSeconds)
      setRemainingTime(left)
    }
    updateRemaining()
    const timer = setInterval(updateRemaining, 1000)
    return () => clearInterval(timer)
  }, [executionState, startMode, startedAt, totalDuration])

  const remainingString = useMemo(() => {
    if (remainingTime <= 0) {
      return 'Completed'
    }
    if (remainingTime < 60) {
      return `${remainingTime}s`
    }
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60
    return `${minutes}m ${seconds}s`
  }, [remainingTime])

  const handleStartExecution = () => {
    setExecutionState('starting')
    
    let durationSec = 120
    if (startMode === 'historical-test') {
      if (backtestSpeed === 'fast') durationSec = 15
      else if (backtestSpeed === 'mid') durationSec = 45
      else if (backtestSpeed === 'low') durationSec = 90
    } else if (startMode === 'realtime-test') {
      durationSec = realtimeDuration * 60
    }
    
    setTotalDuration(durationSec)
    setRemainingTime(durationSec)
    
    setTimeout(() => {
      setExecutionState('running')
      setStartedAt(Date.now())
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 4000)
    }, 1200)
  }

  const handleStartMenuClick = (item: DropdownMenuItem) => {
    setIsStartMenuOpen(false)
    const mode = item.value as 'onchain' | 'realtime-test' | 'historical-test'
    setStartMode(mode)
    setExecutionState('configuring')
    setIsDetailsOpen(true)
  }

  const profileMenuGroups = useMemo(
    () => [
      {
        items: [
          { label: 'Settings', value: 'settings' },
          { label: 'Disconnected', value: 'disconnect' },
        ],
      },
    ],
    [],
  )

  const handleProfileMenuClick = (item: DropdownMenuItem) => {
    if (item.value === 'settings') {
      navigateTo('/dashboard/settings')
    }

    setIsProfileMenuOpen(false)
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

  const permissionMenuGroups = useMemo(
    () => [
      {
        items: [
          { label: 'Full Collaborate', value: 'full-collaborate', active: collaboratorPermission === 'full-collaborate' },
          { label: 'View Only', value: 'view-only', active: collaboratorPermission === 'view-only' },
        ],
      },
    ],
    [collaboratorPermission],
  )

  const handlePermissionMenuClick = (item: DropdownMenuItem) => {
    const nextPermission = item.value as CollaboratorPermission | undefined

    if (nextPermission === 'full-collaborate' || nextPermission === 'view-only') {
      setCollaboratorPermission(nextPermission)
    }

    setIsPermissionMenuOpen(false)
  }

  const handleInviteCollaborator = () => {
    const nextEmail = collaboratorEmail.trim()

    if (!nextEmail) {
      return
    }

    setInvites((current) => [{ email: nextEmail, permission: collaboratorPermission, status: 'invited' }, ...current])
    setCollaboratorEmail('')
  }

  const permissionLabel = collaboratorPermission === 'full-collaborate' ? 'Full Collaborate' : 'View Only'
  const collaboratorPreview = invites.slice(0, 2)
  const remainingCollaborators = invites.length - collaboratorPreview.length

  const handleCloseMonitor = () => {
    setIsDetailsOpen(false)
    if (executionState === 'configuring') {
      setExecutionState('idle')
      setStartMode(null)
    }
  }

  useEffect(() => {
    if (!isCollaborateMenuOpen && !isPermissionMenuOpen && !isProfileMenuOpen && !isStartMenuOpen && !isDetailsOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsCollaborateMenuOpen(false)
      setIsPermissionMenuOpen(false)
      setIsProfileMenuOpen(false)
      setIsStartMenuOpen(false)
      if (isDetailsOpen) {
        handleCloseMonitor()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isCollaborateMenuOpen, isPermissionMenuOpen, isProfileMenuOpen, isStartMenuOpen, isDetailsOpen, executionState])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 18,
        right: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        pointerEvents: 'auto',
      }}
    >
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          aria-label="Collaborate"
          title="Collaborate"
          onClick={() => setIsCollaborateMenuOpen((current) => !current)}
          style={{
            height: 42,
            paddingLeft: 14,
            paddingRight: 14,
            borderRadius: 999,
            border: '1px solid var(--canvas-dock-border)',
            background: 'var(--canvas-surface-strong)',
            boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
            color: 'var(--canvas-text-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <UsersThree size={16} weight="duotone" />
          <span style={{ fontFamily: 'var(--canvas-font-sans)', fontSize: 12, fontWeight: 700 }}>Collaborate</span>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
            {collaboratorPreview.map((invite, index) => (
              <div
                key={`${invite.email}-preview`}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '999px',
                  overflow: 'hidden',
                  border: '1px solid var(--canvas-surface-strong)',
                  marginLeft: index === 0 ? 0 : -6,
                  background: 'var(--canvas-surface-muted)',
                  flex: 'none',
                }}
              >
                <img
                  src={profileImage}
                  alt={invite.email}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            ))}

            {remainingCollaborators > 0 ? (
              <div
                style={{
                  minWidth: 18,
                  height: 18,
                  paddingLeft: 4,
                  paddingRight: 4,
                  borderRadius: '999px',
                  border: '1px solid var(--canvas-surface-strong)',
                  marginLeft: collaboratorPreview.length > 0 ? -6 : 0,
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
          <CaretDown
            size={12}
            weight="regular"
            style={{
              transform: `rotate(${isCollaborateMenuOpen ? '180deg' : '0deg'})`,
              transition: 'transform 160ms ease',
            }}
          />
        </button>

        {isCollaborateMenuOpen ? (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 12px)',
              width: 320,
              borderRadius: 18,
              background: 'var(--canvas-surface)',
              border: '1px solid var(--canvas-panel-border)',
              boxShadow: '0 18px 34px var(--canvas-dock-shadow)',
              overflow: 'visible',
              opacity: 1,
              pointerEvents: 'auto',
              transform: 'translateY(0)',
              transition: 'opacity 140ms ease, transform 140ms ease',
              backdropFilter: 'blur(18px)',
            }}
          >
          <div
            style={{
              padding: '12px 14px 10px',
              borderBottom: '1px solid var(--canvas-panel-divider)',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              background: 'var(--canvas-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <div style={{ color: 'var(--canvas-text-primary)', fontSize: 12, fontWeight: 700 }}>Invite Collaborator</div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                {collaboratorPreview.map((invite, index) => (
                  <div
                    key={`${invite.email}-header-preview`}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '999px',
                      overflow: 'hidden',
                      border: '1px solid var(--canvas-surface)',
                      marginLeft: index === 0 ? 0 : -7,
                      background: 'var(--canvas-surface-muted)',
                      flex: 'none',
                    }}
                  >
                    <img
                      src={profileImage}
                      alt={invite.email}
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
                      border: '1px solid var(--canvas-surface)',
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
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: 7,
                borderRadius: 16,
                background: 'var(--canvas-surface-muted)',
                border: '1px solid var(--canvas-panel-divider)',
              }}
            >
              <input
                value={collaboratorEmail}
                onChange={(event) => setCollaboratorEmail(event.target.value)}
                placeholder="Enter email"
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--canvas-text-primary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 12,
                  paddingLeft: 10,
                }}
              />

              <button
                type="button"
                onClick={handleInviteCollaborator}
                style={{
                  height: 34,
                  paddingLeft: 12,
                  paddingRight: 12,
                  border: 'none',
                  borderRadius: 10,
                  background: 'var(--canvas-accent)',
                  color: '#ffffff',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  flex: 'none',
                }}
              >
                Invite
              </button>
            </div>

            <div style={{ position: 'relative', marginTop: 10 }}>
              <button
                type="button"
                onClick={() => setIsPermissionMenuOpen((current) => !current)}
                style={{
                  width: '100%',
                  height: 38,
                  border: '1px solid var(--canvas-panel-divider)',
                  borderRadius: 14,
                  background: 'var(--canvas-surface-muted)',
                  color: 'var(--canvas-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingLeft: 12,
                  paddingRight: 12,
                  cursor: 'pointer',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                <span>{permissionLabel}</span>
                <CaretDown
                  size={12}
                  weight="regular"
                  style={{
                    transform: `rotate(${isPermissionMenuOpen ? '180deg' : '0deg'})`,
                    transition: 'transform 160ms ease',
                  }}
                />
              </button>

              {isPermissionMenuOpen ? (
                <DropdownMenu
                  open={isPermissionMenuOpen}
                  groups={permissionMenuGroups}
                  onItemClick={handlePermissionMenuClick}
                  style={{ left: 0, right: 0, top: 'calc(100% + 8px)', bottom: 'auto', transform: 'translateY(0)', minWidth: '100%' }}
                />
              ) : null}
            </div>
          </div>

          <div
            style={{
              maxHeight: 220,
              overflowY: 'auto',
              padding: 8,
              display: 'grid',
              gap: 6,
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              background: 'var(--canvas-surface)',
            }}
          >
            {invites.map((invite) => (
              <div
                key={`${invite.email}-${invite.permission}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 14,
                  background: 'var(--canvas-surface-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <img
                    src={profileImage}
                    alt={invite.email}
                    style={{ width: 28, height: 28, borderRadius: '999px', objectFit: 'cover', display: 'block', flex: 'none' }}
                  />
                  <div style={{ minWidth: 0, display: 'grid', gap: 2 }}>
                    <span style={{ color: 'var(--canvas-text-primary)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {invite.email}
                    </span>
                    <span style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11 }}>
                      {invite.permission === 'full-collaborate' ? 'Full Collaborate' : 'View Only'}
                    </span>
                  </div>
                </div>

                <span style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11, flex: 'none' }}>{invite.status}</span>
              </div>
            ))}
          </div>
          </div>
        ) : null}
      </div>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          aria-label="Start Strategies"
          title="Start Strategies"
          onClick={() => {
            if (executionState === 'idle') {
              setIsStartMenuOpen((current) => !current)
            } else if (executionState === 'configuring' || executionState === 'running') {
              if (isDetailsOpen) {
                handleCloseMonitor()
              } else {
                setIsDetailsOpen(true)
              }
            }
          }}
          disabled={executionState === 'starting'}
          className={(executionState === 'running' || executionState === 'configuring') ? 'start-strategies-running-glow' : ''}
          style={{
            height: 42,
            paddingLeft: 14,
            paddingRight: 14,
            borderRadius: 999,
            border: (executionState === 'running' || executionState === 'configuring') ? '1px solid var(--canvas-accent)' : '1px solid var(--canvas-dock-border)',
            background: (executionState === 'running' || executionState === 'configuring') ? 'var(--canvas-hover-accent-faint)' : 'var(--canvas-surface-strong)',
            boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
            color: (executionState === 'running' || executionState === 'configuring') ? 'var(--canvas-accent)' : 'var(--canvas-text-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: executionState === 'starting' ? 'not-allowed' : 'pointer',
            opacity: executionState === 'starting' ? 0.8 : 1,
            transition: 'all 140ms ease',
          }}
        >
          {executionState === 'starting' ? (
            <CircleNotch size={16} style={{ animation: 'spin 1s linear infinite' }} />
          ) : executionState === 'running' ? (
            <Pause size={16} weight="duotone" />
          ) : (
            <Play size={16} weight="duotone" />
          )}
          <span style={{ fontFamily: 'var(--canvas-font-sans)', fontSize: 12, fontWeight: 700 }}>
            {executionState === 'starting'
              ? 'Starting...'
              : executionState === 'running'
                ? startMode === 'onchain'
                  ? 'Running On-Chain'
                  : startMode === 'realtime-test'
                    ? 'Running Real-Time'
                    : 'Running Backtest'
                : executionState === 'configuring'
                  ? startMode === 'onchain'
                    ? 'Configuring On-Chain'
                    : startMode === 'realtime-test'
                      ? 'Configuring Test'
                      : 'Configuring Backtest'
                  : 'Start Strategies'}
          </span>
          {executionState === 'idle' ? (
            <CaretDown
              size={12}
              weight="regular"
              style={{
                transform: `rotate(${isStartMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
              }}
            />
          ) : null}
        </button>

        {isStartMenuOpen ? (
          <DropdownMenu
            open={isStartMenuOpen}
            groups={startStrategiesMenuGroups}
            onItemClick={handleStartMenuClick}
            style={{ left: 'auto', right: 0, top: 'calc(100% + 12px)', bottom: 'auto', transform: 'translateY(0)', minWidth: 200 }}
          />
        ) : null}

        {isDetailsOpen ? (
          <aside
            aria-hidden={!isDetailsOpen}
            style={{
              position: 'fixed',
              top: 72,
              right: 18,
              width: 280,
              minHeight: 188,
              maxHeight: 'calc(100vh - 164px)',
              borderRadius: 20,
              border: '1px solid var(--canvas-panel-divider)',
              background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)',
              boxShadow: '0 16px 40px var(--canvas-shadow-soft)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              pointerEvents: isDetailsOpen ? 'auto' : 'none',
              opacity: isDetailsOpen ? 1 : 0,
              transform: isDetailsOpen ? 'translateX(0)' : 'translateX(16px)',
              transition: 'opacity 180ms ease, transform 180ms ease',
              zIndex: 100,
              color: 'var(--canvas-text-primary)',
            }}
          >
            <CanvasNodeSidebarHeader
              title={
                startMode === 'onchain'
                  ? 'On-Chain Monitor'
                  : startMode === 'realtime-test'
                    ? 'Real-Time Monitor'
                    : 'Backtest Monitor'
              }
              description="Real-time execution dashboard."
              helpTitle="Strategy Execution Monitor"
              helpBody="This panel shows the active running status, performance trend chart, and real-time statistics of the executing strategy flow."
              closeLabel="Close monitor sidebar"
              onClose={handleCloseMonitor}
            />
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {executionState === 'configuring' ? (
                <>
                  {/* Configuration Area */}
                  {startMode === 'historical-test' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
                        BACKTEST SPEED
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        {(['fast', 'mid', 'low'] as const).map((speed) => (
                          <button
                            key={speed}
                            type="button"
                            onClick={() => setBacktestSpeed(speed)}
                            style={{
                              flex: 1,
                              height: 38,
                              borderRadius: 12,
                              border: '1px solid var(--canvas-panel-divider)',
                              background: backtestSpeed === speed ? 'var(--canvas-accent)' : 'var(--canvas-surface-soft)',
                              color: backtestSpeed === speed ? '#ffffff' : 'var(--canvas-text-primary)',
                              fontFamily: 'var(--canvas-font-sans)',
                              fontSize: 12,
                              fontWeight: 700,
                              textTransform: 'capitalize',
                              cursor: 'pointer',
                              transition: 'all 120ms ease',
                            }}
                          >
                            {speed}
                          </button>
                        ))}
                      </div>
                      <div style={{ color: 'var(--canvas-text-tertiary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 11, lineHeight: '1.4', marginTop: 4 }}>
                        {backtestSpeed === 'fast' && 'Simulates 1 year of daily steps (~15s)'}
                        {backtestSpeed === 'mid' && 'Simulates 1 year of 4-hour steps (~45s)'}
                        {backtestSpeed === 'low' && 'Simulates 1 year of 1-hour steps (~90s)'}
                      </div>
                    </div>
                  ) : startMode === 'realtime-test' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
                        TEST DURATION
                      </div>
                      <div
                        style={{
                          minHeight: 48,
                          borderRadius: 14,
                          border: '1px solid var(--canvas-panel-divider)',
                          background: 'var(--canvas-surface-soft)',
                          padding: '0 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginTop: 4,
                        }}
                      >
                        <input
                          type="text"
                          inputMode="numeric"
                          value={realtimeDuration}
                          onChange={(event) => {
                            const val = event.target.value.replace(/[^0-9]/g, '')
                            setRealtimeDuration(val ? Math.max(1, parseInt(val, 10)) : 1)
                          }}
                          placeholder="5"
                          style={{
                            flex: 1,
                            minWidth: 0,
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            color: 'var(--canvas-text-primary)',
                            fontFamily: 'var(--canvas-font-sans)',
                            fontSize: 14,
                            fontWeight: 700,
                            padding: 0,
                          }}
                        />
                        <span style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 12, fontWeight: 700 }}>
                          Min
                        </span>
                      </div>
                      <div style={{ color: 'var(--canvas-text-tertiary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 11, lineHeight: '1.4', marginTop: 4 }}>
                        Simulation will run for {realtimeDuration} minutes and stop.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
                        DEPLOYMENT DETAILS
                      </div>
                      <div
                        style={{
                          background: 'var(--canvas-surface-soft)',
                          border: '1px solid var(--canvas-panel-divider)',
                          borderRadius: 14,
                          padding: '12px 14px',
                          display: 'grid',
                          gap: 8,
                          marginTop: 4,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                          <span style={{ color: 'var(--canvas-text-secondary)' }}>Network</span>
                          <span style={{ fontWeight: 700 }}>Mantle L2</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                          <span style={{ color: 'var(--canvas-text-secondary)' }}>Status</span>
                          <span style={{ fontWeight: 700, color: 'var(--canvas-accent)' }}>Ready</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Spacer to push button to bottom */}
                  <div style={{ flex: 1 }} />

                  {/* Confirm & Start Button */}
                  <button
                    type="button"
                    onClick={handleStartExecution}
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 12,
                      border: 'none',
                      background: 'var(--canvas-accent)',
                      color: '#ffffff',
                      fontFamily: 'var(--canvas-font-sans)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'opacity 140ms ease',
                    }}
                  >
                    {startMode === 'historical-test'
                      ? 'Start Backtest'
                      : startMode === 'realtime-test'
                        ? 'Start Test'
                        : 'Start On-Chain'}
                  </button>
                </>
              ) : (
                <>
                  {/* Chart Section */}
                  <div
                    style={{
                      background: 'var(--canvas-surface-muted)',
                      border: '1px solid var(--canvas-panel-divider)',
                      borderRadius: 14,
                      padding: '16px 14px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
                      PERFORMANCE TREND
                    </div>
                    <div style={{ height: 110, width: '100%', position: 'relative' }}>
                      <StrategyTrendChart data={mockChartData} label="Simulation Return" />
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: 'var(--canvas-panel-divider)' }} />

                  {/* Information Summary */}
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--canvas-text-secondary)' }}>Status</span>
                      <span style={{ 
                        fontWeight: 700, 
                        color: 'var(--canvas-accent)', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 6 
                      }}>
                        {(startMode === 'historical-test' || startMode === 'realtime-test') && remainingTime <= 0 ? (
                          <span>COMPLETED</span>
                        ) : (
                          <>
                            <span style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: 'var(--canvas-accent)',
                              animation: 'liveDotPulse 1.8s infinite ease-in-out'
                            }} />
                            <span>LIVE</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--canvas-text-secondary)' }}>Total Return</span>
                      <span style={{ fontWeight: 700, color: 'var(--canvas-accent)' }}>+8.45% (+$84.50)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--canvas-text-secondary)' }}>Active Duration</span>
                      <span style={{ fontWeight: 700 }}>{durationString}</span>
                    </div>
                    {(startMode === 'historical-test' || startMode === 'realtime-test') ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: 'var(--canvas-text-secondary)' }}>Remaining Time</span>
                        <span style={{ fontWeight: 700, color: remainingTime <= 0 ? 'var(--canvas-accent)' : 'var(--canvas-text-primary)' }}>
                          {remainingString}
                        </span>
                      </div>
                    ) : null}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--canvas-text-secondary)' }}>Transactions</span>
                      <span style={{ fontWeight: 700 }}>12</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--canvas-text-secondary)' }}>Nodes Evaluated</span>
                      <span style={{ fontWeight: 700 }}>342</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--canvas-text-secondary)' }}>Gas Spent</span>
                      <span style={{ fontWeight: 700 }}>0.024 MNT</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: 'var(--canvas-panel-divider)' }} />

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setExecutionState('idle')
                      setStartMode(null)
                      setIsDetailsOpen(false)
                      setShowToast(false)
                    }}
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 12,
                      border: 'none',
                      background: 'var(--canvas-danger)',
                      color: '#ffffff',
                      fontFamily: 'var(--canvas-font-sans)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'opacity 140ms ease',
                    }}
                  >
                    Stop Strategy Execution
                  </button>
                </>
              )}
            </div>
          </aside>
        ) : null}
      </div>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          aria-label="Profile"
          title="Profile"
          onClick={() => setIsProfileMenuOpen((current) => !current)}
          style={{
            width: 42,
            height: 42,
            padding: 0,
            borderRadius: '999px',
            border: '1px solid var(--canvas-dock-border)',
            background: 'var(--canvas-surface-strong)',
            boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <img
            src={profileImage}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
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
                    color: isWalletAddressCopied ? 'var(--canvas-accent)' : 'var(--canvas-text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    flex: 'none',
                    transform: `scale(${isWalletAddressCopied ? 1.08 : 1})`,
                    opacity: isWalletAddressCopied ? 1 : 0.9,
                    transition: 'transform 140ms ease, color 140ms ease, opacity 140ms ease',
                  }}
                >
                  {isWalletAddressCopied ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
                </button>
                </div>

                <div style={{ color: 'var(--canvas-text-tertiary)', fontSize: 12 }}>Balance Mantle: 12.84 MNT</div>

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
              top: 'calc(100% + 12px)',
              bottom: 'auto',
              transform: 'translateY(0)',
              minWidth: 240,
            }}
          />
        ) : null}
      </div>

      {/* Floating Success Toast */}
      {showToast ? (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            borderRadius: 16,
            background: activeTheme === 'light' ? 'rgba(255, 255, 255, 0.94)' : 'rgba(10, 10, 10, 0.92)',
            border: activeTheme === 'light' ? '1px solid rgba(0, 164, 255, 0.28)' : '1px solid rgba(0, 164, 255, 0.35)',
            boxShadow: activeTheme === 'light' 
              ? '0 20px 40px rgba(15, 23, 42, 0.08), 0 0 20px rgba(0, 164, 255, 0.08)' 
              : '0 20px 40px rgba(0, 0, 0, 0.55), 0 0 20px rgba(0, 164, 255, 0.15)',
            backdropFilter: 'blur(16px)',
            color: activeTheme === 'light' ? 'var(--canvas-text-primary)' : '#ffffff',
            pointerEvents: 'auto',
            animation: 'toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '999px',
              background: 'rgba(0, 164, 255, 0.16)',
              color: 'var(--canvas-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Check size={14} weight="bold" />
          </div>
          <div style={{ display: 'grid', gap: 2 }}>
            <span style={{ 
              fontFamily: 'var(--canvas-font-sans)', 
              fontSize: 13, 
              fontWeight: 700, 
              color: activeTheme === 'light' ? 'var(--canvas-text-primary)' : '#ffffff' 
            }}>
              {startMode === 'onchain' 
                ? 'On-Chain Strategies Started!' 
                : startMode === 'realtime-test'
                  ? 'Real-Time Test Started!'
                  : 'Historical Backtest Started!'}
            </span>
            <span style={{ 
              fontFamily: 'var(--canvas-font-sans)', 
              fontSize: 11, 
              color: activeTheme === 'light' ? 'var(--canvas-text-secondary)' : 'rgba(255, 255, 255, 0.7)' 
            }}>
              {startMode === 'onchain'
                ? 'On-chain execution initialized. Flow animations active.'
                : startMode === 'realtime-test'
                  ? 'Real-time test simulation initialized. Flow animations active.'
                  : 'Historical backtest simulation initialized. Flow animations active.'}
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 3,
              background: 'var(--canvas-accent)',
              animation: 'toastProgress 4s linear forwards',
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
