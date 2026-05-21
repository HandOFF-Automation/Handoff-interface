import './dropdown-menu.css'
import { createPortal } from 'react-dom'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { CanvasZoomAction } from '../../state/canvas-tool-store'

export type DropdownMenuItem = {
  label: string
  labelStyle?: React.CSSProperties
  shortcut?: string
  action?: CanvasZoomAction
  disabled?: boolean
  value?: string
  icon?: ReactNode
  trailingIcon?: ReactNode
  active?: boolean
}

export type DropdownMenuGroup = {
  items: DropdownMenuItem[]
  style?: React.CSSProperties
  className?: string
  heading?: string
}

type DropdownMenuProps = {
  open: boolean
  groups: DropdownMenuGroup[]
  position?: 'top' | 'bottom'
  anchorRef?: React.RefObject<HTMLElement | null>
  boundaryRef?: React.RefObject<HTMLElement | null>
  portalToBody?: boolean
  onItemClick?: (item: DropdownMenuItem) => void
  style?: React.CSSProperties
  header?: ReactNode
  onClose?: () => void
}

export default function DropdownMenu({ open, groups, position = 'top', anchorRef, boundaryRef, portalToBody = false, onItemClick, style, header, onClose }: DropdownMenuProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [resolvedPosition, setResolvedPosition] = useState<'top' | 'bottom'>(position)
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties | null>(null)
  const lockedPositionRef = useRef<'top' | 'bottom' | null>(null)
  const flattenedItems = useMemo(
    () => groups.flatMap((group) => group.items.filter((item) => !item.disabled)),
    [groups],
  )
  const [highlightedIndex, setHighlightedIndex] = useState(() => {
    const activeIndex = flattenedItems.findIndex((item) => item.active)
    return activeIndex >= 0 ? activeIndex : 0
  })

  useEffect(() => {
    setResolvedPosition(position)
  }, [position])

  useEffect(() => {
    if (!open) {
      lockedPositionRef.current = null
      setPortalStyle(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const activeIndex = flattenedItems.findIndex((item) => item.active)
    setHighlightedIndex(activeIndex >= 0 ? activeIndex : 0)
  }, [flattenedItems, open])

  useEffect(() => {
    if (!open) {
      return
    }

    const nextButton = itemRefs.current[highlightedIndex]

    if (!nextButton) {
      return
    }

    nextButton.focus()
    nextButton.scrollIntoView({ block: 'nearest' })
  }, [highlightedIndex, open])

  useLayoutEffect(() => {
    if (!open || !portalToBody) {
      return
    }

    const getAnchorElement = () => {
      if (anchorRef?.current) {
        return anchorRef.current
      }

      if (typeof document === 'undefined') {
        return null
      }

      const activeElement = document.activeElement

      if (!(activeElement instanceof HTMLElement)) {
        return null
      }

      if (boundaryRef?.current && !boundaryRef.current.contains(activeElement)) {
        return null
      }

      return activeElement
    }

    const updatePortalPosition = () => {
      const anchorElement = getAnchorElement()
      const anchorRect = anchorElement?.getBoundingClientRect()

      if (!anchorRect) {
        return
      }

      const measuredMenuRect = containerRef.current?.getBoundingClientRect()
      const estimatedWidth = measuredMenuRect?.width ?? Math.min(420, Math.max(anchorRect.width, 240))
      const estimatedHeight = measuredMenuRect?.height ?? Math.min(320, 52 + groups.reduce((total, group) => total + group.items.length * 40, 0))
      const spaceBelow = window.innerHeight - anchorRect.bottom
      const spaceAbove = anchorRect.top
      const preferredPosition = position === 'bottom'
        ? (spaceBelow < estimatedHeight && spaceAbove > spaceBelow ? 'top' : 'bottom')
        : (spaceAbove < estimatedHeight && spaceBelow > spaceAbove ? 'bottom' : 'top')
      const nextPosition = lockedPositionRef.current ?? preferredPosition
      const viewportPadding = 12
      const centeredLeft = anchorRect.left + anchorRect.width / 2
      const minLeft = viewportPadding + estimatedWidth / 2
      const maxLeft = window.innerWidth - viewportPadding - estimatedWidth / 2
      const clampedLeft = Math.min(Math.max(centeredLeft, minLeft), Math.max(minLeft, maxLeft))

      if (lockedPositionRef.current === null) {
        lockedPositionRef.current = nextPosition
      }

      setResolvedPosition(nextPosition)
      setPortalStyle({
        position: 'fixed',
        left: clampedLeft,
        top: nextPosition === 'bottom' ? anchorRect.bottom + 10 : undefined,
        bottom: nextPosition === 'top' ? window.innerHeight - anchorRect.top + 18 : undefined,
        width: 'max-content',
        minWidth: anchorRect.width,
        maxWidth: Math.min(420, window.innerWidth - 24),
        zIndex: 40,
      })
    }

    updatePortalPosition()
    window.requestAnimationFrame(updatePortalPosition)
    window.addEventListener('resize', updatePortalPosition)
    window.addEventListener('scroll', updatePortalPosition, true)

    return () => {
      window.removeEventListener('resize', updatePortalPosition)
      window.removeEventListener('scroll', updatePortalPosition, true)
    }
  }, [anchorRef, boundaryRef, groups, open, portalToBody, position])

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null

      if (!target) {
        return
      }

      if (containerRef.current?.contains(target)) {
        return
      }

      if (anchorRef?.current?.contains(target)) {
        return
      }

      if (boundaryRef?.current?.contains(target) && !portalToBody) {
        return
      }

      onClose?.()
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [anchorRef, boundaryRef, onClose, open, portalToBody])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (flattenedItems.length === 0) {
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setHighlightedIndex((current) => (current + 1) % flattenedItems.length)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setHighlightedIndex((current) => (current - 1 + flattenedItems.length) % flattenedItems.length)
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        const selectedItem = flattenedItems[highlightedIndex]

        if (selectedItem) {
          onItemClick?.(selectedItem)
        }

        return
      }

      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const pressedKey = event.key.toLowerCase()
        const matchedIndex = flattenedItems.findIndex((item) => item.shortcut?.toLowerCase() === pressedKey)

        if (matchedIndex >= 0) {
          event.preventDefault()
          setHighlightedIndex(matchedIndex)
          onItemClick?.(flattenedItems[matchedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [flattenedItems, highlightedIndex, onClose, onItemClick, open])

  let enabledItemIndex = -1

  const content = (
    <div
      ref={containerRef}
      className={`dropdownMenu ${resolvedPosition === 'top' ? 'dropdownMenuPositionTop' : 'dropdownMenuPositionBottom'}${portalToBody ? ' dropdownMenuPortal' : ''}`}
      role="menu"
      style={{
        transform: `translateX(-50%) translateY(${open ? '0' : '6px'})`,
        pointerEvents: open ? 'auto' : 'none',
        opacity: open ? 1 : 0,
        visibility: portalToBody && open && !portalStyle ? 'hidden' : 'visible',
        transition: 'opacity 140ms ease, transform 140ms ease',
        ...(portalToBody ? portalStyle ?? {} : {}),
        ...style,
      }}
    >
      {header ? <div className="dropdownMenuHeader">{header}</div> : null}

      {groups.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className={group.className} style={group.style}>
          {group.heading ? <div className="dropdownMenuGroupHeading">{group.heading}</div> : null}
          {group.items.map((item) => (
            (() => {
              const interactiveIndex = item.disabled ? -1 : ++enabledItemIndex
              const isHighlighted = interactiveIndex >= 0 && highlightedIndex === interactiveIndex

              return (
                <button
                  type="button"
                  key={item.label}
                  ref={(element) => {
                    if (interactiveIndex >= 0) {
                      itemRefs.current[interactiveIndex] = element
                    }
                  }}
                  role="menuitem"
                  tabIndex={isHighlighted ? 0 : -1}
                  className={`dropdownMenuItem${item.active ? ' dropdownMenuItemActive' : ''}${isHighlighted ? ' dropdownMenuItemHighlighted' : ''}`}
                  onPointerEnter={() => {
                    if (interactiveIndex >= 0) {
                      setHighlightedIndex(interactiveIndex)
                    }
                  }}
                  onPointerDown={(event) => {
                    event.stopPropagation()

                    if (!item.disabled) {
                      onItemClick?.(item)
                    }
                  }}
                  onClick={(event) => {
                    event.preventDefault()
                  }}
                  disabled={item.disabled}
                  style={{
                    width: '100%',
                    border: 'none',
                    textAlign: 'left',
                    opacity: item.disabled ? 0.4 : 1,
                    pointerEvents: item.disabled ? 'none' : 'auto',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    outline: 'none',
                  }}
                >
                  <span className="dropdownMenuLabel">
                    {item.icon ? <span className="dropdownMenuIcon">{item.icon}</span> : null}
                    <span
                      style={{
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        ...item.labelStyle,
                      }}
                    >
                      {item.label}
                    </span>
                  </span>
                  {item.trailingIcon ? <span className="dropdownMenuTrailingIcon">{item.trailingIcon}</span> : null}
                  {item.shortcut ? <span className="dropdownMenuShortcut">{item.shortcut}</span> : null}
                </button>
              )
            })()
          ))}

          {groupIndex < groups.length - 1 ? <div className="dropdownMenuGroupDivider" /> : null}
        </div>
      ))}
    </div>
  )

  if (portalToBody && typeof document !== 'undefined' && document.body) {
    return createPortal(content, document.body)
  }

  return content
}
