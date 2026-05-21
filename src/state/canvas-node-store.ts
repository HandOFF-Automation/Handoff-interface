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
  filterConfigsByAssetNodeId?: Record<string, CanvasFilterAssetConfig>
  filterSortFunction?: CanvasFilterSortFunction
  filterSecondarySortFunction?: CanvasFilterSortFunction
  filterConditionOperator?: CanvasFilterConditionOperator
  filterOrdering?: CanvasFilterOrdering
  filterHowMany?: string
  filterSortPeriod?: string
  filterSecondarySortPeriod?: string
  filterResultMode?: CanvasFilterResultMode
  ifSourceType?: CanvasIfSourceType
  ifConditionType?: CanvasIfConditionType
  ifPrimaryFunction?: CanvasIfFunction
  ifPrimaryAssetNodeId?: string
  ifComparator?: CanvasIfComparator
  ifComparisonTargetType?: CanvasComparisonTargetType
  ifComparisonValue?: string
  ifSecondaryFunction?: CanvasIfFunction
  ifSecondaryAssetNodeId?: string
  ifPrimaryPeriod?: string
  ifSecondaryPeriod?: string
  ifRangeMinValue?: string
  ifRangeMaxValue?: string
  ifCrossoverEvent?: CanvasIfCrossoverEvent
  actionAssetNodeId?: string
  actionAmountMode?: CanvasActionAmountMode
  actionAmountValue?: string
  rebalanceMode?: CanvasRebalanceMode
  rebalanceThreshold?: string
  rebalanceScope?: CanvasRebalanceScope
  allocateWeightingMode?: CanvasAllocateWeightingMode
  allocateAmountValue?: string
  allocateStyle?: CanvasAllocateStyle
  scaleOutPercent?: string
  buyType?: CanvasBuyType
  sellType?: CanvasSellType
  riskAssetNodeId?: string
  riskComparator?: CanvasRiskComparator
  riskThresholdValue?: string
  takeProfitMode?: CanvasTakeProfitMode
  stopLossMode?: CanvasStopLossMode
  loopRunMode?: CanvasLoopRunMode
  loopPostAction?: CanvasLoopPostAction
  loopPostActionValue?: string
  loopPostActionUnit?: CanvasTimeUnit
  portfolioMetric?: CanvasPortfolioMetric
  portfolioComparator?: CanvasIfComparator
  portfolioValue?: string
  cooldownDuration?: string
  cooldownUnit?: CanvasTimeUnit
  cooldownScope?: CanvasCooldownScope
  positionLimitMode?: CanvasLimitMode
  positionLimitValue?: string
  positionLimitApplyTo?: CanvasPositionLimitApplyTo
  exposureLimitType?: CanvasExposureLimitType
  exposureLimitValue?: string
}

export type CanvasStartWeightingType = 'equal' | 'specificPercentage' | 'marketCap'
export type CanvasEndType = 'priceReaches' | 'portfolioValue' | 'timeBased' | 'maxDrawdown' | 'dailyLoss' | 'exposureLimit' | 'positionConcentration' | 'volatilityLimit'
export type CanvasConditionOperator = '>=' | '<='
export type CanvasTimeUnit = 'day' | 'week' | 'month'
export type CanvasLoopType = 'timeInterval' | 'driftThreshold' | 'onNewDeposit'
export type CanvasLoopDepositTiming = 'directly' | 'onTime'
export type CanvasLoopRunMode = 'always' | 'oncePerPeriod'
export type CanvasLoopPostAction = 'none' | 'wait' | 'cooldown'
export type CanvasFilterSortFunction = 'currentPrice' | 'currentMarketCap' | 'volume' | 'percentGain' | 'simpleMovingAverage' | 'exponentialMovingAverage' | 'rsi' | 'macdHistogram' | 'atr'
export type CanvasFilterConditionOperator = 'and' | 'or'
export type CanvasFilterOrdering = 'top' | 'bottom'
export type CanvasFilterResultMode = 'topOne' | 'topN' | 'allMatches'
export type CanvasFilterAssetConfig = {
  filterSortFunction?: CanvasFilterSortFunction
  filterSecondarySortFunction?: CanvasFilterSortFunction
  filterConditionOperator?: CanvasFilterConditionOperator
  filterOrdering?: CanvasFilterOrdering
  filterHowMany?: string
  filterSortPeriod?: string
  filterSecondarySortPeriod?: string
  filterResultMode?: CanvasFilterResultMode
}
export type CanvasIfSourceType = 'market' | 'portfolio' | 'position'
export type CanvasIfConditionType = 'threshold' | 'relative' | 'crossover' | 'range' | 'advanced'
export type CanvasIfFunction = 'currentPrice' | 'currentMarketCap' | 'volume' | 'simpleMovingAverage' | 'exponentialMovingAverage' | 'rsi' | 'macdLine' | 'macdSignal' | 'macdHistogram' | 'atr' | 'cashPercent' | 'portfolioExposure' | 'openPositions' | 'unrealizedPnl' | 'drawdownPercent' | 'positionSizePercent'
export type CanvasIfComparator = '>' | '<' | '>=' | '<=' | '='
export type CanvasIfCrossoverEvent = 'crossesAbove' | 'crossesBelow'
export type CanvasComparisonTargetType = 'metric' | 'value'
export type CanvasActionAmountMode = 'percentage' | 'value'
export type CanvasBuyType = 'open' | 'add' | 'rotateInto'
export type CanvasSellType = 'fullExit' | 'reduce' | 'takePartial'
export type CanvasRebalanceMode = 'equal' | 'target'
export type CanvasRebalanceScope = 'branch' | 'selectedAssets' | 'portfolioSet'
export type CanvasAllocateWeightingMode = 'percentage' | 'value'
export type CanvasAllocateStyle = 'targetWeight' | 'addExposure'
export type CanvasRiskComparator = '>' | '<' | '>=' | '<='
export type CanvasTakeProfitMode = 'single' | 'partial' | 'ladder'
export type CanvasStopLossMode = 'fixed' | 'trailing' | 'breakEven'
export type CanvasPortfolioMetric = 'cashPercent' | 'portfolioExposure' | 'openPositions' | 'unrealizedPnl' | 'drawdownPercent' | 'positionSizePercent'
export type CanvasCooldownScope = 'branch' | 'strategy'
export type CanvasLimitMode = 'percentage' | 'value'
export type CanvasPositionLimitApplyTo = 'singleAsset' | 'branchAssets'
export type CanvasExposureLimitType = 'assetClass' | 'basket' | 'portfolio'

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
  config: Partial<Pick<CanvasNodeRecord, 'loopIntervalValue' | 'loopTimeUnit' | 'loopDriftThreshold' | 'loopDepositTiming' | 'loopDepositTimeValue' | 'loopDepositTimeUnit' | 'loopRunMode' | 'loopPostAction' | 'loopPostActionValue' | 'loopPostActionUnit'>>,
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
  config: Partial<Pick<CanvasNodeRecord, 'filterAssetNodeId' | 'filterSortFunction' | 'filterSecondarySortFunction' | 'filterConditionOperator' | 'filterOrdering' | 'filterHowMany' | 'filterSortPeriod' | 'filterSecondarySortPeriod' | 'filterResultMode'>>,
) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) =>
      node.id === nodeId
        ? (() => {
            const nextNode = {
              ...node,
              ...config,
            }
            const activeAssetNodeId = nextNode.filterAssetNodeId?.trim() ? nextNode.filterAssetNodeId : undefined

            if (!activeAssetNodeId) {
              return nextNode
            }

            return {
              ...nextNode,
              filterConfigsByAssetNodeId: {
                ...(node.filterConfigsByAssetNodeId ?? {}),
                [activeAssetNodeId]: {
                  filterSortFunction: nextNode.filterSortFunction,
                  filterSecondarySortFunction: nextNode.filterSecondarySortFunction,
                  filterConditionOperator: nextNode.filterConditionOperator,
                  filterOrdering: nextNode.filterOrdering,
                  filterHowMany: nextNode.filterHowMany,
                  filterSortPeriod: nextNode.filterSortPeriod,
                  filterSecondarySortPeriod: nextNode.filterSecondarySortPeriod,
                  filterResultMode: nextNode.filterResultMode,
                },
              },
            }
          })()
        : node,
    ),
  }))
}

