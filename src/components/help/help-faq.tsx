import { CaretDown, Question } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'

type FaqItem = {
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    question: 'How do I move around the canvas?',
    answer: 'Use the Hand tool with H, or pan directly based on the active interaction mode available in the canvas.',
  },
  {
    question: 'How do I add a comment?',
    answer: 'Switch to the Comment tool with M, then click on the canvas to place a new comment thread.',
  },
  {
    question: 'How do I change the AI model?',
    answer: 'Open the AI selector in the bottom-left panel, choose a provider first, then select one or more models.',
  },
  {
    question: 'Can I select multiple models?',
    answer: 'Yes. In the model step of the AI selector, clicking a model toggles it on or off without closing the dropdown.',
  },
  {
    question: 'How do I switch themes?',
    answer: 'Use the theme button in the dock or press T to toggle between light and dark mode.',
  },
  {
    question: 'Where can I see shortcuts?',
    answer: 'Open the keyboard button in the bottom-right area to browse and search all supported keybindings.',
  },
  {
    question: 'How do I save my current setup?',
    answer: 'Use the Save as Draft option in the top-left menu (under the three dots) to store the current strategy state before starting execution.',
  },
  {
    question: 'Can I invite other collaborators?',
    answer: 'Yes. Open the Collaborate panel from the top-right controls, enter an email, and assign the desired permission level.',
  },
  {
    question: 'Why is my API key hidden?',
    answer: 'The API key field is masked by default when not focused, so sensitive values stay less exposed on the canvas interface.',
  },
]

export default function HelpFaq() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return faqItems
    }

    return faqItems.filter(
      (item) => item.question.toLowerCase().includes(normalizedQuery) || item.answer.toLowerCase().includes(normalizedQuery),
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
    <div ref={containerRef} style={{ position: 'fixed', right: 72, bottom: 18, pointerEvents: 'auto' }}>
      <button
        type="button"
        aria-label="FAQ"
        title="FAQ"
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
        <Question size={18} weight="duotone" />
      </button>

      {isOpen ? (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 'calc(100% + 12px)',
            width: 320,
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
          <div style={{ color: 'var(--canvas-text-primary)', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>FAQ</div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions..."
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

        <div style={{ maxHeight: 320, overflowY: 'auto', padding: 8, display: 'grid', gap: 6 }}>
          {filteredItems.length === 0 ? (
            <div
              style={{
                padding: '12px 10px',
                color: 'var(--canvas-text-tertiary)',
                fontSize: 12,
              }}
            >
              No FAQ found.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isExpanded = expandedItems[item.question] ?? false

              return (
                <div
                  key={item.question}
                  style={{
                    borderRadius: 12,
                    background: 'var(--canvas-surface-muted)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedItems((current) => ({
                        ...current,
                        [item.question]: !isExpanded,
                      }))
                    }}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--canvas-text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '12px 12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'var(--canvas-font-sans)',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ minWidth: 0 }}>{item.question}</span>
                    <CaretDown
                      size={14}
                      weight="bold"
                      style={{
                        flex: 'none',
                        transform: `rotate(${isExpanded ? '180deg' : '0deg'})`,
                        transition: 'transform 160ms ease',
                      }}
                    />
                  </button>

                  {isExpanded ? (
                    <div
                      style={{
                        padding: '0 12px 12px',
                        color: 'var(--canvas-text-secondary)',
                        fontSize: 12,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.answer}
                    </div>
                  ) : null}
                </div>
              )
            })
          )}
        </div>
        </div>
      ) : null}
    </div>
  )
}
