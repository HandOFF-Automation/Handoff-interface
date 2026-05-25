import { DotsThree, Check } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import darkBrandImage from '../../assets/icon with text/icon-text-no-bg.png'
import lightBrandImage from '../../assets/icon with text/icon-text-no-bg-dark-txt.png'
import { useCanvasTheme } from '../../state/theme-store'
import { navigateTo } from '../../state/location-store'

export default function BrandBadge() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const activeTheme = useCanvasTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isAutosaveActive, setIsAutosaveActive] = useState(true)

  const groupedItems = useMemo(
    () => [
      {
        key: 'group-1',
        items: ['Go to Dashboard', 'Save as Draft', 'Autosave'],
      },
      {
        key: 'group-2',
        items: ['Help', 'Your Account'],
      },
    ],
    [],
  )

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return groupedItems
    }

    return groupedItems
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.toLowerCase().includes(normalizedQuery)),
      }))
      .filter((group) => group.items.length > 0)
  }, [groupedItems, query])

  const handleItemClick = (item: string) => {
    if (item === 'Go to Dashboard') {
      navigateTo('/dashboard')
      setIsMenuOpen(false)
      setQuery('')
    } else if (item === 'Your Account') {
      navigateTo('/dashboard/settings')
      setIsMenuOpen(false)
      setQuery('')
    } else if (item === 'Autosave') {
      setIsAutosaveActive((current) => !current)
    } else {
      setIsMenuOpen(false)
      setQuery('')
    }
  }

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsMenuOpen(false)
      setQuery('')
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMenuOpen])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 18,
        left: 18,
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <button
        type="button"
        aria-label="Handoff"
        title="Handoff"
        style={{
          height: 42,
          paddingLeft: 16,
          paddingRight: 80,
          borderRadius: 999,
          border: '1px solid var(--canvas-dock-border)',
          background: 'var(--canvas-surface-strong)',
          boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <img
          src={activeTheme === 'light' ? lightBrandImage : darkBrandImage}
          alt="Handoff"
          style={{
            display: 'block',
            height: 28,
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </button>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          aria-label="Menu"
          title="Menu"
          onClick={() => setIsMenuOpen((current) => !current)}
          style={{
            height: 42,
            width: 42,
            padding: 0,
            borderRadius: '999px',
            border: '1px solid var(--canvas-dock-border)',
            background: 'var(--canvas-surface-strong)',
            boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <DotsThree
            size={20}
            weight="bold"
            style={{
              color: 'var(--canvas-text-primary)',
              flex: 'none',
            }}
          />
        </button>

        {isMenuOpen ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 'calc(100% + 12px)',
              width: 260,
              borderRadius: 18,
              background: 'var(--canvas-surface)',
              border: '1px solid var(--canvas-panel-border)',
              boxShadow: '0 18px 34px var(--canvas-dock-shadow)',
              overflow: 'hidden',
              opacity: 1,
              pointerEvents: 'auto',
              transform: 'translateY(0)',
              transition: 'opacity 140ms ease, transform 140ms ease',
              backdropFilter: 'blur(18px)',
            }}
          >
          <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--canvas-panel-divider)' }}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              style={{
                width: '100%',
                height: 36,
                paddingLeft: 12,
                paddingRight: 12,
                borderRadius: 12,
                border: '1px solid var(--canvas-panel-divider)',
                outline: 'none',
                background: 'var(--canvas-surface-muted)',
                color: 'var(--canvas-text-primary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 12,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ padding: 8, display: 'grid', gap: 8 }}>
            {filteredGroups.map((group, groupIndex) => (
              <div key={group.key} style={{ display: 'grid', gap: 4 }}>
                {group.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="brandMenuItem"
                    onClick={() => handleItemClick(item)}
                    style={{
                      width: '100%',
                      border: 'none',
                      borderRadius: 12,
                      background: 'transparent',
                      color: 'var(--canvas-text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      fontFamily: 'var(--canvas-font-sans)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    <span>{item}</span>
                    {item === 'Autosave' && isAutosaveActive ? (
                      <Check
                        size={14}
                        weight="bold"
                        style={{
                          color: 'inherit',
                          flex: 'none',
                        }}
                      />
                    ) : null}
                  </button>
                ))}

                {groupIndex < filteredGroups.length - 1 ? (
                  <div style={{ height: 1, margin: '4px 6px', background: 'var(--canvas-panel-divider)' }} />
                ) : null}
              </div>
            ))}
          </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
