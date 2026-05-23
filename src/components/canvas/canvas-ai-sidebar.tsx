import { PaperPlaneRight, Sparkle } from '@phosphor-icons/react'
import { SearchIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from '../ai-elements/chain-of-thought'
import {
  Context,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from '../ai-elements/context'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '../ai-elements/conversation'
import { Message, MessageContent, MessageResponse } from '../ai-elements/message'
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '../ai-elements/prompt-input'
import { Suggestion, Suggestions } from '../ai-elements/suggestion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'

type CanvasAiSidebarProps = {
  active: boolean
  onClose: () => void
}

type ChatEntry = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const starterSuggestions = ['Build me a DCA strategy', 'Explain this graph', 'Find missing configuration']
const AI_SIDEBAR_MIN_WIDTH = 420
const AI_SIDEBAR_MAX_WIDTH = 640
const AI_SIDEBAR_DEFAULT_WIDTH = 460

export default function CanvasAiSidebar({ active, onClose }: CanvasAiSidebarProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatEntry[]>([])
  const [status, setStatus] = useState<'ready' | 'streaming'>('ready')
  const [sidebarWidth, setSidebarWidth] = useState(AI_SIDEBAR_DEFAULT_WIDTH)
  const [model, setModel] = useState('gpt-4o-mini')
  const resizeStateRef = useRef<{ startX: number; startWidth: number } | null>(null)

  const hasMessages = messages.length > 0
  const visibleMessages = useMemo(
    () => (status === 'streaming' ? [...messages, { id: 'assistant-streaming', role: 'assistant' as const, text: '' }] : messages),
    [messages, status],
  )
  const usage = useMemo(
    () => ({
      inputTokens: 2480,
      outputTokens: 684,
      totalTokens: 3164,
      reasoningTokens: 312,
    }),
    [],
  )

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const resizeState = resizeStateRef.current

      if (!resizeState) {
        return
      }

      const delta = resizeState.startX - event.clientX
      const nextWidth = Math.min(
        AI_SIDEBAR_MAX_WIDTH,
        Math.max(AI_SIDEBAR_MIN_WIDTH, resizeState.startWidth + delta),
      )

      setSidebarWidth(nextWidth)
    }

    const handlePointerUp = () => {
      resizeStateRef.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const handleSendText = (text: string) => {
    const trimmed = text.trim()

    if (!trimmed) {
      return
    }

    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: 'user', text: trimmed }])
    setInput('')
    setStatus('streaming')

    window.setTimeout(() => {
      const reply = trimmed.toLowerCase() === 'hai'
        ? 'Hai. Aku bisa bantu rangkai strategy, jelasin graph, dan cari konfigurasi yang masih kurang.'
        : `Received: ${trimmed}`

      setMessages((current) => [...current, { id: `assistant-${Date.now()}`, role: 'assistant', text: reply }])
      setStatus('ready')
    }, 520)
  }

  return (
    <aside
      aria-hidden={!active}
      style={{
        position: 'absolute',
        top: 72,
        right: 18,
        bottom: 72,
        width: sidebarWidth,
        minHeight: 0,
        borderRadius: 24,
        border: '1px solid var(--canvas-panel-divider)',
        background: 'color-mix(in srgb, var(--canvas-surface-strong) 96%, transparent)',
        boxShadow: '0 16px 40px var(--canvas-shadow-soft)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: active ? 'auto' : 'none',
        opacity: active ? 1 : 0,
        transform: active ? 'translateX(0)' : 'translateX(16px)',
        transition: 'opacity 180ms ease, transform 180ms ease',
        zIndex: 3,
      }}
    >
      <button
        type="button"
        aria-label="Resize AI sidebar"
        onPointerDown={(event) => {
          resizeStateRef.current = {
            startX: event.clientX,
            startWidth: sidebarWidth,
          }
          document.body.style.cursor = 'ew-resize'
          document.body.style.userSelect = 'none'
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: -6,
          bottom: 0,
          width: 12,
          padding: 0,
          margin: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'ew-resize',
          zIndex: 2,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: 5,
            transform: 'translateY(-50%)',
            width: 2,
            height: 56,
            borderRadius: 999,
            background: 'var(--canvas-panel-divider)',
          }}
        />
      </button>

      <CanvasNodeSidebarHeader
        title="AI Assistant"
        description="Strategy-building copilot for graph composition and debugging."
        helpTitle="AI Assistant"
        helpBody="This panel can later turn natural-language intent into graph suggestions, explain the current canvas, and surface missing configuration."
        closeLabel="Close AI sidebar"
        onClose={onClose}
      />

      <div style={{ flex: 1, minHeight: 0, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', borderRadius: 18, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)' }}>
          <Conversation className="h-full">
            <ConversationContent className="gap-4 p-4">
              {!hasMessages ? (
                <ConversationEmptyState icon={<Sparkle className="size-10" />} title="Start with a strategy goal" description="Describe what you want to build and the assistant will help shape the graph.">
                  <div className="flex w-full flex-col gap-4 rounded-2xl border border-border/70 p-4 text-left">
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Suggestions</div>
                      <Suggestions>
                        {starterSuggestions.map((suggestion) => (
                          <Suggestion key={suggestion} suggestion={suggestion} onClick={handleSendText} />
                        ))}
                      </Suggestions>
                    </div>
                  </div>
                </ConversationEmptyState>
              ) : (
                visibleMessages.map((message) => (
                  <div key={message.id} className="space-y-3 rounded-2xl border border-border/60 p-3">
                    {message.role === 'user' ? (
                      <Message from={message.role}>
                        <MessageContent>
                          <MessageResponse>{message.text}</MessageResponse>
                        </MessageContent>
                      </Message>
                    ) : (
                      <>
                        <ChainOfThought defaultOpen className="rounded-xl border border-border/60 p-3">
                          <ChainOfThoughtHeader>Reasoning</ChainOfThoughtHeader>
                          <ChainOfThoughtContent>
                            <ChainOfThoughtStep icon={SearchIcon} label="Inspecting graph intent" description="Mapping your prompt into the next response." status="complete">
                              <ChainOfThoughtSearchResults>
                                <ChainOfThoughtSearchResult>goal</ChainOfThoughtSearchResult>
                                <ChainOfThoughtSearchResult>graph state</ChainOfThoughtSearchResult>
                                <ChainOfThoughtSearchResult>next action</ChainOfThoughtSearchResult>
                              </ChainOfThoughtSearchResults>
                            </ChainOfThoughtStep>
                            <ChainOfThoughtStep label="Drafting response" description="Preparing the final answer for the current canvas context." status={message.text ? 'complete' : 'active'}>
                            </ChainOfThoughtStep>
                          </ChainOfThoughtContent>
                        </ChainOfThought>

                        {message.text ? (
                          <Message from={message.role}>
                            <MessageContent className="w-full max-w-none">
                              <MessageResponse>{message.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                        ) : null}
                      </>
                    )}
                  </div>
                ))
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>

        <div style={{ flex: 'none', borderRadius: 18, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: 10 }}>
        <PromptInput
          className="w-full"
          onSubmit={(message) => {
            if (message.text) {
              handleSendText(message.text)
            }
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea className="min-h-[72px] rounded-xl px-3 py-2 text-[14px] leading-6" value={input} placeholder="Message AI Assistant..." onChange={(event) => setInput(event.currentTarget.value)} />
          </PromptInputBody>
          <PromptInputFooter className="items-center gap-2 pt-2">
            <PromptInputTools>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="h-9 min-w-[148px] rounded-full border-border/70 bg-transparent text-[13px] text-foreground">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4o mini</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                </SelectContent>
              </Select>
            </PromptInputTools>
            <div className="flex items-center gap-2">
              <Context maxTokens={32000} usedTokens={3164} usage={usage} modelId={model}>
                <ContextTrigger className="h-9 rounded-full border border-border/70 bg-transparent px-2.5 text-muted-foreground hover:bg-transparent hover:text-foreground aria-expanded:bg-transparent" size="sm" variant="ghost" />
                <ContextContent>
                  <ContextContentHeader />
                  <ContextContentBody className="space-y-2 text-xs">
                    <ContextInputUsage />
                    <ContextOutputUsage />
                    <ContextReasoningUsage />
                  </ContextContentBody>
                  <ContextContentFooter />
                </ContextContent>
              </Context>
              <PromptInputSubmit className="size-9 shrink-0 rounded-full" disabled={!input.trim() || status === 'streaming'} status={status === 'streaming' ? 'streaming' : 'ready'}>
              <PaperPlaneRight size={14} />
              </PromptInputSubmit>
            </div>
          </PromptInputFooter>
        </PromptInput>
        </div>
      </div>
    </aside>
  )
}
