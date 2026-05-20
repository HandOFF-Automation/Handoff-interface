import type { CanvasNodeType } from './canvas-tool-store'
import { commitCanvasGraphMutation, useCanvasGraph } from './canvas-graph-store'

export type CanvasNodeRecord = {
  id: string
  type: CanvasNodeType
  x: number
  y: number
  assetSymbol?: string
  assetName?: string
  startWeightingType?: CanvasStartWeightingType
  startSpecificPercentages?: Record<string, string>
  endType?: CanvasEndType
  endAssetNodeId?: string
  endOperator?: CanvasConditionOperator
  endTargetValue?: string
  endTimeValue?: string
  endTimeUnit?: CanvasTimeUnit
  loopType?: CanvasLoopType
  loopIntervalValue?: string
  loopTimeUnit?: CanvasTimeUnit
  loopDriftThreshold?: string
  loopDepositTiming?: CanvasLoopDepositTiming
  loopDepositTimeValue?: string
  loopDepositTimeUnit?: CanvasTimeUnit
  filterAssetNodeId?: string
  filterSortFunction?: CanvasFilterSortFunction
  filterOrdering?: CanvasFilterOrdering
  filterHowMany?: string
  ifPrimaryFunction?: CanvasIfFunction
  ifPrimaryAssetNodeId?: string
  ifComparator?: CanvasIfComparator
  ifComparisonTargetType?: CanvasComparisonTargetType
  ifComparisonValue?: string
  ifSecondaryFunction?: CanvasIfFunction
  ifSecondaryAssetNodeId?: string
  elsePrimaryFunction?: CanvasIfFunction
  elsePrimaryAssetNodeId?: string
  elseComparator?: CanvasIfComparator
  elseComparisonTargetType?: CanvasComparisonTargetType
  elseComparisonValue?: string
  elseSecondaryFunction?: CanvasIfFunction
  elseSecondaryAssetNodeId?: string
  actionAssetNodeId?: string
  actionAmountMode?: CanvasActionAmountMode
  actionAmountValue?: string
  rebalanceMode?: CanvasRebalanceMode
  rebalanceThreshold?: string
  allocateWeightingMode?: CanvasAllocateWeightingMode
  allocateAmountValue?: string
  scaleOutPercent?: string
  riskAssetNodeId?: string
  riskComparator?: CanvasRiskComparator
  riskThresholdValue?: string
}

export type CanvasStartWeightingType = 'equal' | 'specificPercentage' | 'marketCap'
export type CanvasEndType = 'priceReaches' | 'portfolioValue' | 'timeBased' | 'maxDrawdown' | 'dailyLoss' | 'exposureLimit' | 'positionConcentration' | 'volatilityLimit'
export type CanvasConditionOperator = '>=' | '<='
export type CanvasTimeUnit = 'day' | 'week' | 'month'
export type CanvasLoopType = 'timeInterval' | 'driftThreshold' | 'onNewDeposit'
export type CanvasLoopDepositTiming = 'directly' | 'onTime'
export type CanvasFilterSortFunction = 'currentPrice' | 'currentMarketCap' | 'volume' | 'percentGain'
export type CanvasFilterOrdering = 'top' | 'bottom'
export type CanvasIfFunction = 'currentPrice' | 'currentMarketCap' | 'volume' | 'simpleMovingAverage' | 'exponentialMovingAverage'
export type CanvasIfComparator = '>' | '<' | '>=' | '<=' | '=' | 'greater' | 'less'
export type CanvasComparisonTargetType = 'metric' | 'value'
export type CanvasActionAmountMode = 'percentage' | 'value'
export type CanvasRebalanceMode = 'equal' | 'target'
export type CanvasAllocateWeightingMode = 'percentage' | 'value'
export type CanvasRiskComparator = '>' | '<' | '>=' | '<='

export function addCanvasNode(node: CanvasNodeRecord) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: [...current.nodes, node],
    selectedNodeIds: [node.id],
    selectedEdgeIds: [],
  }))
}

export function moveCanvasNode(nodeId: string, nextPosition: { x: number; y: number }) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) => (node.id === nodeId ? { ...node, x: nextPosition.x, y: nextPosition.y } : node)),
  }))
}

export function setSelectedCanvasNodeId(nodeId: string | null) {
  const nextSelectedNodeIds = nodeId ? [nodeId] : []
  commitCanvasGraphMutation((current) => ({
    ...current,
    selectedNodeIds: nextSelectedNodeIds,
  }))
}

export function setSelectedCanvasNodeIds(nodeIds: string[]) {
  const uniqueNodeIds = Array.from(new Set(nodeIds))
  commitCanvasGraphMutation((current) => ({
    ...current,
    selectedNodeIds: uniqueNodeIds,
  }))
}

