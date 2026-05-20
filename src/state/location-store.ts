import { useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function patchHistoryMethod(methodName: 'pushState' | 'replaceState') {
  const original = window.history[methodName]

  return function patchedHistoryMethod(this: History, ...args: Parameters<History['pushState']>) {
    const result = original.apply(this, args)
    emitChange()
    return result
  }
}

if (typeof window !== 'undefined') {
  window.history.pushState = patchHistoryMethod('pushState') as History['pushState']
  window.history.replaceState = patchHistoryMethod('replaceState') as History['replaceState']
  window.addEventListener('popstate', emitChange)
}

export function subscribeToLocation(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function getLocationSnapshot() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

export function useLocationPathname() {
  return useSyncExternalStore(subscribeToLocation, getLocationSnapshot, getLocationSnapshot)
}

export function navigateTo(pathname: string) {
  const current = getLocationSnapshot()

  if (current === pathname) {
    return
  }

  window.history.pushState({}, '', pathname)
}
