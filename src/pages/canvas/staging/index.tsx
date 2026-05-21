import CanvasAllocateSidebar from '../../../components/canvas/canvas-allocate-sidebar'
import CanvasAssetSidebar from '../../../components/canvas/canvas-asset-sidebar'
import CanvasAssetBasketSidebar from '../../../components/canvas/canvas-asset-basket-sidebar'
import CanvasBuySidebar from '../../../components/canvas/canvas-buy-sidebar'
import CanvasCashReserveSidebar from '../../../components/canvas/canvas-cash-reserve-sidebar'
import CanvasCooldownSidebar from '../../../components/canvas/canvas-cooldown-sidebar'
import CanvasElseSidebar from '../../../components/canvas/canvas-else-sidebar'
import CanvasEndSidebar from '../../../components/canvas/canvas-end-sidebar'
import CanvasExposureLimitSidebar from '../../../components/canvas/canvas-exposure-limit-sidebar'
import CanvasFilterSidebar from '../../../components/canvas/canvas-filter-sidebar'
import CanvasIfSidebar from '../../../components/canvas/canvas-if-sidebar'
import CanvasLogicAggregatorSidebar from '../../../components/canvas/canvas-logic-aggregator-sidebar'
import CanvasLoopSidebar from '../../../components/canvas/canvas-loop-sidebar'
import CanvasPortfolioConditionSidebar from '../../../components/canvas/canvas-portfolio-condition-sidebar'
import CanvasPositionCountLimitSidebar from '../../../components/canvas/canvas-position-count-limit-sidebar'
import CanvasPositionLimitSidebar from '../../../components/canvas/canvas-position-limit-sidebar'
import CanvasPauseTradingSidebar from '../../../components/canvas/canvas-pause-trading-sidebar'
import CanvasRebalanceSidebar from '../../../components/canvas/canvas-rebalance-sidebar'
import CanvasScaleOutSidebar from '../../../components/canvas/canvas-scale-out-sidebar'
import CanvasSellSidebar from '../../../components/canvas/canvas-sell-sidebar'
import CanvasStartSidebar from '../../../components/canvas/canvas-start-sidebar'
import CanvasStopLossSidebar from '../../../components/canvas/canvas-stop-loss-sidebar'
import CanvasTakeProfitSidebar from '../../../components/canvas/canvas-take-profit-sidebar'
import CanvasWaitSidebar from '../../../components/canvas/canvas-wait-sidebar'
import { getCanvasAssetOptions } from '../../../components/canvas/canvas-asset-options'
import CanvasViewport from '../../../components/canvas/canvas-viewport'
import { canvasTemplates, getCanvasTemplateById } from '../../../config/canvas-template/config'
import { useEffect, useRef, useState } from 'react'
import { appLoadingController } from '../../../state/app-loading-store'
import { useCanvasEdges } from '../../../state/canvas-edge-store'
import { replaceCanvasGraph } from '../../../state/canvas-graph-store'
import { setCanvasFilterAssetNodeId, updateCanvasActionConfig, updateCanvasAllocateConfig, updateCanvasAssetBasketConfig, updateCanvasCashReserveConfig, updateCanvasCooldownConfig, updateCanvasEndConfig, updateCanvasEndType, updateCanvasExposureLimitConfig, updateCanvasFilterConfig, updateCanvasIfConfig, updateCanvasLoopConfig, updateCanvasLoopType, updateCanvasNodeAsset, updateCanvasPauseTradingConfig, updateCanvasPortfolioConditionConfig, updateCanvasPositionCountLimitConfig, updateCanvasPositionLimitConfig, updateCanvasRebalanceConfig, updateCanvasRiskConfig, updateCanvasScaleOutConfig, updateCanvasStartConfig, updateCanvasStartSpecificPercentage, updateCanvasStartWeightingType, updateCanvasWaitConfig, useCanvasNodes } from '../../../state/canvas-node-store'

