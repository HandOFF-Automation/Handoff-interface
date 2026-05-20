import { CaretDown, Check, Copy, FloppyDisk, UsersThree } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'
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
  const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isWalletAddressCopied, setIsWalletAddressCopied] = useState(false)
  const walletAddress = '0x8F21...A91C'
  const walletAddressFull = '0x8F21D9A4C6B18E72A91C'
  const saveMenuGroups = useMemo(
    () => [
      {
        items: [{ label: 'Save as Draft', value: 'save-draft' }],
      },
      {
        items: [{ label: 'Start Strategies', value: 'start-strategies' }],
      },
    ],
    [],
  )

  const handleSaveMenuClick = (_item: DropdownMenuItem) => {
    setIsSaveMenuOpen(false)
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

  useEffect(() => {
    if (!isCollaborateMenuOpen && !isPermissionMenuOpen && !isSaveMenuOpen && !isProfileMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsCollaborateMenuOpen(false)
      setIsPermissionMenuOpen(false)
      setIsSaveMenuOpen(false)
      setIsProfileMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isCollaborateMenuOpen, isPermissionMenuOpen, isSaveMenuOpen, isProfileMenuOpen])

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
          aria-label="Save as Draft"
          title="Save as Draft"
          onClick={() => setIsSaveMenuOpen((current) => !current)}
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
          <FloppyDisk size={16} weight="duotone" />
          <span style={{ fontFamily: 'var(--canvas-font-sans)', fontSize: 12, fontWeight: 700 }}>Save as Draft</span>
          <CaretDown
            size={12}
            weight="regular"
            style={{
              transform: `rotate(${isSaveMenuOpen ? '180deg' : '0deg'})`,
              transition: 'transform 160ms ease',
            }}
          />
        </button>

        {isSaveMenuOpen ? (
          <DropdownMenu
            open={isSaveMenuOpen}
            groups={saveMenuGroups}
            onItemClick={handleSaveMenuClick}
            style={{ left: 'auto', right: 0, top: 'calc(100% + 12px)', bottom: 'auto', transform: 'translateY(0)', minWidth: 220 }}
          />
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
    </div>
  )
}
