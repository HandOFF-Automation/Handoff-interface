import type { CanvasConnectorSide, CanvasEdgeRecord } from '../../state/canvas-edge-store'
import type { CanvasNodeRecord } from '../../state/canvas-node-store'
import type { CanvasNodeType } from '../../state/canvas-tool-store'

export type CanvasConnectionCategory = 'asset' | 'assetSet' | 'boolean' | 'branch' | 'execution' | 'terminal'

export const CANVAS_CONNECTOR_SIDES: CanvasConnectorSide[] = ['top', 'right', 'bottom', 'left']
export const CANVAS_CONNECTION_DROP_TARGET_THRESHOLD = 12
export const CANVAS_CONNECTION_INVALID_MESSAGE = 'Invalid connection.'
export const CANVAS_CONNECTION_DUPLICATE_ERROR = 'These nodes are already connected through that connector.'
export const CANVAS_CONNECTION_SELF_ERROR = 'Cannot connect a node to itself.'
export const CANVAS_CONNECTION_START_TARGET_ERROR = 'Start cannot receive incoming connections.'
export const CANVAS_CONNECTION_END_SOURCE_ERROR = 'End cannot continue to another node.'

type CanvasConnectionValidationResult = {
  valid: boolean
  reason?: string
}

type CanvasConnectionRule = {
  allowedTargetTypes?: CanvasNodeType[]
  allowedTargetCategories?: CanvasConnectionCategory[]
  blockedTargetTypes?: CanvasNodeType[]
  reason: string
  maxOutgoing?: number
  maxOutgoingPerSide?: Partial<Record<CanvasConnectorSide, number>>
  sideRules?: {
    from?: CanvasConnectorSide[]
  }
}

type CanvasConnectionTargetRule = {
  maxIncoming?: number
  maxIncomingPerSide?: Partial<Record<CanvasConnectorSide, number>>
  sideRules?: {
    to?: CanvasConnectorSide[]
  }
  reason?: string
}

const CANVAS_NODE_CONNECTION_CATEGORY: Record<CanvasNodeType, CanvasConnectionCategory> = {
  start: 'assetSet',
  loop: 'branch',
  end: 'terminal',
  if: 'boolean',
  else: 'branch',
  and: 'boolean',
  or: 'boolean',
  not: 'boolean',
  xor: 'boolean',
  intersect: 'assetSet',
  union: 'assetSet',
  exclude: 'assetSet',
  filter: 'assetSet',
  portfolioCondition: 'boolean',
  stock: 'asset',
  token: 'asset',
  assetBasket: 'assetSet',
  buy: 'execution',
  sell: 'execution',
  rebalance: 'execution',
  allocate: 'execution',
  scaleOut: 'execution',
  takeProfit: 'execution',
  stopLoss: 'execution',
  cooldown: 'branch',
  wait: 'branch',
  pauseTrading: 'branch',
  positionLimit: 'execution',
  positionCountLimit: 'execution',
  exposureLimit: 'execution',
  cashReserve: 'execution',
}

