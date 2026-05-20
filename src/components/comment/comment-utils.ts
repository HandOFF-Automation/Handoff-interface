import type { CanvasView } from './comment-types'

export function worldToScreenPosition(x: number, y: number, view: CanvasView) {
  return {
    x: x * view.scale + view.x,
    y: y * view.scale + view.y,
  }
}

export function formatCommentTimestamp(timestamp: number) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp)
}
