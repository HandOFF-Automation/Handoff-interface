import CanvasAllocateSidebar from '../../../components/canvas/canvas-allocate-sidebar'
import CanvasAssetSidebar from '../../../components/canvas/canvas-asset-sidebar'
import CanvasBuySidebar from '../../../components/canvas/canvas-buy-sidebar'
import CanvasElseSidebar from '../../../components/canvas/canvas-else-sidebar'
import CanvasEndSidebar from '../../../components/canvas/canvas-end-sidebar'
import CanvasFilterSidebar from '../../../components/canvas/canvas-filter-sidebar'
import CanvasIfSidebar from '../../../components/canvas/canvas-if-sidebar'
import CanvasLoopSidebar from '../../../components/canvas/canvas-loop-sidebar'
import CanvasRebalanceSidebar from '../../../components/canvas/canvas-rebalance-sidebar'
import CanvasScaleOutSidebar from '../../../components/canvas/canvas-scale-out-sidebar'
import CanvasSellSidebar from '../../../components/canvas/canvas-sell-sidebar'
import CanvasStartSidebar from '../../../components/canvas/canvas-start-sidebar'
import CanvasStopLossSidebar from '../../../components/canvas/canvas-stop-loss-sidebar'
import CanvasTakeProfitSidebar from '../../../components/canvas/canvas-take-profit-sidebar'
import { getCanvasAssetOptions } from '../../../components/canvas/canvas-asset-options'
import CanvasViewport from '../../../components/canvas/canvas-viewport'
import { useEffect, useRef, useState } from 'react'
import { appLoadingController } from '../../../state/app-loading-store'
import { useCanvasEdges } from '../../../state/canvas-edge-store'
import { updateCanvasActionConfig, updateCanvasAllocateConfig, updateCanvasElseConfig, updateCanvasEndConfig, updateCanvasEndType, updateCanvasFilterConfig, updateCanvasIfConfig, updateCanvasLoopConfig, updateCanvasLoopType, updateCanvasNodeAsset, updateCanvasRebalanceConfig, updateCanvasRiskConfig, updateCanvasScaleOutConfig, updateCanvasStartSpecificPercentage, updateCanvasStartWeightingType, useCanvasNodes } from '../../../state/canvas-node-store'

export default function StagingCanvasPage() {
  const { nodes, selectedNodeIds } = useCanvasNodes()
  const { edges } = useCanvasEdges()
  const [canvasName, setCanvasName] = useState('Untitled')
  const [draftCanvasName, setDraftCanvasName] = useState('Untitled')
  const [isEditingCanvasName, setIsEditingCanvasName] = useState(false)
  const [isCanvasNameHovered, setIsCanvasNameHovered] = useState(false)
  const [isSelectionSidebarEnabled, setIsSelectionSidebarEnabled] = useState(true)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const hasSelectedNodes = selectedNodeIds.length > 0
  const selectedNodesKey = selectedNodeIds.join('|')
  const selectedNode = selectedNodeIds.length === 1 ? nodes.find((node) => node.id === selectedNodeIds[0]) ?? null : null
  const isStartNodeSelected = selectedNode?.type === 'start'
  const isEndNodeSelected = selectedNode?.type === 'end'
  const isLoopNodeSelected = selectedNode?.type === 'loop'
  const isIfNodeSelected = selectedNode?.type === 'if'
  const isElseNodeSelected = selectedNode?.type === 'else'
  const isFilterNodeSelected = selectedNode?.type === 'filter'
  const isAssetNodeSelected = selectedNode?.type === 'stock' || selectedNode?.type === 'token'
  const isBuyNodeSelected = selectedNode?.type === 'buy'
  const isSellNodeSelected = selectedNode?.type === 'sell'
  const isRebalanceNodeSelected = selectedNode?.type === 'rebalance'
  const isAllocateNodeSelected = selectedNode?.type === 'allocate'
  const isScaleOutNodeSelected = selectedNode?.type === 'scaleOut'
  const isTakeProfitNodeSelected = selectedNode?.type === 'takeProfit'
  const isStopLossNodeSelected = selectedNode?.type === 'stopLoss'
  const isStartSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isStartNodeSelected
  const isEndSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isEndNodeSelected
  const isLoopSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isLoopNodeSelected
  const isIfSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isIfNodeSelected
  const isElseSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isElseNodeSelected
  const isFilterSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isFilterNodeSelected
  const isAssetSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isAssetNodeSelected
  const isBuySidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isBuyNodeSelected
  const isSellSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isSellNodeSelected
  const isRebalanceSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isRebalanceNodeSelected
  const isAllocateSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isAllocateNodeSelected
  const isScaleOutSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isScaleOutNodeSelected
  const isTakeProfitSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isTakeProfitNodeSelected
  const isStopLossSidebarActive = isSelectionSidebarEnabled && hasSelectedNodes && isStopLossNodeSelected
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
      />

      <CanvasIfSidebar
        active={isIfSidebarActive}
        node={selectedNode}
        assetNodeOptions={assetNodeOptions}
        onClose={() => setIsSelectionSidebarEnabled(false)}
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
      />

      <CanvasElseSidebar
        active={isElseSidebarActive}
        node={selectedNode}
        assetNodeOptions={assetNodeOptions}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onPrimaryFunctionChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'else') {
            return
          }

          updateCanvasElseConfig(selectedNode.id, { elsePrimaryFunction: value })
        }}
        onPrimaryAssetChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'else') {
            return
          }

          updateCanvasElseConfig(selectedNode.id, { elsePrimaryAssetNodeId: value })
        }}
        onComparatorChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'else') {
            return
          }

          updateCanvasElseConfig(selectedNode.id, { elseComparator: value })
        }}
        onComparisonTargetTypeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'else') {
            return
          }

          updateCanvasElseConfig(selectedNode.id, { elseComparisonTargetType: value })
        }}
        onComparisonValueChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'else') {
            return
          }

          updateCanvasElseConfig(selectedNode.id, { elseComparisonValue: value })
        }}
        onSecondaryFunctionChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'else') {
            return
          }

          updateCanvasElseConfig(selectedNode.id, { elseSecondaryFunction: value })
        }}
        onSecondaryAssetChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'else') {
            return
          }

          updateCanvasElseConfig(selectedNode.id, { elseSecondaryAssetNodeId: value })
        }}
      />

      <CanvasFilterSidebar
        active={isFilterSidebarActive}
        node={selectedNode}
        assetNodeOptions={assetNodeOptions}
        onClose={() => setIsSelectionSidebarEnabled(false)}
        onAssetNodeChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'filter') {
            return
          }

          updateCanvasFilterConfig(selectedNode.id, { filterAssetNodeId: value })
        }}
        onSortFunctionChange={(value) => {
          if (!selectedNode || selectedNode.type !== 'filter') {
            return
          }

          updateCanvasFilterConfig(selectedNode.id, { filterSortFunction: value })
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

          updateCanvasRiskConfig(selectedNode.id, { riskThresholdValue: value })
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

          updateCanvasRiskConfig(selectedNode.id, { riskThresholdValue: value })
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
        }}
      >
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