const CANVAS_CONNECTION_RULES: Partial<Record<CanvasNodeType, CanvasConnectionRule>> = {
  start: {
    allowedTargetTypes: ['stock', 'token', 'assetBasket', 'filter', 'portfolioCondition'],
    reason: 'Start should connect into assets or a filter stage.',
    maxOutgoing: 2,
    maxOutgoingPerSide: {
      right: 1,
      bottom: 1,
    },
    sideRules: {
      from: ['right', 'bottom'],
    },
  },
  stock: {
    allowedTargetTypes: ['assetBasket', 'filter', 'if', 'portfolioCondition', 'intersect', 'union', 'exclude'],
    reason: 'Assets should connect into Filter, If, or asset-set logic nodes.',
  },
  token: {
    allowedTargetTypes: ['assetBasket', 'filter', 'if', 'portfolioCondition', 'intersect', 'union', 'exclude'],
    reason: 'Assets should connect into Filter, If, or asset-set logic nodes.',
  },
  filter: {
    allowedTargetTypes: ['filter', 'if', 'portfolioCondition', 'intersect', 'union', 'exclude'],
    allowedTargetCategories: ['execution'],
    reason: 'Filter results should continue into another Filter, an If node, or asset-set logic.',
  },
  assetBasket: {
    allowedTargetTypes: ['filter', 'if', 'portfolioCondition', 'intersect', 'union', 'exclude'],
    allowedTargetCategories: ['execution'],
    reason: 'Filter results should continue into another Filter, an If node, or asset-set logic.',
  },
  intersect: {
    allowedTargetTypes: ['filter', 'if', 'portfolioCondition', 'intersect', 'union', 'exclude'],
    allowedTargetCategories: ['execution'],
    reason: 'Filter results should continue into another Filter, an If node, or asset-set logic.',
  },
  union: {
    allowedTargetTypes: ['filter', 'if', 'portfolioCondition', 'intersect', 'union', 'exclude'],
    allowedTargetCategories: ['execution'],
    reason: 'Filter results should continue into another Filter, an If node, or asset-set logic.',
  },
  exclude: {
    allowedTargetTypes: ['filter', 'if', 'portfolioCondition', 'intersect', 'union', 'exclude'],
    allowedTargetCategories: ['execution'],
    reason: 'Filter results should continue into another Filter, an If node, or asset-set logic.',
  },
  if: {
    allowedTargetTypes: ['and', 'or', 'not', 'xor', 'else'],
    allowedTargetCategories: ['execution'],
    reason: 'Condition results should connect into All Of, Any Of, Not, Only One, Else, or execution nodes.',
    maxOutgoing: 2,
    maxOutgoingPerSide: {
      right: 1,
      bottom: 1,
    },
    sideRules: {
      from: ['right', 'bottom'],
    },
  },
  portfolioCondition: {
    allowedTargetTypes: ['and', 'or', 'not', 'xor', 'else'],
    allowedTargetCategories: ['execution'],
    reason: 'Condition results should connect into All Of, Any Of, Not, Only One, Else, or execution nodes.',
  },
  and: {
    allowedTargetTypes: ['and', 'or', 'not', 'xor', 'else'],
    allowedTargetCategories: ['execution'],
    reason: 'Condition results should connect into All Of, Any Of, Not, Only One, Else, or execution nodes.',
  },
  or: {
    allowedTargetTypes: ['and', 'or', 'not', 'xor', 'else'],
    allowedTargetCategories: ['execution'],
    reason: 'Condition results should connect into All Of, Any Of, Not, Only One, Else, or execution nodes.',
  },
  not: {
    allowedTargetTypes: ['and', 'or', 'not', 'xor', 'else'],
    allowedTargetCategories: ['execution'],
    reason: 'Condition results should connect into All Of, Any Of, Not, Only One, Else, or execution nodes.',
  },
  xor: {
    allowedTargetTypes: ['and', 'or', 'not', 'xor', 'else'],
    allowedTargetCategories: ['execution'],
    reason: 'Condition results should connect into All Of, Any Of, Not, Only One, Else, or execution nodes.',
  },
  else: {
    allowedTargetTypes: ['end', 'loop', 'filter', 'if', 'portfolioCondition'],
    allowedTargetCategories: ['execution'],
    reason: 'Else should continue into filtering, evaluation, execution, loop, or end.',
    maxOutgoing: 1,
    maxOutgoingPerSide: {
      right: 1,
    },
    sideRules: {
      from: ['right'],
    },
  },
  loop: {
    allowedTargetTypes: ['end', 'loop', 'filter', 'if', 'portfolioCondition'],
    allowedTargetCategories: ['execution'],
    reason: 'Loop should continue into filtering, evaluation, execution, loop, or end.',
    sideRules: {
      from: CANVAS_CONNECTOR_SIDES,
    },
  },
  cooldown: {
    allowedTargetTypes: ['end', 'loop', 'filter', 'if', 'portfolioCondition'],
    allowedTargetCategories: ['execution'],
    reason: 'Cooldown should continue into filtering, evaluation, execution, loop, or end.',
  },
  wait: {
    allowedTargetTypes: ['end', 'loop', 'filter', 'if', 'portfolioCondition'],
    allowedTargetCategories: ['execution'],
    reason: 'Wait should continue into filtering, evaluation, execution, loop, or end.',
  },
  pauseTrading: {
    allowedTargetTypes: ['end', 'loop', 'filter', 'if', 'portfolioCondition'],
    allowedTargetCategories: ['execution'],
    reason: 'Pause Trading should continue into filtering, evaluation, execution, loop, or end.',
  },
  buy: {
    allowedTargetTypes: ['loop', 'end', 'cooldown', 'wait', 'pauseTrading'],
    allowedTargetCategories: ['execution'],
    reason: 'Execution nodes should continue into execution, loop, or end nodes.',
  },
  sell: {
    allowedTargetTypes: ['loop', 'end', 'cooldown', 'wait', 'pauseTrading'],
    allowedTargetCategories: ['execution'],
    reason: 'Execution nodes should continue into execution, loop, or end nodes.',
  },
  rebalance: {
    allowedTargetTypes: ['loop', 'end', 'cooldown', 'wait', 'pauseTrading'],
    allowedTargetCategories: ['execution'],
    reason: 'Execution nodes should continue into execution, loop, or end nodes.',
  },
  allocate: {
    allowedTargetTypes: ['loop', 'end', 'cooldown', 'wait', 'pauseTrading'],
    allowedTargetCategories: ['execution'],
    reason: 'Execution nodes should continue into execution, loop, or end nodes.',
  },
  scaleOut: {
    allowedTargetTypes: ['loop', 'end', 'cooldown', 'wait', 'pauseTrading'],
    allowedTargetCategories: ['execution'],
    reason: 'Execution nodes should continue into execution, loop, or end nodes.',
  },
  takeProfit: {
    allowedTargetTypes: ['loop', 'end', 'cooldown', 'wait', 'pauseTrading'],
    allowedTargetCategories: ['execution'],
    reason: 'Execution nodes should continue into execution, loop, or end nodes.',
  },
  stopLoss: {
    allowedTargetTypes: ['loop', 'end', 'cooldown', 'wait', 'pauseTrading'],
    allowedTargetCategories: ['execution'],
    reason: 'Execution nodes should continue into execution, loop, or end nodes.',
  },
  positionLimit: {
    allowedTargetTypes: ['loop', 'end', 'cooldown', 'wait', 'pauseTrading'],
    allowedTargetCategories: ['execution'],
    reason: 'Execution nodes should continue into execution, loop, or end nodes.',
  },
  positionCountLimit: {
    allowedTargetTypes: ['loop', 'end', 'cooldown', 'wait', 'pauseTrading'],
    allowedTargetCategories: ['execution'],
    reason: 'Execution nodes should continue into execution, loop, or end nodes.',
  },
  exposureLimit: {
    allowedTargetTypes: ['loop', 'end', 'cooldown', 'wait', 'pauseTrading'],
    allowedTargetCategories: ['execution'],
    reason: 'Execution nodes should continue into execution, loop, or end nodes.',
  },
  cashReserve: {
    allowedTargetTypes: ['loop', 'end', 'cooldown', 'wait', 'pauseTrading'],
    allowedTargetCategories: ['execution'],
    reason: 'Execution nodes should continue into execution, loop, or end nodes.',
  },
}