export function setCanvasFilterAssetNodeId(nodeId: string, assetNodeId: string) {
  commitCanvasGraphMutation((current) => ({
    ...current,
    nodes: current.nodes.map((node) => {
      if (node.id !== nodeId) {
        return node
      }

      const savedConfig = node.filterConfigsByAssetNodeId?.[assetNodeId]

      return {
        ...node,
        filterAssetNodeId: assetNodeId,
        filterSortFunction: savedConfig?.filterSortFunction ?? node.filterSortFunction,
        filterSecondarySortFunction: savedConfig?.filterSecondarySortFunction ?? node.filterSecondarySortFunction,
        filterConditionOperator: savedConfig?.filterConditionOperator ?? node.filterConditionOperator,
        filterOrdering: savedConfig?.filterOrdering ?? node.filterOrdering,
        filterHowMany: savedConfig?.filterHowMany ?? node.filterHowMany,
        filterSortPeriod: savedConfig?.filterSortPeriod ?? node.filterSortPeriod,
        filterSecondarySortPeriod: savedConfig?.filterSecondarySortPeriod ?? node.filterSecondarySortPeriod,
        filterResultMode: savedConfig?.filterResultMode ?? node.filterResultMode,
      }
    }),
  }))
}

export function updateCanvasIfConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'ifSourceType' | 'ifConditionType' | 'ifPrimaryFunction' | 'ifPrimaryAssetNodeId' | 'ifComparator' | 'ifComparisonTargetType' | 'ifComparisonValue' | 'ifSecondaryFunction' | 'ifSecondaryAssetNodeId' | 'ifPrimaryPeriod' | 'ifSecondaryPeriod' | 'ifRangeMinValue' | 'ifRangeMaxValue' | 'ifCrossoverEvent'>>,
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
  config: Partial<Pick<CanvasNodeRecord, 'actionAssetNodeId' | 'actionAmountMode' | 'actionAmountValue' | 'buyType' | 'sellType'>>,
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
  config: Partial<Pick<CanvasNodeRecord, 'rebalanceMode' | 'rebalanceThreshold' | 'rebalanceScope'>>,
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
  config: Partial<Pick<CanvasNodeRecord, 'allocateWeightingMode' | 'allocateAmountValue' | 'allocateStyle'>>,
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
  config: Partial<Pick<CanvasNodeRecord, 'riskAssetNodeId' | 'riskComparator' | 'riskThresholdValue' | 'takeProfitMode' | 'stopLossMode'>>,
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

export function updateCanvasPortfolioConditionConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'portfolioMetric' | 'portfolioComparator' | 'portfolioValue'>>,
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

export function updateCanvasCooldownConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'cooldownDuration' | 'cooldownUnit' | 'cooldownScope'>>,
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

export function updateCanvasPositionLimitConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'positionLimitMode' | 'positionLimitValue' | 'positionLimitApplyTo'>>,
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

export function updateCanvasExposureLimitConfig(
  nodeId: string,
  config: Partial<Pick<CanvasNodeRecord, 'exposureLimitType' | 'riskComparator' | 'exposureLimitValue'>>,
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
