import { useSyncExternalStore } from 'react'

type AppLoadingState = {
  isLoading: boolean
  progress: number
  stage: string
}

const DEFAULT_STATE: AppLoadingState = {
  isLoading: false,
  progress: 8,
  stage: 'Preparing workspace',
}

let state: AppLoadingState = DEFAULT_STATE

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function setState(nextState: Partial<AppLoadingState>) {
  state = {
    ...state,
    ...nextState,
    progress: Math.max(0, Math.min(100, nextState.progress ?? state.progress)),
  }
  emitChange()
}

export function subscribeToAppLoading(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function getAppLoadingSnapshot() {
  return state
}

export function useAppLoading() {
  return useSyncExternalStore(subscribeToAppLoading, getAppLoadingSnapshot, getAppLoadingSnapshot)
}

export function startAppLoading(stage = 'Preparing workspace', progress = 8) {
  setState({ isLoading: true, stage, progress })
}

export function updateAppLoading(progress: number, stage?: string) {
  setState({ progress, stage: stage ?? state.stage })
}

export function finishAppLoading() {
  setState({ isLoading: false, progress: 100, stage: 'Ready' })
}

export function resetAppLoading() {
  state = DEFAULT_STATE
  emitChange()
}

export const appLoadingController = {
  start: startAppLoading,
  update: updateAppLoading,
  finish: finishAppLoading,
  reset: resetAppLoading,
  getState: getAppLoadingSnapshot,
}