const CANVAS_CONNECTION_TARGET_RULES: Partial<Record<CanvasNodeType, CanvasConnectionTargetRule>> = {
  start: {
    maxIncoming: 0,
    sideRules: {
      to: [],
    },
    reason: CANVAS_CONNECTION_START_TARGET_ERROR,
  },
  if: {
    maxIncoming: 2,
    maxIncomingPerSide: {
      top: 1,
      left: 1,
    },
    sideRules: {
      to: ['top', 'left'],
    },
    reason: 'If should receive incoming connections from the top or left side.',
  },
  else: {
    maxIncoming: 3,
    maxIncomingPerSide: {
      top: 1,
      left: 1,
      bottom: 1,
    },
    sideRules: {
      to: ['top', 'left', 'bottom'],
    },
    reason: 'Else should receive incoming connections from the top, left, or bottom side.',
  },
  end: {
    maxIncomingPerSide: {
      top: 1,
      right: 1,
      bottom: 1,
      left: 1,
    },
    sideRules: {
      to: CANVAS_CONNECTOR_SIDES,
    },
  },
}

export function getCanvasNodeConnectionCategory(node: Pick<CanvasNodeRecord, 'type'>): CanvasConnectionCategory {
  return CANVAS_NODE_CONNECTION_CATEGORY[node.type]
}

