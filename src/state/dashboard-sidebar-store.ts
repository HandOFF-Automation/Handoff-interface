import { useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()

let isDashboardSidebarMinimized = false

function emitChange() {
  listeners.forEach((listener) => listener())
}

export function setDashboardSidebarMinimized(nextValue: boolean) {
  if (isDashboardSidebarMinimized === nextValue) {
    return
  }

  isDashboardSidebarMinimized = nextValue
  emitChange()
}

export function toggleDashboardSidebarMinimized() {
  setDashboardSidebarMinimized(!isDashboardSidebarMinimized)
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return isDashboardSidebarMinimized
}

export function useDashboardSidebarMinimized() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
