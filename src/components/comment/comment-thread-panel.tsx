import { PaperPlaneTilt, X } from '@phosphor-icons/react'
import type { CommentThread } from './comment-types'
import { formatCommentTimestamp } from './comment-utils'

const CURRENT_USER_NAME = 'You'

type CommentThreadPanelProps = {
  draft: string
  dummyResponderAvatar: string
  dummyResponderName: string
  thread: CommentThread
  onDraftChange: (value: string) => void
  onClose: () => void
  onInteract: () => void
  onSend: () => void
}

export default function CommentThreadPanel({
  draft,
  dummyResponderAvatar,
  dummyResponderName,
  thread,
  onClose,
  onDraftChange,
  onInteract,
  onSend,
}: CommentThreadPanelProps) {
  return (
    <div
      onPointerDown={(event) => {
        event.stopPropagation()
        onInteract()
      }}
      onWheel={(event) => event.stopPropagation()}
      onFocusCapture={onInteract}
      style={{
        width: 400,
        minHeight: 180,
        maxHeight: 360,
        borderRadius: 18,
        background: 'var(--canvas-surface)',
        border: '1px solid var(--canvas-panel-border)',
        boxShadow: '0 18px 34px var(--canvas-dock-shadow)',
        overflow: 'hidden',
        backdropFilter: 'blur(18px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 14px 10px',
          borderBottom: '1px solid var(--canvas-panel-divider)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))',
        }}
      >
        <div style={{ display: 'grid', gap: 2 }}>
          <span style={{ color: 'var(--canvas-text-primary)', fontSize: 12, fontWeight: 700 }}>Comments</span>
          <span style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11 }}>
            {thread.messages.length === 0 ? 'New thread' : `${thread.messages.length} message${thread.messages.length > 1 ? 's' : ''}`}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: 26,
            height: 26,
            border: 'none',
            borderRadius: 8,
            display: 'grid',
            placeItems: 'center',
            background: 'var(--canvas-surface-muted)',
            color: 'var(--canvas-text-secondary)',
            cursor: 'pointer',
            flex: 'none',
          }}
        >
          <X size={14} weight="bold" />
        </button>
      </div>

      <div
        onWheel={(event) => event.stopPropagation()}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: 14,
          display: 'grid',
          gap: 12,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))',
        }}
      >
        {thread.messages.length === 0 ? (
          <div
            style={{
              color: 'var(--canvas-text-secondary)',
              fontSize: 12,
              lineHeight: 1.5,
              padding: '10px 12px',
              borderRadius: 14,
              background: 'var(--canvas-surface-muted)',
            }}
          >
            Start a new thread here.
          </div>
        ) : (
          thread.messages.map((message) => {
            const isCurrentUser = message.authorName === CURRENT_USER_NAME

            return (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '82%',
                  display: 'grid',
                  gap: 6,
                  justifyItems: isCurrentUser ? 'end' : 'start',
                }}
              >
                {!isCurrentUser ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 2 }}>
                    <img
                      src={message.authorAvatar}
                      alt={message.authorName}
                      style={{ width: 22, height: 22, borderRadius: '999px', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ display: 'grid', gap: 2 }}>
                      <span style={{ color: 'var(--canvas-text-primary)', fontSize: 12, fontWeight: 700 }}>{message.authorName}</span>
                      <span style={{ color: 'var(--canvas-text-tertiary)', fontSize: 11 }}>{formatCommentTimestamp(message.createdAt)}</span>
                    </div>
                  </div>
                ) : null}

                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: isCurrentUser ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
                    background: isCurrentUser ? 'var(--canvas-accent)' : 'var(--canvas-bubble-muted)',
                    color: '#ffffff',
                    boxShadow: isCurrentUser ? '0 10px 22px rgba(0, 164, 255, 0.18)' : 'none',
                  }}
                >
                  <div style={{ fontSize: 12, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.text}</div>

                  {isCurrentUser ? (
                    <div
                      style={{
                        marginTop: 6,
                        color: 'rgba(255,255,255,0.78)',
                        fontSize: 10,
                        textAlign: 'right',
                      }}
                    >
                      {formatCommentTimestamp(message.createdAt)}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )})
        )}

        {thread.isTyping ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '82%',
                display: 'grid',
                gap: 6,
                justifyItems: 'start',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 2 }}>
                <img
                  src={dummyResponderAvatar}
                  alt="Typing"
                  style={{ width: 22, height: 22, borderRadius: '999px', objectFit: 'cover', display: 'block' }}
                />
                <span style={{ color: 'var(--canvas-text-primary)', fontSize: 12, fontWeight: 700 }}>{dummyResponderName}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  minHeight: 38,
                  padding: '0 14px',
                  borderRadius: '18px 18px 18px 6px',
                  background: 'var(--canvas-bubble-muted)',
                }}
              >
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.78)',
                      opacity: 0.5,
                      animation: `commentTypingBounce 900ms ${index * 120}ms infinite ease-in-out`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div
        style={{
          padding: 12,
          borderTop: '1px solid var(--canvas-panel-divider)',
          background: 'var(--canvas-surface-strong)',
        }}
      >
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
          <textarea
            value={draft}
            onChange={(event) => {
              onInteract()
              onDraftChange(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                onSend()
                return
              }

              if (event.key === 'Escape') {
                event.preventDefault()
                onClose()
              }
            }}
            placeholder="Write a comment..."
            rows={1}
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--canvas-text-primary)',
              fontFamily: 'var(--canvas-font-sans)',
              fontSize: 12,
              lineHeight: 1.4,
              resize: 'none',
              overflowY: 'auto',
              maxHeight: 96,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              paddingLeft: 10,
              paddingTop: 7,
              paddingBottom: 7,
            }}
          />

          <button
            type="button"
            onClick={onSend}
            style={{
              width: 34,
              height: 34,
              border: 'none',
              borderRadius: 10,
              display: 'grid',
              placeItems: 'center',
              background: 'var(--canvas-accent)',
              color: '#ffffff',
              cursor: 'pointer',
              flex: 'none',
            }}
          >
            <PaperPlaneTilt size={16} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  )
}