export default function StagingCanvasPage() {
  const { nodes, selectedNodeIds } = useCanvasNodes()
  const { edges } = useCanvasEdges()
  const [canvasName, setCanvasName] = useState('Untitled')
  const [draftCanvasName, setDraftCanvasName] = useState('Untitled')
  const [isEditingCanvasName, setIsEditingCanvasName] = useState(false)
  const [isCanvasNameHovered, setIsCanvasNameHovered] = useState(false)
  const [isSelectionSidebarEnabled, setIsSelectionSidebarEnabled] = useState(true)
  const [selectedTemplateId, setSelectedTemplateId] = useState<(typeof canvasTemplates)[number]['id']>('realStrategy')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const hasSelectedNodes = selectedNodeIds.length > 0
  const selectedNodesKey = selectedNodeIds.join('|')
  const selectedNode = selectedNodeIds.length === 1 ? nodes.find((node) => node.id === selectedNodeIds[0]) ?? null : null
  const isStartNodeSelected = selectedNode?.type === 'start'
  const isEndNodeSelected = selectedNode?.type === 'end'
  const isLoopNodeSelected = selectedNode?.type === 'loop'
  const isIfNodeSelected = selectedNode?.type === 'if'
  const isElseNodeSelected = selectedNode?.type === 'else'
  const isAndNodeSelected = selectedNode?.type === 'and'
  const isOrNodeSelected = selectedNode?.type === 'or'
  const isNotNodeSelected = selectedNode?.type === 'not'
  const isXorNodeSelected = selectedNode?.type === 'xor'
  const isIntersectNodeSelected = selectedNode?.type === 'intersect'
  const isUnionNodeSelected = selectedNode?.type === 'union'
  const isExcludeNodeSelected = selectedNode?.type === 'exclude'
  const isFilterNodeSelected = selectedNode?.type === 'filter'
  const isPortfolioConditionNodeSelected = selectedNode?.type === 'portfolioCondition'
  const isAssetNodeSelected = selectedNode?.type === 'stock' || selectedNode?.type === 'token'
  const isAssetBasketNodeSelected = selectedNode?.type === 'assetBasket'
  const isBuyNodeSelected = selectedNode?.type === 'buy'
  const isSellNodeSelected = selectedNode?.type === 'sell'
  const isRebalanceNodeSelected = selectedNode?.type === 'rebalance'
  const isAllocateNodeSelected = selectedNode?.type === 'allocate'
  const isScaleOutNodeSelected = selectedNode?.type === 'scaleOut'
  const isTakeProfitNodeSelected = selectedNode?.type === 'takeProfit'
  const isStopLossNodeSelected = selectedNode?.type === 'stopLoss'
  const isCooldownNodeSelected = selectedNode?.type === 'cooldown'
  const isWaitNodeSelected = selectedNode?.type === 'wait'
  const isPauseTradingNodeSelected = selectedNode?.type === 'pauseTrading'
  const isPositionLimitNodeSelected = selectedNode?.type === 'positionLimit'
  const isPositionCountLimitNodeSelected = selectedNode?.type === 'positionCountLimit'
  const isExposureLimitNodeSelected = selectedNode?.type === 'exposureLimit'
  const isCashReserveNodeSelected = selectedNode?.type === 'cashReserve'
  const isStartSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isStartNodeSelected
  const isEndSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isEndNodeSelected
  const isLoopSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isLoopNodeSelected
  const isIfSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isIfNodeSelected
  const isElseSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isElseNodeSelected
  const isLogicAggregatorSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && (isAndNodeSelected || isOrNodeSelected || isNotNodeSelected || isXorNodeSelected || isIntersectNodeSelected || isUnionNodeSelected || isExcludeNodeSelected)
  const isFilterSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isFilterNodeSelected
  const isPortfolioConditionSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isPortfolioConditionNodeSelected
  const isAssetSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isAssetNodeSelected
  const isAssetBasketSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isAssetBasketNodeSelected
  const isBuySidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isBuyNodeSelected
  const isSellSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isSellNodeSelected
  const isRebalanceSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isRebalanceNodeSelected
  const isAllocateSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isAllocateNodeSelected
  const isScaleOutSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isScaleOutNodeSelected
  const isTakeProfitSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isTakeProfitNodeSelected
  const isStopLossSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isStopLossNodeSelected
  const isCooldownSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isCooldownNodeSelected
  const isWaitSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isWaitNodeSelected
  const isPauseTradingSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isPauseTradingNodeSelected
  const isPositionLimitSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isPositionLimitNodeSelected
  const isPositionCountLimitSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isPositionCountLimitNodeSelected
  const isExposureLimitSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isExposureLimitNodeSelected
  const isCashReserveSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isCashReserveNodeSelected
  const assetNodeOptions = nodes.flatMap((node) =>
    node.type === 'stock' || node.type === 'token'
      ? [{ id: node.id, type: node.type, assetSymbol: node.assetSymbol, assetName: node.assetName }]
      : [],
  )
  const connectedMarketNodes = (() => {
    if (!selectedNode || selectedNode.type !== 'start') {
      return []
    }

    const visitedNodeIds = new Set<string>()
    const discoveredMarketNodeIds = new Set<string>()
    const queue = [selectedNode.id]

    while (queue.length > 0) {
      const currentNodeId = queue.shift()

      if (!currentNodeId || visitedNodeIds.has(currentNodeId)) {
        continue
      }

      visitedNodeIds.add(currentNodeId)

      const outgoingEdges = edges.filter((edge) => edge.fromNodeId === currentNodeId)

      outgoingEdges.forEach((edge) => {
        const targetNode = nodes.find((node) => node.id === edge.toNodeId)

        if (!targetNode) {
          return
        }

        if (targetNode.type === 'stock' || targetNode.type === 'token') {
          discoveredMarketNodeIds.add(targetNode.id)
        }

        if (!visitedNodeIds.has(targetNode.id)) {
          queue.push(targetNode.id)
        }
      })
    }

    return nodes.flatMap((node) =>
      discoveredMarketNodeIds.has(node.id) && (node.type === 'stock' || node.type === 'token')
        ? [{ id: node.id, type: node.type, assetSymbol: node.assetSymbol, assetName: node.assetName }]
        : [],
    )
  })()
  const connectedFilterAssetNodes = (() => {
    if (!selectedNode || selectedNode.type !== 'filter') {
      return []
    }

    const sourceNodeIds = edges
      .filter((edge) => edge.toNodeId === selectedNode.id)
      .map((edge) => edge.fromNodeId)

    return nodes.flatMap((node) =>
      sourceNodeIds.includes(node.id) && (node.type === 'stock' || node.type === 'token' || node.type === 'assetBasket')
        ? [{ id: node.id, type: node.type, assetSymbol: node.assetSymbol, assetName: node.assetName ?? node.assetBasketName }]
        : [],
    )
  })()

  useEffect(() => {
    appLoadingController.start('Connecting to strategy workspace', 10)

    const firstStep = window.setTimeout(() => {
      appLoadingController.update(34, 'Loading strategy graph')
    }, 380)

    const secondStep = window.setTimeout(() => {
      appLoadingController.update(62, 'Syncing AI providers')
    }, 920)

    const thirdStep = window.setTimeout(() => {
      appLoadingController.update(84, 'Preparing collaboration layer')
    }, 1460)

    const finishStep = window.setTimeout(() => {
      appLoadingController.finish()
    }, 2180)

    return () => {
      window.clearTimeout(firstStep)
      window.clearTimeout(secondStep)
      window.clearTimeout(thirdStep)
      window.clearTimeout(finishStep)
    }
  }, [])

  useEffect(() => {
    if (!isEditingCanvasName) {
      return
    }

    inputRef.current?.focus()
    inputRef.current?.select()
  }, [isEditingCanvasName])

  useEffect(() => {
    if (!hasSelectedNodes) {
      setIsSelectionSidebarEnabled(true)
      return
    }

    setIsSelectionSidebarEnabled(true)
  }, [hasSelectedNodes, selectedNodesKey])

  useEffect(() => {
    if (!selectedNode || selectedNode.type !== 'filter') {
      return
    }

    if (selectedNode.filterAssetNodeId || connectedFilterAssetNodes.length === 0) {
      return
    }

    setCanvasFilterAssetNodeId(selectedNode.id, connectedFilterAssetNodes[0].id)
  }, [connectedFilterAssetNodes, selectedNode])

  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      return
    }

    replaceCanvasGraph(getCanvasTemplateById(selectedTemplateId).snapshot)
  }, [edges.length, nodes.length, selectedTemplateId])

  const commitCanvasName = () => {
    const nextName = draftCanvasName.trim()
    setCanvasName(nextName.length > 0 ? nextName : 'Untitled')
    setDraftCanvasName(nextName.length > 0 ? nextName : 'Untitled')
    setIsEditingCanvasName(false)
  }

  const cancelCanvasNameEdit = () => {
    setDraftCanvasName(canvasName)
    setIsEditingCanvasName(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <CanvasViewport />
      </div>

      <CanvasStartSidebar
        active={isStartSidebarActive}
        node={selectedNode}
        connectedMarketNodes={connectedMarketNodes}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onWeightingChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'start') {
            return
          }

          updateCanvasStartWeightingType(selectedNode.id, value)
        }}
        onSpecificPercentageChange={(targetNodeId, value) => {
          if (!selectedNode || selectedNode.type !== 'start') {
            return
          }

          updateCanvasStartSpecificPercentage(selectedNode.id, targetNodeId, value)
        }}
        onReserveCashChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'start') {
            return
          }

          updateCanvasStartConfig(selectedNode.id, { startReserveCashPercent: value })
        }}
        onEntryLimitChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'start') {
            return
          }

          updateCanvasStartConfig(selectedNode.id, { startEntryLimit: value })
        }}
        onStartStyleChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'start') {
            return
          }

          updateCanvasStartConfig(selectedNode.id, { startStyle: value })
        }}
      />

      <CanvasEndSidebar
        active={isEndSidebarActive}
        node={selectedNode}
        assetNodeOptions={assetNodeOptions}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onEndTypeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'end') {
            return
          }

          updateCanvasEndType(selectedNode.id, value)
        }}
        onEndAssetNodeChange={(nodeId) => {
          if (!selectedNode || selectedNode.type !== 'end') {
            return
          }

          updateCanvasEndConfig(selectedNode.id, { endAssetNodeId: nodeId })
        }}
        onEndOperatorChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'end') {
            return
          }

          updateCanvasEndConfig(selectedNode.id, { endOperator: value })
        }}
        onEndTargetValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'end') {
            return
          }

          updateCanvasEndConfig(selectedNode.id, { endTargetValue: value })
        }}
        onEndTimeValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'end') {
            return
          }

          updateCanvasEndConfig(selectedNode.id, { endTimeValue: value })
        }}
        onEndTimeUnitChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'end') {
            return
          }

          updateCanvasEndConfig(selectedNode.id, { endTimeUnit: value })
        }}
        onEndScopeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'end') {
            return
          }

          updateCanvasEndConfig(selectedNode.id, { endScope: value })
        }}
      />

      <CanvasLoopSidebar
        active={isLoopSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onLoopTypeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'loop') {
            return
          }

          updateCanvasLoopType(selectedNode.id, value)
        }}
        onLoopIntervalValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'loop') {
            return
          }

          updateCanvasLoopConfig(selectedNode.id, { loopIntervalValue: value })
        }}
        onLoopTimeUnitChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'loop') {
            return
          }

          updateCanvasLoopConfig(selectedNode.id, { loopTimeUnit: value })
        }}
        onLoopDriftThresholdChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'loop') {
            return
          }

          updateCanvasLoopConfig(selectedNode.id, { loopDriftThreshold: value })
        }}
        onLoopDepositTimingChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'loop') {
            return
          }

          updateCanvasLoopConfig(selectedNode.id, { loopDepositTiming: value })
        }}
        onLoopDepositTimeValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'loop') {
            return
          }

          updateCanvasLoopConfig(selectedNode.id, { loopDepositTimeValue: value })
        }}
        onLoopDepositTimeUnitChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'loop') {
            return
          }

          updateCanvasLoopConfig(selectedNode.id, { loopDepositTimeUnit: value })
        }}
        onLoopRunModeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'loop') {
            return
          }

          updateCanvasLoopConfig(selectedNode.id, { loopRunMode: value })
        }}
        onLoopPostActionChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'loop') {
            return
          }

          updateCanvasLoopConfig(selectedNode.id, { loopPostAction: value })
        }}
        onLoopPostActionValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'loop') {
            return
          }

          updateCanvasLoopConfig(selectedNode.id, { loopPostActionValue: value })
        }}
        onLoopPostActionUnitChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'loop') {
            return
          }

          updateCanvasLoopConfig(selectedNode.id, { loopPostActionUnit: value })
        }}
      />

      <CanvasIfSidebar
        active={isIfSidebarActive}
        node={selectedNode}
        assetNodeOptions={assetNodeOptions}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onSourceTypeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifSourceType: value })
        }}
        onConditionTypeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifConditionType: value })
        }}
        onPrimaryFunctionChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifPrimaryFunction: value })
        }}
        onPrimaryAssetChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifPrimaryAssetNodeId: value })
        }}
        onComparatorChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifComparator: value })
        }}
        onComparisonTargetTypeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifComparisonTargetType: value })
        }}
        onComparisonValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifComparisonValue: value })
        }}
        onSecondaryFunctionChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifSecondaryFunction: value })
        }}
        onSecondaryAssetChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifSecondaryAssetNodeId: value })
        }}
        onPrimaryPeriodChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifPrimaryPeriod: value })
        }}
        onSecondaryPeriodChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifSecondaryPeriod: value })
        }}
        onRangeMinValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifRangeMinValue: value })
        }}
        onRangeMaxValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifRangeMaxValue: value })
        }}
        onCrossoverEventChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'if') {
            return
          }

          updateCanvasIfConfig(selectedNode.id, { ifCrossoverEvent: value })
        }}
      />

      <CanvasElseSidebar
        active={isElseSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
      />

      <CanvasLogicAggregatorSidebar
        active={isLogicAggregatorSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
      />

      <CanvasFilterSidebar
        active={isFilterSidebarActive}
        node={selectedNode}
        incomingAssetNodeOptions={connectedFilterAssetNodes}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onAssetNodeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'filter') {
            return
          }

          setCanvasFilterAssetNodeId(selectedNode.id, value)
        }}
        onSortFunctionChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'filter') {
            return
          }

          updateCanvasFilterConfig(selectedNode.id, { filterSortFunction: value })
        }}
        onSecondarySortFunctionChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'filter') {
            return
          }

          updateCanvasFilterConfig(selectedNode.id, { filterSecondarySortFunction: value })
        }}
        onConditionOperatorChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'filter') {
            return
          }

          updateCanvasFilterConfig(selectedNode.id, { filterConditionOperator: value })
        }}
        onOrderingChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'filter') {
            return
          }

          updateCanvasFilterConfig(selectedNode.id, { filterOrdering: value })
        }}
        onHowManyChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'filter') {
            return
          }

          updateCanvasFilterConfig(selectedNode.id, { filterHowMany: value })
        }}
        onSortPeriodChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'filter') {
            return
          }

          updateCanvasFilterConfig(selectedNode.id, { filterSortPeriod: value })
        }}
        onSecondarySortPeriodChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'filter') {
            return
          }

          updateCanvasFilterConfig(selectedNode.id, { filterSecondarySortPeriod: value })
        }}
        onResultModeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'filter') {
            return
          }

          updateCanvasFilterConfig(selectedNode.id, { filterResultMode: value })
        }}
      />

      <CanvasPortfolioConditionSidebar
        active={isPortfolioConditionSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onMetricChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'portfolioCondition') {
            return
          }

          updateCanvasPortfolioConditionConfig(selectedNode.id, { portfolioMetric: value })
        }}
        onComparatorChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'portfolioCondition') {
            return
          }

          updateCanvasPortfolioConditionConfig(selectedNode.id, { portfolioComparator: value })
        }}
        onValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'portfolioCondition') {
            return
          }

          updateCanvasPortfolioConditionConfig(selectedNode.id, { portfolioValue: value })
        }}
      />

      <CanvasAssetSidebar
        active={isAssetSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onAssetChange={(symbol) => {
          if (!selectedNode || (selectedNode.type !== 'stock' && selectedNode.type !== 'token')) {
            return
          }

          const asset = getCanvasAssetOptions(selectedNode.type).find((option) => option.symbol === symbol)

          if (!asset) {
            return
          }

          updateCanvasNodeAsset(selectedNode.id, asset)
        }}
      />

      <CanvasAssetBasketSidebar
        active={isAssetBasketSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onNameChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'assetBasket') {
            return
          }

          updateCanvasAssetBasketConfig(selectedNode.id, { assetBasketName: value })
        }}
      />

      <CanvasBuySidebar
        active={isBuySidebarActive}
        node={selectedNode}
        assetNodeOptions={assetNodeOptions}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onAssetChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'buy') {
            return
          }

          updateCanvasActionConfig(selectedNode.id, { actionAssetNodeId: value })
        }}
        onAmountModeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'buy') {
            return
          }

          updateCanvasActionConfig(selectedNode.id, { actionAmountMode: value })
        }}
        onAmountValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'buy') {
            return
          }

          updateCanvasActionConfig(selectedNode.id, { actionAmountValue: value })
        }}
        onBehaviorChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'buy') {
            return
          }

          updateCanvasActionConfig(selectedNode.id, { buyType: value as never })
        }}
      />

      <CanvasSellSidebar
        active={isSellSidebarActive}
        node={selectedNode}
        assetNodeOptions={assetNodeOptions}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onAssetChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'sell') {
            return
          }

          updateCanvasActionConfig(selectedNode.id, { actionAssetNodeId: value })
        }}
        onAmountModeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'sell') {
            return
          }

          updateCanvasActionConfig(selectedNode.id, { actionAmountMode: value })
        }}
        onAmountValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'sell') {
            return
          }

          updateCanvasActionConfig(selectedNode.id, { actionAmountValue: value })
        }}
        onBehaviorChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'sell') {
            return
          }

          updateCanvasActionConfig(selectedNode.id, { sellType: value as never })
        }}
      />

      <CanvasRebalanceSidebar
        active={isRebalanceSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onModeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'rebalance') {
            return
          }

          updateCanvasRebalanceConfig(selectedNode.id, { rebalanceMode: value })
        }}
        onThresholdChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'rebalance') {
            return
          }

          updateCanvasRebalanceConfig(selectedNode.id, { rebalanceThreshold: value })
        }}
        onScopeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'rebalance') {
            return
          }

          updateCanvasRebalanceConfig(selectedNode.id, { rebalanceScope: value })
        }}
      />

      <CanvasAllocateSidebar
        active={isAllocateSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onModeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'allocate') {
            return
          }

          updateCanvasAllocateConfig(selectedNode.id, { allocateWeightingMode: value })
        }}
        onAmountValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'allocate') {
            return
          }

          updateCanvasAllocateConfig(selectedNode.id, { allocateAmountValue: value })
        }}
        onStyleChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'allocate') {
            return
          }

          updateCanvasAllocateConfig(selectedNode.id, { allocateStyle: value as never })
        }}
      />

      <CanvasScaleOutSidebar
        active={isScaleOutSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onPercentChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'scaleOut') {
            return
          }

          updateCanvasScaleOutConfig(selectedNode.id, { scaleOutPercent: value })
        }}
        onModeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'scaleOut') {
            return
          }

          updateCanvasScaleOutConfig(selectedNode.id, { scaleOutMode: value })
        }}
        onStepsChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'scaleOut') {
            return
          }

          updateCanvasScaleOutConfig(selectedNode.id, { scaleOutSteps: value })
        }}
      />

      <CanvasTakeProfitSidebar
        active={isTakeProfitSidebarActive}
        node={selectedNode}
        assetNodeOptions={assetNodeOptions}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onAssetChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'takeProfit') {
            return
          }

          updateCanvasRiskConfig(selectedNode.id, { riskAssetNodeId: value })
        }}
        onComparatorChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'takeProfit') {
            return
          }

          updateCanvasRiskConfig(selectedNode.id, { riskComparator: value })
        }}
        onThresholdChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'takeProfit') {
            return
          }

          if (value.startsWith('atrPeriod:')) {
            updateCanvasRiskConfig(selectedNode.id, { riskAtrPeriod: value.slice('atrPeriod:'.length) })
            return
          }

          if (value.startsWith('atrMultiplier:')) {
            updateCanvasRiskConfig(selectedNode.id, { riskAtrMultiplier: value.slice('atrMultiplier:'.length) })
            return
          }

          updateCanvasRiskConfig(selectedNode.id, { riskThresholdValue: value })
        }}
        onModeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'takeProfit') {
            return
          }

          updateCanvasRiskConfig(selectedNode.id, { takeProfitMode: value as never })
        }}
      />

      <CanvasStopLossSidebar
        active={isStopLossSidebarActive}
        node={selectedNode}
        assetNodeOptions={assetNodeOptions}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onAssetChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'stopLoss') {
            return
          }

          updateCanvasRiskConfig(selectedNode.id, { riskAssetNodeId: value })
        }}
        onComparatorChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'stopLoss') {
            return
          }

          updateCanvasRiskConfig(selectedNode.id, { riskComparator: value })
        }}
        onThresholdChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'stopLoss') {
            return
          }

          if (value.startsWith('atrPeriod:')) {
            updateCanvasRiskConfig(selectedNode.id, { riskAtrPeriod: value.slice('atrPeriod:'.length) })
            return
          }

          if (value.startsWith('atrMultiplier:')) {
            updateCanvasRiskConfig(selectedNode.id, { riskAtrMultiplier: value.slice('atrMultiplier:'.length) })
            return
          }

          updateCanvasRiskConfig(selectedNode.id, { riskThresholdValue: value })
        }}
        onModeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'stopLoss') {
            return
          }

          updateCanvasRiskConfig(selectedNode.id, { stopLossMode: value as never })
        }}
      />

      <CanvasCooldownSidebar
        active={isCooldownSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onScopeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'cooldown') {
            return
          }

          updateCanvasCooldownConfig(selectedNode.id, { cooldownScope: value })
        }}
        onDurationChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'cooldown') {
            return
          }

          updateCanvasCooldownConfig(selectedNode.id, { cooldownDuration: value })
        }}
        onUnitChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'cooldown') {
            return
          }

          updateCanvasCooldownConfig(selectedNode.id, { cooldownUnit: value })
        }}
      />

      <CanvasWaitSidebar
        active={isWaitSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onDurationChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'wait') {
            return
          }

          updateCanvasWaitConfig(selectedNode.id, { waitDuration: value })
        }}
        onUnitChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'wait') {
            return
          }

          updateCanvasWaitConfig(selectedNode.id, { waitUnit: value })
        }}
      />

      <CanvasPauseTradingSidebar
        active={isPauseTradingSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onModeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'pauseTrading') {
            return
          }

          updateCanvasPauseTradingConfig(selectedNode.id, { pauseTradingMode: value })
        }}
        onDurationChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'pauseTrading') {
            return
          }

          updateCanvasPauseTradingConfig(selectedNode.id, { pauseTradingDuration: value })
        }}
        onUnitChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'pauseTrading') {
            return
          }

          updateCanvasPauseTradingConfig(selectedNode.id, { pauseTradingUnit: value })
        }}
        onConditionChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'pauseTrading') {
            return
          }

          updateCanvasPauseTradingConfig(selectedNode.id, { pauseTradingCondition: value })
        }}
      />

      <CanvasPositionLimitSidebar
        active={isPositionLimitSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onModeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'positionLimit') {
            return
          }

          updateCanvasPositionLimitConfig(selectedNode.id, { positionLimitMode: value })
        }}
        onApplyToChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'positionLimit') {
            return
          }

          updateCanvasPositionLimitConfig(selectedNode.id, { positionLimitApplyTo: value })
        }}
        onValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'positionLimit') {
            return
          }

          updateCanvasPositionLimitConfig(selectedNode.id, { positionLimitValue: value })
        }}
      />

      <CanvasPositionCountLimitSidebar
        active={isPositionCountLimitSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onComparatorChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'positionCountLimit') {
            return
          }

          updateCanvasPositionCountLimitConfig(selectedNode.id, { positionCountComparator: value })
        }}
        onCountChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'positionCountLimit') {
            return
          }

          updateCanvasPositionCountLimitConfig(selectedNode.id, { positionCountValue: value })
        }}
        onScopeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'positionCountLimit') {
            return
          }

          updateCanvasPositionCountLimitConfig(selectedNode.id, { positionCountScope: value })
        }}
      />

      <CanvasExposureLimitSidebar
        active={isExposureLimitSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onTypeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'exposureLimit') {
            return
          }

          updateCanvasExposureLimitConfig(selectedNode.id, { exposureLimitType: value })
        }}
        onComparatorChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'exposureLimit') {
            return
          }

          updateCanvasExposureLimitConfig(selectedNode.id, { riskComparator: value })
        }}
        onValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'exposureLimit') {
            return
          }

          updateCanvasExposureLimitConfig(selectedNode.id, { exposureLimitValue: value })
        }}
      />

      <CanvasCashReserveSidebar
        active={isCashReserveSidebarActive}
        node={selectedNode}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onPercentChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'cashReserve') {
            return
          }

          updateCanvasCashReserveConfig(selectedNode.id, { cashReservePercent: value })
        }}
        onLabelChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'cashReserve') {
            return
          }

          updateCanvasCashReserveConfig(selectedNode.id, { cashReserveLabel: value })
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            minHeight: 38,
            padding: '0 14px',
            borderRadius: 999,
            border: '1px solid var(--canvas-panel-divider)',
            background: 'var(--canvas-surface)',
            color: 'var(--canvas-text-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--canvas-font-sans)',
            fontSize: 12,
            fontWeight: 600,
            backdropFilter: 'blur(12px)',
            pointerEvents: 'auto',
          }}
        >
          <span style={{ color: 'var(--canvas-text-secondary)' }}>Template</span>
          <select
            value={selectedTemplateId}
            onChange={(event) => {
              const nextTemplateId = event.target.value as (typeof canvasTemplates)[number]['id']
              setSelectedTemplateId(nextTemplateId)
              replaceCanvasGraph(getCanvasTemplateById(nextTemplateId).snapshot)
            }}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--canvas-text-primary)',
              fontFamily: 'var(--canvas-font-sans)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title={canvasTemplates.find((template) => template.id === selectedTemplateId)?.description ?? 'Canvas template'}
          >
            {canvasTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.label}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            minHeight: 38,
            minWidth: 120,
            padding: '0 16px',
            borderRadius: 999,
            border: `1px solid ${isCanvasNameHovered && !isEditingCanvasName ? 'var(--canvas-hover-accent-strong)' : 'var(--canvas-panel-divider)'}`,
            background: isCanvasNameHovered && !isEditingCanvasName ? 'var(--canvas-surface-soft)' : 'var(--canvas-surface)',
            color: 'var(--canvas-text-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--canvas-font-sans)',
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1,
            boxSizing: 'border-box',
            backdropFilter: 'blur(12px)',
            pointerEvents: 'auto',
            whiteSpace: 'nowrap',
            transition: 'background-color 160ms ease, border-color 160ms ease, transform 160ms ease',
            transform: isCanvasNameHovered && !isEditingCanvasName ? 'translateY(-1px)' : 'translateY(0)',
          }}
          onMouseEnter={() => setIsCanvasNameHovered(true)}
          onMouseLeave={() => setIsCanvasNameHovered(false)}
        >
          {isEditingCanvasName ? (
            <input
              ref={inputRef}
              value={draftCanvasName}
              onChange={(event) => setDraftCanvasName(event.target.value)}
              onBlur={commitCanvasName}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  commitCanvasName()
                }

                if (event.key === 'Escape') {
                  event.preventDefault()
                  cancelCanvasNameEdit()
                }
              }}
              style={{
                width: '100%',
                minWidth: 88,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--canvas-text-primary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 13,
                fontWeight: 600,
                textAlign: 'center',
                padding: 0,
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraftCanvasName(canvasName)
                setIsEditingCanvasName(true)
              }}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--canvas-text-primary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 13,
                fontWeight: 600,
                padding: 0,
                margin: 0,
                cursor: 'pointer',
              }}
            >
              {isCanvasNameHovered ? 'Click to rename' : canvasName}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
