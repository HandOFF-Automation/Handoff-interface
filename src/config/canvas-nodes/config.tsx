import type { CanvasConnectorSide } from '../../state/canvas-edge-store'
import type { CanvasNodeType } from '../../state/canvas-tool-store'

export type CanvasNodeConfig = {
  type: CanvasNodeType
  label: string
  defaultEdgeLabel?: string
  edgeLabelBySide?: Partial<Record<CanvasConnectorSide, string>>
}

export const canvasNodeConfigs: CanvasNodeConfig[] = [
  { type: 'start', label: 'Start', defaultEdgeLabel: 'Start flow' },
  { type: 'loop', label: 'Loop', defaultEdgeLabel: 'Re-check' },
  { type: 'end', label: 'End' },
  { type: 'if', label: 'If', defaultEdgeLabel: 'When' },
  { type: 'else', label: 'Else', defaultEdgeLabel: 'Otherwise' },
  { type: 'and', label: 'All Of', defaultEdgeLabel: 'All true' },
  { type: 'or', label: 'Any Of', defaultEdgeLabel: 'Any true' },
  { type: 'not', label: 'Not', defaultEdgeLabel: 'Invert' },
  { type: 'xor', label: 'Only One', defaultEdgeLabel: 'Only one true' },
  { type: 'intersect', label: 'Match All', defaultEdgeLabel: 'Shared matches' },
  { type: 'union', label: 'Match Any', defaultEdgeLabel: 'Combined matches' },
  { type: 'exclude', label: 'Exclude', defaultEdgeLabel: 'Without matches' },
  { type: 'filter', label: 'Filter', defaultEdgeLabel: 'Filtered' },
  { type: 'portfolioCondition', label: 'Portfolio Condition', defaultEdgeLabel: 'Portfolio rule' },
  { type: 'stock', label: 'Stock', defaultEdgeLabel: 'Asset' },
  { type: 'token', label: 'Token', defaultEdgeLabel: 'Asset' },
  { type: 'assetBasket', label: 'Asset Basket', defaultEdgeLabel: 'Basket assets' },
  { type: 'buy', label: 'Buy', defaultEdgeLabel: 'Execute buy' },
  { type: 'sell', label: 'Sell', defaultEdgeLabel: 'Execute sell' },
  { type: 'rebalance', label: 'Rebalance', defaultEdgeLabel: 'Rebalance branch' },
  { type: 'allocate', label: 'Allocate', defaultEdgeLabel: 'Allocate branch' },
  { type: 'scaleOut', label: 'Scale Out', defaultEdgeLabel: 'Scale out' },
  { type: 'takeProfit', label: 'Take Profit', defaultEdgeLabel: 'Take profit' },
  { type: 'stopLoss', label: 'Stop Loss', defaultEdgeLabel: 'Stop loss' },
  { type: 'cooldown', label: 'Cooldown', defaultEdgeLabel: 'Pause branch' },
  { type: 'wait', label: 'Wait', defaultEdgeLabel: 'Wait before next step' },
  { type: 'pauseTrading', label: 'Pause Trading', defaultEdgeLabel: 'Pause trading' },
  { type: 'positionLimit', label: 'Position Limit', defaultEdgeLabel: 'Limit position' },
  { type: 'positionCountLimit', label: 'Position Count Limit', defaultEdgeLabel: 'Limit open positions' },
  { type: 'exposureLimit', label: 'Exposure Limit', defaultEdgeLabel: 'Limit exposure' },
  { type: 'cashReserve', label: 'Cash Reserve', defaultEdgeLabel: 'Reserve cash' },
]

const canvasNodeConfigByType = new Map(canvasNodeConfigs.map((config) => [config.type, config]))

export function getCanvasNodeConfig(type: CanvasNodeType) {
  return canvasNodeConfigByType.get(type) ?? null
}

export function getCanvasEdgeLabelForNode(type: CanvasNodeType, side: CanvasConnectorSide) {
  const config = getCanvasNodeConfig(type)

  if (!config) {
    return ''
  }

  return config.edgeLabelBySide?.[side] ?? config.defaultEdgeLabel ?? ''
}
