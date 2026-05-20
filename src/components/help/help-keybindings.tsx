import { Keyboard } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { canvasKeybindingItems } from '../../config/keybinding/canvas-keybindings'

type KeybindingItem = {
  label: string
  shortcut: string
}

const keybindingItems: KeybindingItem[] = canvasKeybindingItems

export default function HelpKeybindings() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return keybindingItems
    }

    return keybindingItems.filter(
      (item) =>
        item.label.toLowerCase().includes(normalizedQuery) || item.shortcut.toLowerCase().includes(normalizedQuery),
    )
  }, [query])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsOpen(false)
      setQuery('')
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} style={{ position: 'fixed', right: 18, bottom: 18, pointerEvents: 'auto' }}>
      <button
        type="button"
        aria-label="Keybindings"
        title="Keybindings"
        onClick={() => setIsOpen((current) => !current)}
        style={{
          width: 42,
          height: 42,
          padding: 0,
          borderRadius: '999px',
          border: '1px solid var(--canvas-dock-border)',
          background: 'var(--canvas-surface-strong)',
          boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
          color: 'var(--canvas-text-primary)',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
        }}
      >
        <Keyboard size={18} weight="duotone" />
      </button>

      {isOpen ? (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 'calc(100% + 12px)',
            width: 280,
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
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Keybindings</div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search keybindings..."
            style={{
              width: '100%',
              height: 36,
              paddingLeft: 12,
              paddingRight: 12,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              outline: 'none',
              background: 'var(--canvas-surface-muted)',
              color: 'var(--canvas-text-primary)',
              fontFamily: 'var(--canvas-font-sans)',
              fontSize: 12,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ maxHeight: 280, overflowY: 'auto', padding: 8, display: 'grid', gap: 4 }}>
          {filteredItems.length === 0 ? (
            <div
              style={{
                padding: '12px 10px',
                color: 'var(--canvas-text-tertiary)',
                fontSize: 12,
              }}
            >
              No keybindings found.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={`${item.label}-${item.shortcut}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'var(--canvas-surface-muted)',
                }}
              >
                <span style={{ color: 'var(--canvas-text-primary)', fontSize: 12 }}>{item.label}</span>
                <span style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11, whiteSpace: 'nowrap' }}>{item.shortcut}</span>
              </div>
            ))
          )}
        </div>
        </div>
      ) : null}
    </div>
  )
}
