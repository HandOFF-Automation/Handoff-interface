import { useSyncExternalStore } from 'react'

export type CanvasTool = 'hand' | 'scale' | 'click' | 'comment' | 'node'
export type CanvasZoomAction = 'zoom' | 'zoomIn' | 'zoomOut' | 'zoom100' | 'zoomFit' | 'zoomSelection'
export type CanvasNodeType = 'start' | 'loop' | 'end' | 'if' | 'else' | 'and' | 'or' | 'not' | 'xor' | 'intersect' | 'union' | 'exclude' | 'filter' | 'portfolioCondition' | 'stock' | 'token' | 'assetBasket' | 'buy' | 'sell' | 'rebalance' | 'allocate' | 'scaleOut' | 'takeProfit' | 'stopLoss' | 'cooldown' | 'wait' | 'pauseTrading' | 'positionLimit' | 'positionCountLimit' | 'exposureLimit' | 'cashReserve'

const listeners = new Set<() => void>()

let activeTool: CanvasTool = 'click'
let canvasScale = 1
let activeNodeType: CanvasNodeType = 'start'

const MIN_SCALE = 0.25
const MAX_SCALE = 3

export function setCanvasTool(nextTool: CanvasTool) {
  if (activeTool === nextTool) {
    return
  }

  activeTool = nextTool
  listeners.forEach((listener) => listener())
}

export function setCanvasScale(nextScale: number) {
  if (canvasScale === nextScale) {
    return
  }

  canvasScale = nextScale
  listeners.forEach((listener) => listener())
}

export function setCanvasNodeType(nextNodeType: CanvasNodeType) {
  if (activeNodeType === nextNodeType) {
    return
  }

  activeNodeType = nextNodeType
  listeners.forEach((listener) => listener())
}

export function zoomCanvas(delta: number) {
  setCanvasScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, canvasScale + delta)))
}

export function zoomCanvasTo(scale: number) {
  setCanvasScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale)))
}

export function zoomCanvasByFactor(factor: number) {
  setCanvasScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, canvasScale * factor)))
}

export function executeCanvasZoomAction(action: CanvasZoomAction) {
  if (action === 'zoom') {
    return
  }

  if (action === 'zoomIn') {
    zoomCanvasByFactor(1.1)
    return
  }

  if (action === 'zoomOut') {
    zoomCanvasByFactor(0.9)
    return
  }

  if (action === 'zoom100') {
    zoomCanvasTo(1)
    return
  }

  if (action === 'zoomFit') {
    zoomCanvasTo(0.95)
    return
  }

  if (action === 'zoomSelection') {
    zoomCanvasTo(1.15)
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return activeTool
}

function getScaleSnapshot() {
  return canvasScale
}

function getNodeTypeSnapshot() {
  return activeNodeType
}

export function useCanvasTool() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function useCanvasScale() {
  return useSyncExternalStore(subscribe, getScaleSnapshot, getScaleSnapshot)
}

export function useCanvasNodeType() {
  return useSyncExternalStore(subscribe, getNodeTypeSnapshot, getNodeTypeSnapshot)
}