export function moveCanvasNodes(nodeIds: string[], delta: { x: number; y: number }) {
  const nodeIdSet = new Set(nodeIds)
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) => (nodeIdSet.has(node.id) ? { ...node, x: node.x + delta.x, y: node.y + delta.y } : node)),
  }))
}

export function removeCanvasNodes(nodeIds: string[]) {
  if (nodeIds.length === 0) {
    return
  }

  const nodeIdSet = new Set(nodeIds)
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.filter((node) => !nodeIdSet.has(node.id)),
    selectedNodeIds: current.selectedNodeIds.filter((nodeId) => !nodeIdSet.has(nodeId)),
    edges: current.edges.filter((edge) => !nodeIdSet.has(edge.fromNodeId) && !nodeIdSet.has(edge.toNodeId)),
    selectedEdgeIds: current.selectedEdgeIds.filter(
      (edgeId) =>
        current.edges.some(
          (edge) => edge.id === edgeId && !nodeIdSet.has(edge.fromNodeId) && !nodeIdSet.has(edge.toNodeId),
        ),
    ),
  }))
}

export function updateCanvasNodeAsset(nodeId: string, asset: { symbol: string; name: string }) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            assetSymbol: asset.symbol,
            assetName: asset.name,
          }
        : node,
    ),
  }))
}

export function updateCanvasStartWeightingType(nodeId: string, weightingType: CanvasStartWeightingType) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            startWeightingType: weightingType,
          }
        : node,
    ),
  }))
}

export function updateCanvasStartSpecificPercentage(nodeId: string, targetNodeId: string, value: string) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            startSpecificPercentages: {
              ...(node.startSpecificPercentages ?? {}),
              [targetNodeId]: value,
            },
          }
        : node,
    ),
  }))
}

export function updateCanvasEndType(nodeId: string, endType: CanvasEndType) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            endType,
          }
        : node,
    ),
  }))
}

export function updateCanvasEndConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'endAssetNodeId' | 'endOperator' | 'endTargetValue' | 'endTimeValue' | 'endTimeUnit'>>,
) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            ...config,
          }
        : node,
    ),
  }))
}

export function updateCanvasLoopType(nodeId: string, loopType: CanvasLoopType) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            loopType,
          }
        : node,
    ),
  }))
}

export function updateCanvasLoopConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'loopIntervalValue' | 'loopTimeUnit' | 'loopDriftThreshold' | 'loopDepositTiming' | 'loopDepositTimeValue' | 'loopDepositTimeUnit'>>,
) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            ...config,
          }
        : node,
    ),
  }))
}

export function updateCanvasFilterConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'filterAssetNodeId' | 'filterSortFunction' | 'filterOrdering' | 'filterHowMany'>>,
) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            ...config,
          }
        : node,
    ),
  }))
}

export function updateCanvasIfConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'ifPrimaryFunction' | 'ifPrimaryAssetNodeId' | 'ifComparator' | 'ifComparisonTargetType' | 'ifComparisonValue' | 'ifSecondaryFunction' | 'ifSecondaryAssetNodeId'>>,
) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            ...config,
          }
        : node,
    ),
  }))
}

export function updateCanvasElseConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'elsePrimaryFunction' | 'elsePrimaryAssetNodeId' | 'elseComparator' | 'elseComparisonTargetType' | 'elseComparisonValue' | 'elseSecondaryFunction' | 'elseSecondaryAssetNodeId'>>,
) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            ...config,
          }
        : node,
    ),
  }))
}

export function updateCanvasActionConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'actionAssetNodeId' | 'actionAmountMode' | 'actionAmountValue'>>,
) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            ...config,
          }
        : node,
    ),
  }))
}

export function updateCanvasRebalanceConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'rebalanceMode' | 'rebalanceThreshold'>>,
) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            ...config,
          }
        : node,
    ),
  }))
}

export function updateCanvasAllocateConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'allocateWeightingMode' | 'allocateAmountValue'>>,
) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            ...config,
          }
        : node,
    ),
  }))
}

export function updateCanvasScaleOutConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'scaleOutPercent'>>,
) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            ...config,
          }
        : node,
    ),
  }))
}

export function updateCanvasRiskConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'riskAssetNodeId' | 'riskComparator' | 'riskThresholdValue'>>,
) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            ...config,
          }
        : node,
    ),
  }))
}

export function useCanvasNodes() {
  const snapshot = useCanvasGraph()

  return {
    nodes: snapshot.nodes,
    selectedNodeIds: snapshot.selectedNodeIds,
  }
}
