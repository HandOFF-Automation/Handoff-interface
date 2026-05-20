import { ArrowsSplit, CaretDown, Check, Path, Robot } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

type AIProvider = 'openai' | 'anthropic' | 'groq' | 'gemini' | 'deepseek' | 'mistral' | 'xai'
type AIProviderMode = 'with-fallback' | 'no-fallback'

const providerModels: Record<AIProvider, string[]> = {
  openai: ['gpt-4.1', 'gpt-4.1-mini', 'gpt-4o', 'gpt-4o-mini', 'gpt-alpha', 'gpt-beta', 'gpt-charlie', 'gpt-delta', 'gpt-epsilon'],
  anthropic: ['claude-3-5-sonnet', 'claude-3-7-sonnet', 'claude-sonnet-4', 'claude-lime', 'claude-amber', 'claude-river', 'claude-cloud', 'claude-spark'],
  groq: ['llama-3.3-70b', 'mixtral-8x7b', 'groq-fast-1', 'groq-fast-2', 'groq-fast-3'],
  gemini: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-air', 'gemini-wave', 'gemini-core'],
  deepseek: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-lite', 'deepseek-r1-mini', 'deepseek-r1-max'],
  mistral: ['mistral-large', 'mistral-medium', 'mistral-small', 'mistral-nova', 'mistral-edge'],
  xai: ['grok-2', 'grok-2-mini', 'grok-fast', 'grok-spark', 'grok-next'],
}

const providerOptions: Array<{ id: AIProvider; label: string }> = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'groq', label: 'Groq' },
  { id: 'gemini', label: 'Google Gemini' },
  { id: 'deepseek', label: 'DeepSeek Provider Long Name' },
  { id: 'mistral', label: 'Mistral AI' },
  { id: 'xai', label: 'xAI Experimental Provider' },
]

const dropdownScrollableGroupStyle: React.CSSProperties = {
  display: 'grid',
  gap: 5,
  minHeight: 226,
  maxHeight: 226,
  overflowY: 'auto',
}

const defaultSelectedModelsByProvider: Record<AIProvider, string[]> = {
  openai: [providerModels.openai[0]],
  anthropic: [providerModels.anthropic[0]],
  groq: [providerModels.groq[0]],
  gemini: [providerModels.gemini[0]],
  deepseek: [providerModels.deepseek[0]],
  mistral: [providerModels.mistral[0]],
  xai: [providerModels.xai[0]],
}

const defaultKeysByProvider: Record<AIProvider, string> = {
  openai: '',
  anthropic: '',
  groq: '',
  gemini: '',
  deepseek: '',
  mistral: '',
  xai: '',
}

function maskApiKey(value: string) {
  if (!value) {
    return ''
  }

  if (value.length <= 8) {
    return '•'.repeat(value.length)
  }

  return `${value.slice(0, 4)}${'•'.repeat(Math.max(0, value.length - 8))}${value.slice(-4)}`
}

