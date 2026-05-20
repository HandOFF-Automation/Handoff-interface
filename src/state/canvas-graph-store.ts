import { useSyncExternalStore } from 'react'

import type { CanvasEdgeRecord } from './canvas-edge-store'
import type { CanvasNodeRecord } from './canvas-node-store'

type CanvasGraphSnapshot = {
  nodes: CanvasNodeRecord[]
  selectedNodeIds: string[]
  edges: CanvasEdgeRecord[]
  selectedEdgeIds: string[]
}

const listeners = new Set<() => void>()

let present: CanvasGraphSnapshot = {
  nodes: [],
  selectedNodeIds: [],
  edges: [],
  selectedEdgeIds: [],
}

let undoStack: CanvasGraphSnapshot[] = []
let redoStack: CanvasGraphSnapshot[] = []

function emitChange() {
  listeners.forEach((listener) => listener())
}

function cloneSnapshot(snapshot: CanvasGraphSnapshot): CanvasGraphSnapshot {
  return {
    nodes: snapshot.nodes.map((node) => ({ ...node })),
    selectedNodeIds: [...snapshot.selectedNodeIds],
    edges: snapshot.edges.map((edge) => ({ ...edge })),
    selectedEdgeIds: [...snapshot.selectedEdgeIds],
  }
}

export function getCanvasGraphSnapshot() {
  return present
}

export function commitCanvasGraphMutation(mutator: (current: CanvasGraphSnapshot) => CanvasGraphSnapshot) {
  const previous = cloneSnapshot(present)
  const next = mutator(cloneSnapshot(present))

  const isSame = JSON.stringify(previous) === JSON.stringify(next)

  if (isSame) {
    return
  }

  undoStack = [...undoStack, previous]
  redoStack = []
  present = next
  emitChange()
}

export function undoCanvasGraph() {
  const previous = undoStack.pop()

  if (!previous) {
    return
  }

  redoStack = [...redoStack, cloneSnapshot(present)]
  present = previous
  emitChange()
}

export function redoCanvasGraph() {
  const next = redoStack.pop()

  if (!next) {
    return
  }

  undoStack = [...undoStack, cloneSnapshot(present)]
  present = next
  emitChange()
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return present
}

export function useCanvasGraph() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
