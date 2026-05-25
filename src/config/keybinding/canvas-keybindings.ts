import type { CanvasTool } from '../../state/canvas-tool-store'

export type CanvasDockMenuKey = 'tool' | 'node' | 'logic' | 'assetType' | 'execution' | 'zoom'

export type ZoomMenuItem = {
  label: string
  shortcut: string
  action?: 'zoom' | 'zoomIn' | 'zoomOut' | 'zoom100' | 'zoomFit' | 'zoomSelection'
  disabled?: boolean
}

export type ZoomMenuGroup = {
  heading?: string
  items: ZoomMenuItem[]
}

export type CanvasKeybindingItem = {
  label: string
  shortcut: string
}

export type CanvasDockMenuShortcut = {
  menu: CanvasDockMenuKey
  label: string
  shortcut: string
}

export type CanvasDockMenuItemConfig = {
  label: string
  value: string
  shortcut?: string
}

export const canvasDockTools: Array<{
  tool: CanvasTool
  label: string
}> = [
  { tool: 'click', label: 'Click' },
  { tool: 'hand', label: 'Hand' },
]

export const canvasDockMenuShortcuts: CanvasDockMenuShortcut[] = [
  { menu: 'tool', label: 'Tool Menu', shortcut: 'P' },
  { menu: 'node', label: 'Nodes Menu', shortcut: 'N' },
  { menu: 'logic', label: 'Logic Menu', shortcut: 'G' },
  { menu: 'assetType', label: 'Asset Type Menu', shortcut: 'A' },
  { menu: 'execution', label: 'Execution Menu', shortcut: 'E' },
  { menu: 'zoom', label: 'Zoom Menu', shortcut: 'Z' },
]

export const canvasToolMenuItems: CanvasDockMenuItemConfig[] = [
  { label: 'Click', value: 'click', shortcut: 'C' },
  { label: 'Hand', value: 'hand', shortcut: 'H' },
]

export const canvasNodeMenuItems: CanvasDockMenuItemConfig[] = [
  { label: 'Start', value: 'start', shortcut: 'S' },
  { label: 'Loop', value: 'loop', shortcut: 'L' },
  { label: 'End', value: 'end', shortcut: 'E' },
]

export const canvasLogicMenuItems: CanvasDockMenuItemConfig[] = [
  { label: 'If', value: 'if', shortcut: 'I' },
  { label: 'Else', value: 'else', shortcut: 'E' },
  { label: 'All Of', value: 'and', shortcut: 'D' },
  { label: 'Any Of', value: 'or', shortcut: 'O' },
  { label: 'Not', value: 'not', shortcut: 'N' },
  { label: 'Only One', value: 'xor', shortcut: 'X' },
  { label: 'Match All', value: 'intersect', shortcut: 'M' },
  { label: 'Match Any', value: 'union', shortcut: 'Y' },
  { label: 'Exclude', value: 'exclude', shortcut: 'U' },
  { label: 'Filter', value: 'filter', shortcut: 'F' },
  { label: 'Portfolio Condition', value: 'portfolioCondition', shortcut: 'P' },
  { label: 'Rethink', value: 'rethink', shortcut: 'R' },
]

export const canvasAssetTypeMenuItems: CanvasDockMenuItemConfig[] = [
  { label: 'Stock', value: 'stock', shortcut: 'S' },
  { label: 'Token', value: 'token', shortcut: 'T' },
  { label: 'Asset Basket', value: 'assetBasket', shortcut: 'B' },
]

export const canvasActionMenuItems: CanvasDockMenuItemConfig[] = [
  { label: 'Buy', value: 'buy', shortcut: 'B' },
  { label: 'Sell', value: 'sell', shortcut: 'S' },
  { label: 'Rebalance', value: 'rebalance', shortcut: 'R' },
]

export const canvasPortfolioMenuItems: CanvasDockMenuItemConfig[] = [
  { label: 'Allocate', value: 'allocate', shortcut: 'A' },
  { label: 'Scale Out', value: 'scaleOut', shortcut: 'O' },
  { label: 'Cash Reserve', value: 'cashReserve', shortcut: 'C' },
]