export default function AIProviderPanel() {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [activeProvider, setActiveProvider] = useState<AIProvider>('openai')
  const [activeMode, setActiveMode] = useState<AIProviderMode>('no-fallback')
  const [isApiPanelEnabled, setIsApiPanelEnabled] = useState(false)
  const [isApiPanelExpanded, setIsApiPanelExpanded] = useState(false)
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false)
  const [isSelectorMenuOpen, setIsSelectorMenuOpen] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [selectorStep, setSelectorStep] = useState<'providers' | 'models'>('providers')
  const [pendingProvider, setPendingProvider] = useState<AIProvider>('openai')
  const [providerQuery, setProviderQuery] = useState('')
  const [modelQuery, setModelQuery] = useState('')
  const [selectedModelsByProvider, setSelectedModelsByProvider] = useState<Record<AIProvider, string[]>>(defaultSelectedModelsByProvider)
  const [keysByProvider, setKeysByProvider] = useState<Record<AIProvider, string>>(defaultKeysByProvider)

  const activeProviderLabel = providerOptions.find((provider) => provider.id === activeProvider)?.label ?? 'Provider'
  const activeValue = keysByProvider[activeProvider]
  const activeModels = selectedModelsByProvider[activeProvider]
  const pendingProviderLabel = providerOptions.find((provider) => provider.id === pendingProvider)?.label ?? 'Provider'
  const filteredProviders = providerOptions.filter((provider) => provider.label.toLowerCase().includes(providerQuery.trim().toLowerCase()))
  const filteredModels = providerModels[pendingProvider].filter((model) => model.toLowerCase().includes(modelQuery.trim().toLowerCase()))
  const activeModelLabel =
    activeModels.length === 0 ? 'No model' : activeModels.length === 1 ? activeModels[0] : `${activeModels.length} models`

  const modeMenuGroups = useMemo(
    () => [
      {
        items: [
          {
            label: 'With Fallback',
            value: 'with-fallback',
            active: activeMode === 'with-fallback',
            icon: <ArrowsSplit size={14} weight="duotone" />,
          },
          {
            label: 'No Fallback',
            value: 'no-fallback',
            active: activeMode === 'no-fallback',
            icon: <Path size={14} weight="duotone" />,
          },
        ],
      },
    ],
    [activeMode],
  )

  const providerMenuGroups = useMemo(
    () => [
      {
        items: filteredProviders.map((provider) => ({
          label: provider.label,
          labelStyle: {
            minWidth: 0,
            maxWidth: 120,
          },
          value: provider.id,
          active: provider.id === pendingProvider,
          icon: <Robot size={14} weight="duotone" />,
          trailingIcon: provider.id === pendingProvider ? <Check size={14} weight="bold" /> : undefined,
        })),
        className: 'dropdownMenuScrollableGroup',
        style: dropdownScrollableGroupStyle,
      },
    ],
    [filteredProviders, pendingProvider],
  )

  const modelMenuGroups = useMemo(
    () => [
      {
        items: filteredModels.map((model) => ({
          label: model,
          value: model,
          active: selectedModelsByProvider[pendingProvider].includes(model),
          trailingIcon: selectedModelsByProvider[pendingProvider].includes(model) ? <Check size={14} weight="bold" /> : undefined,
        })),
        className: 'dropdownMenuScrollableGroup',
        style: dropdownScrollableGroupStyle,
      },
    ],
    [filteredModels, pendingProvider, selectedModelsByProvider],
  )

  const handleModeMenuClick = (item: DropdownMenuItem) => {
    const nextMode = item.value as AIProviderMode | undefined

    if (nextMode === 'with-fallback' || nextMode === 'no-fallback') {
      setActiveMode(nextMode)
    }

    setIsModeMenuOpen(false)
  }

  const handleSelectorProviderClick = (item: DropdownMenuItem) => {
    const nextProvider = item.value as AIProvider | undefined

    if (nextProvider && providerOptions.some((provider) => provider.id === nextProvider)) {
      setPendingProvider(nextProvider)
      setModelQuery('')
      setSelectorStep('models')
    }
  }

  const handleSelectorModelClick = (item: DropdownMenuItem) => {
    const nextModel = item.value

    if (nextModel) {
      setSelectedModelsByProvider((current) => {
        const currentModels = current[pendingProvider]
        const nextModels = currentModels.includes(nextModel)
          ? currentModels.filter((model) => model !== nextModel)
          : [...currentModels, nextModel]

        return {
          ...current,
          [pendingProvider]: nextModels,
        }
      })
      setActiveProvider(pendingProvider)
    }
  }

  const collapseToMinimal = () => {
    setIsApiPanelExpanded(false)
    setIsModeMenuOpen(false)
    setIsSelectorMenuOpen(false)
    setSelectorStep('providers')
    setProviderQuery('')
    setModelQuery('')
  }

  useEffect(() => {
    if (!isApiPanelEnabled) {
      setIsApiPanelExpanded(false)
      setIsModeMenuOpen(false)
      setIsSelectorMenuOpen(false)
      setSelectorStep('providers')
      setProviderQuery('')
      setModelQuery('')
    }
  }, [isApiPanelEnabled])

  useEffect(() => {
    if (!isApiPanelEnabled || !isApiPanelExpanded) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (panelRef.current?.contains(event.target as Node)) {
        return
      }

      collapseToMinimal()
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isApiPanelEnabled, isApiPanelExpanded])

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        left: 18,
        bottom: 18,
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 42,
          paddingLeft: isApiPanelEnabled && !isApiPanelExpanded ? 0 : 8,
          paddingRight: isApiPanelEnabled && !isApiPanelExpanded ? 0 : 8,
          width: isApiPanelEnabled && !isApiPanelExpanded ? 42 : 'auto',
          minWidth: isApiPanelEnabled && !isApiPanelExpanded ? 42 : 0,
          borderRadius: 999,
          border: '1px solid var(--canvas-dock-border)',
          background: 'var(--canvas-surface-strong)',
          boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
          boxSizing: 'border-box',
          justifyContent: isApiPanelEnabled && !isApiPanelExpanded ? 'center' : 'flex-start',
        }}
      >
        {!isApiPanelEnabled ? (
          <div
            style={{
              width: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <span
              style={{
                color: 'var(--canvas-text-primary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              API Key
            </span>

            <button
              type="button"
              aria-label="Enable API panel"
              title="Enable API panel"
              onClick={() => {
                setIsApiPanelEnabled(true)
                setIsApiPanelExpanded(true)
              }}
              style={{
                width: 40,
                height: 22,
                border: 'none',
                borderRadius: 999,
                background: 'var(--canvas-surface-muted)',
                padding: 2,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '999px',
                  background: 'var(--canvas-text-tertiary)',
                  display: 'block',
                }}
              />
            </button>
          </div>
        ) : !isApiPanelExpanded ? (
          <button
            type="button"
            aria-label="Open API panel"
            title="Open API panel"
            onClick={() => setIsApiPanelExpanded(true)}
            style={{
              width: 42,
              minWidth: 42,
              maxWidth: 42,
              height: 42,
              minHeight: 42,
              maxHeight: 42,
              padding: 0,
              border: '1px solid var(--canvas-dock-border)',
              borderRadius: '999px',
              background: 'transparent',
              flex: 'none',
              aspectRatio: '1 / 1',
              boxSizing: 'border-box',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Robot size={18} weight="duotone" color="var(--canvas-text-primary)" />
          </button>
        ) : (
          <>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                aria-label="Provider mode"
                title="Provider mode"
                onClick={() => {
                  setIsSelectorMenuOpen(false)
                  setSelectorStep('providers')
                  setProviderQuery('')
                  setModelQuery('')
                  setIsModeMenuOpen((current) => !current)
                }}
                style={{
                  width: 30,
                  height: 30,
                  padding: 0,
                  border: 'none',
                  borderRadius: 999,
                  background: 'var(--canvas-surface-muted)',
                  color: 'var(--canvas-text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {activeMode === 'with-fallback' ? <ArrowsSplit size={14} weight="duotone" /> : <Path size={14} weight="duotone" />}
              </button>

              {isModeMenuOpen ? (
                <DropdownMenu
                  open={isModeMenuOpen}
                  groups={modeMenuGroups}
                  onItemClick={handleModeMenuClick}
                  style={{ left: 0, top: 'auto', bottom: 'calc(100% + 16px)', transform: 'translateX(0) translateY(0)', minWidth: 180 }}
                />
              ) : null}
            </div>

            <div style={{ position: 'relative' }}>
              <button
                type="button"
                aria-label="AI Provider"
                title="AI Provider"
                onClick={() => {
                  setIsModeMenuOpen(false)
                  setPendingProvider(activeProvider)
                  setProviderQuery('')
                  setModelQuery('')
                  setSelectorStep('providers')
                  setIsSelectorMenuOpen((current) => !current)
                }}
                style={{
                  height: 30,
                  paddingLeft: 10,
                  paddingRight: 10,
                  border: 'none',
                  borderRadius: 999,
                  background: 'var(--canvas-surface-muted)',
                  color: 'var(--canvas-text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                <Robot size={14} weight="duotone" />
                <span
                  style={{
                    maxWidth: 150,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {activeModelLabel}
                </span>
                <CaretDown
                  size={11}
                  weight="regular"
                  style={{
                    transform: `rotate(${isSelectorMenuOpen ? '180deg' : '0deg'})`,
                    transition: 'transform 160ms ease',
                  }}
                />
              </button>

              {isSelectorMenuOpen ? (
                <DropdownMenu
                  open={isSelectorMenuOpen}
                  groups={selectorStep === 'providers' ? providerMenuGroups : modelMenuGroups}
                  onItemClick={selectorStep === 'providers' ? handleSelectorProviderClick : handleSelectorModelClick}
                  header={
                    <div style={{ padding: 6, paddingBottom: 4 }}>
                      {selectorStep === 'providers' ? (
                        <>
                          <div
                            style={{
                              color: 'var(--canvas-text-primary)',
                              fontFamily: 'var(--canvas-font-sans)',
                              fontSize: 12,
                              fontWeight: 700,
                              marginBottom: 8,
                              paddingLeft: 6,
                            }}
                          >
                            Provider
                          </div>
                          <input
                            value={providerQuery}
                            onChange={(event) => setProviderQuery(event.target.value)}
                            placeholder="Search provider"
                            onPointerDown={(event) => event.stopPropagation()}
                            style={{
                              width: '100%',
                              height: 34,
                              paddingLeft: 12,
                              paddingRight: 12,
                              borderRadius: 10,
                              border: '1px solid var(--canvas-panel-divider)',
                              outline: 'none',
                              background: 'var(--canvas-surface-muted)',
                              color: 'var(--canvas-text-primary)',
                              fontFamily: 'var(--canvas-font-sans)',
                              fontSize: 12,
                              boxSizing: 'border-box',
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 8,
                              paddingLeft: 6,
                              paddingRight: 6,
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setProviderQuery('')
                                setModelQuery('')
                                setSelectorStep('providers')
                              }}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--canvas-text-secondary)',
                                cursor: 'pointer',
                                padding: 0,
                                fontFamily: 'var(--canvas-font-sans)',
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              Back
                            </button>
                            <div
                              style={{
                                color: 'var(--canvas-text-primary)',
                                fontFamily: 'var(--canvas-font-sans)',
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              {pendingProviderLabel}
                            </div>
                          </div>
                          <input
                            value={modelQuery}
                            onChange={(event) => setModelQuery(event.target.value)}
                            placeholder="Search model"
                            onPointerDown={(event) => event.stopPropagation()}
                            style={{
                              width: '100%',
                              height: 34,
                              paddingLeft: 12,
                              paddingRight: 12,
                              borderRadius: 10,
                              border: '1px solid var(--canvas-panel-divider)',
                              outline: 'none',
                              background: 'var(--canvas-surface-muted)',
                              color: 'var(--canvas-text-primary)',
                              fontFamily: 'var(--canvas-font-sans)',
                              fontSize: 12,
                              boxSizing: 'border-box',
                            }}
                          />
                        </>
                      )}
                    </div>
                  }
                  style={{ left: 0, top: 'auto', bottom: 'calc(100% + 16px)', transform: 'translateX(0) translateY(0)', minWidth: 220, maxWidth: 220 }}
                />
              ) : null}
            </div>

            <input
              value={isInputFocused ? activeValue : maskApiKey(activeValue)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onChange={(event) => {
                const nextValue = event.target.value
                setKeysByProvider((current) => ({
                  ...current,
                  [activeProvider]: nextValue,
                }))
              }}
              placeholder="API key"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              style={{
                width: 220,
                height: 30,
                border: 'none',
                outline: 'none',
                borderRadius: 999,
                paddingLeft: 12,
                paddingRight: 12,
                background: 'var(--canvas-surface-muted)',
                color: 'var(--canvas-text-primary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 12,
              }}
            />

            <button
              type="button"
              aria-label="Save API key"
              title="Save API key"
              onClick={collapseToMinimal}
              style={{
                height: 30,
                paddingLeft: 12,
                paddingRight: 12,
                border: 'none',
                borderRadius: 999,
                background: 'var(--canvas-accent)',
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Save
            </button>

            <button
              type="button"
              aria-label="Disable API panel"
              title="Disable API panel"
              onClick={() => {
                setIsApiPanelExpanded(false)
                setIsApiPanelEnabled(false)
              }}
              style={{
                width: 40,
                height: 22,
                border: 'none',
                borderRadius: 999,
                background: 'var(--canvas-accent)',
                padding: 2,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '999px',
                  background: 'var(--canvas-text-on-accent)',
                  display: 'block',
                }}
              />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
