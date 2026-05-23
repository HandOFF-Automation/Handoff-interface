import { useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()

let isCanvasAiSidebarOpen = false

function emitChange() {
  listeners.forEach((listener) => listener())
}

export function setCanvasAiSidebarOpen(nextOpen: boolean) {
  if (isCanvasAiSidebarOpen === nextOpen) {
    return
  }

  isCanvasAiSidebarOpen = nextOpen
  emitChange()
}

export function toggleCanvasAiSidebar() {
  setCanvasAiSidebarOpen(!isCanvasAiSidebarOpen)
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return isCanvasAiSidebarOpen
}

export function useCanvasAiSidebarOpen() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