export const canvasRiskMenuItems: CanvasDockMenuItemConfig[] = [
  { label: 'Take Profit', value: 'takeProfit', shortcut: 'T' },
  { label: 'Stop Loss', value: 'stopLoss', shortcut: 'L' },
  { label: 'Cooldown', value: 'cooldown', shortcut: 'C' },
  { label: 'Wait', value: 'wait', shortcut: 'W' },
  { label: 'Pause Trading', value: 'pauseTrading', shortcut: 'U' },
  { label: 'Position Limit', value: 'positionLimit', shortcut: 'P' },
  { label: 'Position Count Limit', value: 'positionCountLimit', shortcut: 'N' },
  { label: 'Exposure Limit', value: 'exposureLimit', shortcut: 'X' },
]

export const canvasZoomMenuGroups: ZoomMenuGroup[] = [
  {
    heading: 'Zoom',
    items: [
      { label: 'Zoom', shortcut: 'Z' },
      { label: 'Zoom In', shortcut: 'Ctrl+=', action: 'zoomIn' },
      { label: 'Zoom Out', shortcut: 'Ctrl+−', action: 'zoomOut' },
    ],
  },
  {
    heading: 'View',
    items: [
      { label: 'Zoom to 100%', shortcut: 'Shift+0', action: 'zoom100' },
      { label: 'Zoom to Fit', shortcut: 'Shift+1', action: 'zoomFit' },
      { label: 'Zoom to Selection', shortcut: 'Shift+2', action: 'zoomSelection', disabled: true },
    ],
  },
]

export const canvasActionShortcuts = {
  deleteSelectedNodes: ['Backspace', 'Delete'],
  undo: ['Ctrl+z'],
  redo: ['Ctrl+y'],
  copy: ['Ctrl+c'],
  paste: ['Ctrl+v'],
  nudgeUp: ['ArrowUp'],
  nudgeDown: ['ArrowDown'],
  nudgeLeft: ['ArrowLeft'],
  nudgeRight: ['ArrowRight'],
} as const

export const canvasKeybindingItems: CanvasKeybindingItem[] = [
  { label: 'Click Tool', shortcut: 'C' },
  { label: 'Hand Tool', shortcut: 'H' },
  { label: 'Comment Tool', shortcut: 'M' },
  { label: 'Tool Menu', shortcut: 'P' },
  { label: 'Nodes Menu', shortcut: 'N' },
  { label: 'Logic Menu', shortcut: 'G' },
  { label: 'Asset Type Menu', shortcut: 'A' },
  { label: 'Execution Menu', shortcut: 'E' },
  { label: 'Zoom Menu', shortcut: 'Z' },
  { label: 'Zoom In', shortcut: 'Ctrl+=' },
  { label: 'Zoom Out', shortcut: 'Ctrl+-' },
  { label: 'Zoom to 100%', shortcut: 'Shift+0' },
  { label: 'Zoom to Fit', shortcut: 'Shift+1' },
  { label: 'Zoom to Selection', shortcut: 'Shift+2' },
  { label: 'Undo', shortcut: 'Ctrl+Z' },
  { label: 'Redo', shortcut: 'Ctrl+Y' },
  { label: 'Copy Selected Nodes', shortcut: 'Ctrl+C' },
  { label: 'Paste Nodes', shortcut: 'Ctrl+V' },
  { label: 'Nudge Up', shortcut: 'ArrowUp' },
  { label: 'Nudge Down', shortcut: 'ArrowDown' },
  { label: 'Nudge Left', shortcut: 'ArrowLeft' },
  { label: 'Nudge Right', shortcut: 'ArrowRight' },
  { label: 'Delete Selected Nodes', shortcut: 'Backspace / Delete' },
  { label: 'Dropdown Previous Item', shortcut: 'ArrowUp' },
  { label: 'Dropdown Next Item', shortcut: 'ArrowDown' },
  { label: 'Dropdown Select', shortcut: 'Enter' },
  { label: 'Dropdown Close', shortcut: 'Esc' },
  { label: 'Send Comment', shortcut: 'Enter' },
  { label: 'New Line in Comment', shortcut: 'Shift+Enter' },
  { label: 'Close Comment', shortcut: 'Esc' },
]
