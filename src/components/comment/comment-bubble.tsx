import BubbleIcon from './bubble-icon'

type CommentBubbleProps = {
  active?: boolean
  avatarSrc: string
  hovered?: boolean
  x: number
  y: number
  onClick: () => void
  onContextMenu: (x: number, y: number) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function CommentBubble({
  active = false,
  avatarSrc,
  hovered = false,
  x,
  y,
  onClick,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
}: CommentBubbleProps) {
  return (
    <button
      type="button"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      onContextMenu={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onContextMenu(event.clientX, event.clientY)
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
    >
      <BubbleIcon active={active} avatarSrc={avatarSrc} hovered={hovered} />
    </button>
  )
}
