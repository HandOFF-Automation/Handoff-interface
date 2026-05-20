import CommentBubble from './comment-bubble'
import CommentThreadPanel from './comment-thread-panel'
import DropdownMenu, { type DropdownMenuGroup, type DropdownMenuItem } from '../dropdown/dropdown-menu'
import type { CanvasView, CommentThread } from './comment-types'
import { worldToScreenPosition } from './comment-utils'
import type { CanvasTool } from '../../state/canvas-tool-store'

type CommentThreadLayerProps = {
  activeTool: CanvasTool
  avatarSrc: string
  drafts: Record<string, string>
  dummyResponderAvatar: string
  dummyResponderName: string
  hoveredThreadId: string | null
  pinnedThreadId: string | null
  contextMenuPosition: { x: number; y: number } | null
  contextMenuThreadId: string | null
  threads: CommentThread[]
  view: CanvasView
  onContextMenuDelete: (threadId: string) => void
  onContextMenuOpen: (threadId: string, x: number, y: number) => void
  onContextMenuClose: () => void
  onDraftChange: (threadId: string, value: string) => void
  onHoverThread: (threadId: string | null) => void
  onLeaveThread: (threadId: string) => void
  onPinThread: (threadId: string | null) => void
  onSendThread: (threadId: string) => void
}

export default function CommentThreadLayer({
  activeTool,
  avatarSrc,
  drafts,
  dummyResponderAvatar,
  dummyResponderName,
  hoveredThreadId,
  pinnedThreadId,
  contextMenuPosition,
  contextMenuThreadId,
  threads,
  view,
  onContextMenuDelete,
  onContextMenuOpen,
  onContextMenuClose,
  onDraftChange,
  onHoverThread,
  onLeaveThread,
  onPinThread,
  onSendThread,
}: CommentThreadLayerProps) {
  const contextMenuGroups: DropdownMenuGroup[] = [
    {
      items: [{ label: 'Delete', value: 'delete' }],
    },
  ]
  const visibleThreadId = pinnedThreadId ?? hoveredThreadId
  const visibleThread = visibleThreadId ? threads.find((thread) => thread.id === visibleThreadId) ?? null : null
  const visibleThreadPosition = visibleThread ? worldToScreenPosition(visibleThread.x, visibleThread.y, view) : null
  const renderableThreads = threads.filter((thread) => thread.messages.length > 0 || thread.id === visibleThreadId)

  const handleContextMenuItemClick = (item: DropdownMenuItem) => {
    if (item.value === 'delete' && contextMenuThreadId) {
      onContextMenuDelete(contextMenuThreadId)
    }

    onContextMenuClose()
  }

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {renderableThreads.map((thread) => {
        const position = worldToScreenPosition(thread.x, thread.y, view)
        const isPinned = pinnedThreadId === thread.id
        const isHovered = hoveredThreadId === thread.id

        return (
          <CommentBubble
            key={thread.id}
            active={isPinned || (activeTool === 'comment' && isHovered)}
            avatarSrc={avatarSrc}
            hovered={isHovered || isPinned}
            x={position.x}
            y={position.y}
            onClick={() => {
              if (isPinned || isHovered) {
                onContextMenuClose()
                onPinThread(null)
                onHoverThread(null)
                return
              }

              onContextMenuClose()
              onPinThread(thread.id)
              onHoverThread(thread.id)
            }}
            onContextMenu={(x, y) => onContextMenuOpen(thread.id, x, y)}
            onMouseEnter={() => onHoverThread(thread.id)}
            onMouseLeave={() => onLeaveThread(thread.id)}
          />
        )
      })}

      {visibleThread ? (
        <div
          onMouseEnter={() => onHoverThread(visibleThread.id)}
          onMouseLeave={() => onLeaveThread(visibleThread.id)}
          onPointerDown={(event) => {
            event.stopPropagation()
            onContextMenuClose()
          }}
          style={{
            position: 'absolute',
            left: (visibleThreadPosition?.x ?? 0) + 34,
            top: (visibleThreadPosition?.y ?? 0) - 24,
            pointerEvents: 'auto',
            zIndex: 12,
          }}
        >
          <CommentThreadPanel
            draft={drafts[visibleThread.id] ?? ''}
            dummyResponderAvatar={dummyResponderAvatar}
            dummyResponderName={dummyResponderName}
            thread={visibleThread}
            onClose={() => {
              onHoverThread(null)
              onPinThread(null)
            }}
            onDraftChange={(value) => onDraftChange(visibleThread.id, value)}
            onInteract={() => onPinThread(visibleThread.id)}
            onSend={() => onSendThread(visibleThread.id)}
          />
        </div>
      ) : null}

      {contextMenuPosition ? (
        <div
          onPointerDown={(event) => event.stopPropagation()}
          style={{
            position: 'fixed',
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            transform: 'translate(-8px, 8px)',
            pointerEvents: 'auto',
            zIndex: 30,
          }}
        >
          <DropdownMenu
            open
            groups={contextMenuGroups}
            onItemClick={handleContextMenuItemClick}
            style={{ left: 0, transform: 'translateY(0)', minWidth: 160 }}
          />
        </div>
      ) : null}
    </div>
  )
}
