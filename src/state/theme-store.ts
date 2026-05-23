import { useSyncExternalStore } from 'react'

export type CanvasTheme = 'dark' | 'light'

const listeners = new Set<() => void>()

let activeTheme: CanvasTheme = 'light'

function emitChange() {
  listeners.forEach((listener) => listener())
}

function applyTheme(theme: CanvasTheme) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.theme = theme
}

applyTheme(activeTheme)

export function setCanvasTheme(nextTheme: CanvasTheme) {
  if (activeTheme === nextTheme) {
    return
  }

  activeTheme = nextTheme
  applyTheme(nextTheme)
  emitChange()
}

export function toggleCanvasTheme() {
  setCanvasTheme(activeTheme === 'dark' ? 'light' : 'dark')
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return activeTheme
}

export function useCanvasTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
