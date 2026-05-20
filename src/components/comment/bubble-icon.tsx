type BubbleIconProps = {
  active?: boolean
  avatarSrc: string
  hovered?: boolean
}

export default function BubbleIcon({ active = false, avatarSrc, hovered = false }: BubbleIconProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: 14,
        background: active ? 'var(--canvas-accent)' : 'var(--canvas-surface-strong)',
        border: active ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: hovered || active ? '0 10px 22px rgba(0, 0, 0, 0.45)' : '0 8px 18px rgba(0, 0, 0, 0.35)',
        display: 'grid',
        placeItems: 'center',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease, border-color 140ms ease',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: '999px',
          overflow: 'hidden',
          border: '2px solid rgba(148, 148, 148, 0.7)',
          background: '#1d1d1d',
          boxShadow: '0 6px 14px rgba(0, 0, 0, 0.32)',
          flex: 'none',
        }}
      >
        <img
          src={avatarSrc}
          alt="Comment author"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 8,
          bottom: -4,
          width: 10,
          height: 10,
          background: active ? 'var(--canvas-accent)' : 'var(--canvas-surface-strong)',
          borderBottom: active ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderLeft: active ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(255, 255, 255, 0.08)',
          transform: 'rotate(-38deg)',
          borderBottomLeftRadius: 3,
        }}
      />
    </div>
  )
}