export function getCanvasConnectionValidation(
  sourceNode: Pick<CanvasNodeRecord, 'id' | 'type'> | null | undefined,
  targetNode: Pick<CanvasNodeRecord, 'id' | 'type'> | null | undefined,
  options?: {
    sourceSide?: CanvasConnectorSide
    targetSide?: CanvasConnectorSide
    edges?: Array<Pick<CanvasEdgeRecord, 'fromNodeId' | 'fromSide' | 'toNodeId' | 'toSide'>>
  },
): CanvasConnectionValidationResult {
  if (!sourceNode || !targetNode) {
    return { valid: false, reason: 'Missing source or target node.' }
  }

  if (sourceNode.id === targetNode.id) {
    return { valid: false, reason: CANVAS_CONNECTION_SELF_ERROR }
  }

  if (targetNode.type === 'start') {
    return { valid: false, reason: CANVAS_CONNECTION_START_TARGET_ERROR }
  }

  if (sourceNode.type === 'end') {
    return { valid: false, reason: CANVAS_CONNECTION_END_SOURCE_ERROR }
  }

  const rule = CANVAS_CONNECTION_RULES[sourceNode.type]
  const targetRule = CANVAS_CONNECTION_TARGET_RULES[targetNode.type]
  const edges = options?.edges ?? []

  if (!rule) {
    return { valid: false, reason: 'This connection is not allowed by the current flow rules.' }
  }

  if (rule.sideRules?.from && options?.sourceSide && !rule.sideRules.from.includes(options.sourceSide)) {
    return { valid: false, reason: `${sourceNode.type} cannot connect from that connector.` }
  }

  if (targetRule?.sideRules?.to && options?.targetSide && !targetRule.sideRules.to.includes(options.targetSide)) {
    return { valid: false, reason: targetRule.reason ?? `${targetNode.type} cannot receive a connection on that connector.` }
  }

  const outgoingEdges = edges.filter((edge) => edge.fromNodeId === sourceNode.id)
  const incomingEdges = edges.filter((edge) => edge.toNodeId === targetNode.id)

  if (options?.sourceSide && options?.targetSide && edges.some((edge) => edge.fromNodeId === sourceNode.id && edge.fromSide === options.sourceSide && edge.toNodeId === targetNode.id && edge.toSide === options.targetSide)) {
    return { valid: false, reason: CANVAS_CONNECTION_DUPLICATE_ERROR }
  }

  if (typeof rule.maxOutgoing === 'number' && outgoingEdges.length >= rule.maxOutgoing) {
    return { valid: false, reason: `${sourceNode.type} already has the maximum number of outgoing connections.` }
  }

  if (options?.sourceSide && typeof rule.maxOutgoingPerSide?.[options.sourceSide] === 'number') {
    const outgoingEdgesOnSide = outgoingEdges.filter((edge) => edge.fromSide === options.sourceSide)

    if (outgoingEdgesOnSide.length >= (rule.maxOutgoingPerSide[options.sourceSide] ?? 0)) {
      return { valid: false, reason: `${sourceNode.type} already uses the ${options.sourceSide} connector.` }
    }
  }

  if (typeof targetRule?.maxIncoming === 'number' && incomingEdges.length >= targetRule.maxIncoming) {
    return { valid: false, reason: `${targetNode.type} already has the maximum number of incoming connections.` }
  }

  if (options?.targetSide && typeof targetRule?.maxIncomingPerSide?.[options.targetSide] === 'number') {
    const incomingEdgesOnSide = incomingEdges.filter((edge) => edge.toSide === options.targetSide)

    if (incomingEdgesOnSide.length >= (targetRule.maxIncomingPerSide[options.targetSide] ?? 0)) {
      return { valid: false, reason: `${targetNode.type} already uses the ${options.targetSide} connector.` }
    }
  }

  if (rule.blockedTargetTypes?.includes(targetNode.type)) {
    return { valid: false, reason: rule.reason }
  }

  if (rule.allowedTargetTypes?.includes(targetNode.type)) {
    return { valid: true }
  }

  const targetCategory = getCanvasNodeConnectionCategory(targetNode)

  if (rule.allowedTargetCategories?.includes(targetCategory)) {
    return { valid: true }
  }

  return { valid: false, reason: rule.reason }
}

export function canCanvasNodesConnect(
  sourceNode: Pick<CanvasNodeRecord, 'id' | 'type'> | null | undefined,
  targetNode: Pick<CanvasNodeRecord, 'id' | 'type'> | null | undefined,
  options?: {
    sourceSide?: CanvasConnectorSide
    targetSide?: CanvasConnectorSide
  },
) {
  return getCanvasConnectionValidation(sourceNode, targetNode, options).valid
}
