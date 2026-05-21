import { ArrowCircleDownRight, ArrowCircleUpRight, ArrowsClockwise, ChartLineUp, ChartPieSlice, ClockCountdown, FlagCheckered, FunnelSimple, Percent, Play, ShieldWarning, TrendDown, TrendUp, Wallet, WaveSine } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

import DotsPattern from '../background/dots/dots-pattern'
import GridPattern from '../background/grid/grid-pattern'
import { CanvasAssetLogo } from './canvas-asset-options'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'
import AllocateNode from '../nodes/allocate/allocate-node'
import AndNode from '../nodes/and/and-node'
import BuyNode from '../nodes/buy/buy-node'
import CashReserveNode from '../nodes/cash-reserve/cash-reserve-node'
import ElseNode from '../nodes/else/else-node'
import EndNode from '../nodes/end/end-node'
import ExcludeNode from '../nodes/exclude/exclude-node'
import FilterNode from '../nodes/filter/filter-node'
import IfNode from '../nodes/if/if-node'
import IntersectNode from '../nodes/intersect/intersect-node'
import LoopNode from '../nodes/loop/loop-node'
import NotNode from '../nodes/not/not-node'
import OrNode from '../nodes/or/or-node'
import PortfolioConditionNode from '../nodes/portfolio-condition/portfolio-condition-node'
import PositionLimitNode from '../nodes/position-limit/position-limit-node'
import PositionCountLimitNode from '../nodes/position-count-limit/position-count-limit-node'
import RebalanceNode from '../nodes/rebalance/rebalance-node'
import ScaleOutNode from '../nodes/scale-out/scale-out-node'
import SellNode from '../nodes/sell/sell-node'
import StartNode from '../nodes/start/start-node'
import StopLossNode from '../nodes/stop-loss/stop-loss-node'
import StockNode from '../nodes/stock/stock-node'
import TakeProfitNode from '../nodes/take-profit/take-profit-node'
import TokenNode from '../nodes/token/token-node'
import UnionNode from '../nodes/union/union-node'
import WaitNode from '../nodes/wait/wait-node'
import XorNode from '../nodes/xor/xor-node'
import CooldownNode from '../nodes/cooldown/cooldown-node'
import ExposureLimitNode from '../nodes/exposure-limit/exposure-limit-node'
import PauseTradingNode from '../nodes/pause-trading/pause-trading-node'
import AssetBasketNode from '../nodes/asset-basket/asset-basket-node'
import CommentThreadLayer from '../comment/comment-thread-layer'
import Skeleton from '../loading/skeleton'
import { useAppLoading } from '../../state/app-loading-store'
import { addCanvasEdge, removeCanvasEdges, setSelectedCanvasEdgeIds, useCanvasEdges, type CanvasConnectorSide } from '../../state/canvas-edge-store'
import { redoCanvasGraph, undoCanvasGraph } from '../../state/canvas-graph-store'
import { addCanvasNode, moveCanvasNodes, removeCanvasNodes, setCanvasFilterAssetNodeId, setCanvasNodePositions, setSelectedCanvasNodeId, setSelectedCanvasNodeIds, useCanvasNodes, type CanvasIfFunction, type CanvasNodeRecord } from '../../state/canvas-node-store'
import { CANVAS_CONNECTION_DROP_TARGET_THRESHOLD, CANVAS_CONNECTION_INVALID_MESSAGE, CANVAS_CONNECTOR_SIDES, getCanvasConnectionValidation } from '../../config/canvas-connection'
import { getCanvasEdgeLabelForNode } from '../../config/canvas-nodes/config'
import { canvasActionShortcuts } from '../../config/keybinding/canvas-keybindings'
import { executeCanvasZoomAction, setCanvasScale, setCanvasTool, useCanvasNodeType, useCanvasScale, useCanvasTool, type CanvasNodeType, type CanvasTool } from '../../state/canvas-tool-store'
import { toggleCanvasTheme } from '../../state/theme-store'
import profileImage from '../../assets/icon/icon-dark-bg.png'
import type { CommentThread } from '../comment/comment-types'
import type { NodeShellLabelSegment } from '../nodes/shared/node-shell'
type Point = {
  x: number
  y: number
}

type ConnectorDragState = {
  pointerId: number
  fromNodeId: string
  fromSide: CanvasConnectorSide
  start: Point
}

type OrthogonalEdgeGeometry = {
  points: Point[]
  path: string
  midPoint: Point
  bounds: {
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
}

type CanvasClipboardSnapshot = {
  nodes: CanvasNodeRecord[]
  edges: Array<{
    fromNodeId: string
    fromSide: CanvasConnectorSide
    toNodeId: string
    toSide: CanvasConnectorSide
  }>
}

type AlignmentGuide = {
  verticalGuide: { x: number; fromY: number; toY: number } | null
  horizontalGuide: { y: number; fromX: number; toX: number } | null
}

type Rect = {
  left: number
  top: number
  right: number
  bottom: number
}

const TOOL_CODE_BINDINGS: Record<string, CanvasTool> = {
  KeyH: 'hand',
  KeyV: 'scale',
  KeyC: 'click',
  KeyM: 'comment',
}

const TOOL_KEY_BINDINGS: Record<string, CanvasTool> = {
  h: 'hand',
  v: 'scale',
  c: 'click',
  m: 'comment',
}

const MIN_SCALE = 0.25
const MAX_SCALE = 3
const NODE_ALIGNMENT_THRESHOLD = 8
const NODE_COLLISION_PADDING = 48
const EDGE_LABEL_PADDING = 12
const EDGE_LABEL_NUDGE_STEP = 16
const EDGE_LABEL_MAX_NUDGES = 10
const EDGE_LABEL_PROGRESS_STEP = 0.035
const EDGE_LABEL_MAX_PROGRESS_OFFSET = 0.18

const CURRENT_USER = {
  name: 'You',
  avatarSrc: profileImage,
}

const DUMMY_USER = {
  name: 'Handoff',
  avatarSrc: profileImage,
}

const AUTO_REPLY_TRIGGER = 'kamu sekarang cantikan deh?'
const AUTO_REPLY_TEXT = 'masa iya:)'
const PASTE_OFFSET = { x: 60, y: 60 }

export default function CanvasViewport() {
  const activeTool = useCanvasTool()
  const activeNodeType = useCanvasNodeType()
  const { nodes: placedNodes, selectedNodeIds } = useCanvasNodes()
  const { edges, selectedEdgeIds } = useCanvasEdges()
  const canvasScale = useCanvasScale()
  const { isLoading, progress } = useAppLoading()
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const hideCommentTimeoutRef = useRef<number | null>(null)
  const replyTimeoutsRef = useRef<Record<string, number>>({})
  const dragStateRef = useRef<{
    pointerId: number
    start: Point
    origin: Point
  } | null>(null)
  const nodeDragStateRef = useRef<{
    pointerId: number
    nodeIds: string[]
    start: Point
    lastDelta: Point
  } | null>(null)

  const selectionStateRef = useRef<{
    pointerId: number
    start: Point
  } | null>(null)
  const connectorDragStateRef = useRef<ConnectorDragState | null>(null)

  const [view, setView] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [selectionRect, setSelectionRect] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [commentThreads, setCommentThreads] = useState<CommentThread[]>([])
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [contextMenuThreadId, setContextMenuThreadId] = useState<string | null>(null)
  const [canvasContextMenuPosition, setCanvasContextMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [hoveredThreadId, setHoveredThreadId] = useState<string | null>(null)
  const [pinnedThreadId, setPinnedThreadId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [nodeSizes, setNodeSizes] = useState<Record<string, { width: number; height: number }>>({})
  const [connectorPreviewPoint, setConnectorPreviewPoint] = useState<Point | null>(null)
  const [connectorHoverTarget, setConnectorHoverTarget] = useState<{ nodeId: string; side: CanvasConnectorSide } | null>(null)
  const [invalidConnectorHoverTarget, setInvalidConnectorHoverTarget] = useState<{ nodeId: string; side: CanvasConnectorSide; reason?: string } | null>(null)
  const [invalidConnectionMessage, setInvalidConnectionMessage] = useState<string | null>(null)
  const [openFilterViewNodeId, setOpenFilterViewNodeId] = useState<string | null>(null)
  const isResolvingCollisionsRef = useRef(false)
  const preferredNodePositionsRef = useRef<Record<string, { x: number; y: number }>>({})
  const clipboardRef = useRef<CanvasClipboardSnapshot | null>(null)
  const lastCanvasPointerClientPositionRef = useRef<Point | null>(null)
  const skeletonOpacity = Math.max(0, 1 - progress / 100)
  const alignmentGuide: AlignmentGuide | null = (() => {
    const nodeDragState = nodeDragStateRef.current

    if (!nodeDragState || nodeDragState.nodeIds.length === 0) {
      return null
    }

    const draggedNode = placedNodes.find((node) => node.id === nodeDragState.nodeIds[0])

    if (!draggedNode) {
      return null
    }

    const otherNodes = placedNodes.filter((node) => !nodeDragState.nodeIds.includes(node.id))
    let verticalGuide: { x: number; fromY: number; toY: number } | null = null
    let horizontalGuide: { y: number; fromX: number; toX: number } | null = null

    otherNodes.forEach((node) => {
      if (verticalGuide === null && Math.abs(node.x - draggedNode.x) <= NODE_ALIGNMENT_THRESHOLD / view.scale) {
        verticalGuide = {
          x: node.x * view.scale + view.x,
          fromY: Math.min(node.y, draggedNode.y) * view.scale + view.y,
          toY: Math.max(node.y, draggedNode.y) * view.scale + view.y,
        }
      }

      if (horizontalGuide === null && Math.abs(node.y - draggedNode.y) <= NODE_ALIGNMENT_THRESHOLD / view.scale) {
        horizontalGuide = {
          y: node.y * view.scale + view.y,
          fromX: Math.min(node.x, draggedNode.x) * view.scale + view.x,
          toX: Math.max(node.x, draggedNode.x) * view.scale + view.x,
        }
      }
    })

    return {
      verticalGuide,
      horizontalGuide,
    }
  })()

  const getConnectorScreenPosition = (nodeId: string, node: { x: number; y: number }, side: CanvasConnectorSide): Point => {
    const size = nodeSizes[nodeId]
    const width = size?.width ?? 62
    const height = size?.height ?? 56
    const halfWidth = (width * view.scale) / 2
    const halfHeight = (height * view.scale) / 2
    const centerX = node.x * view.scale + view.x
    const centerY = node.y * view.scale + view.y

    if (side === 'top') {
      return { x: centerX, y: centerY - halfHeight }
    }

    if (side === 'right') {
      return { x: centerX + halfWidth, y: centerY }
    }

    if (side === 'bottom') {
      return { x: centerX, y: centerY + halfHeight }
    }

    return { x: centerX - halfWidth, y: centerY }
  }

  const getNodeWorldRect = (node: CanvasNodeRecord, position = { x: node.x, y: node.y }): Rect => {
    const size = nodeSizes[node.id]
    const width = size?.width ?? 62
    const height = size?.height ?? 56
    const halfWidth = width / 2
    const halfHeight = height / 2

    return {
      left: position.x - halfWidth - NODE_COLLISION_PADDING,
      right: position.x + halfWidth + NODE_COLLISION_PADDING,
      top: position.y - halfHeight - NODE_COLLISION_PADDING,
      bottom: position.y + halfHeight + NODE_COLLISION_PADDING,
    }
  }

  const rectsOverlap = (a: Rect, b: Rect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top

  const getEdgeLabelRect = (center: Point, label: string): Rect => {
    const labelScale = Math.max(0.65, Math.min(1.35, view.scale))
    const width = (Math.max(60, label.length * 7) + EDGE_LABEL_PADDING * 2) * labelScale
    const height = (26 + EDGE_LABEL_PADDING * 2) * labelScale

    return {
      left: center.x - width / 2,
      right: center.x + width / 2,
      top: center.y - height / 2,
      bottom: center.y + height / 2,
    }
  }

  const getEdgeLabelWorldRect = (center: Point, label: string): Rect => {
    const labelScale = Math.max(0.65, Math.min(1.35, view.scale))
    const width = ((Math.max(60, label.length * 7) + EDGE_LABEL_PADDING * 2) * labelScale) / view.scale
    const height = ((26 + EDGE_LABEL_PADDING * 2) * labelScale) / view.scale

    return {
      left: center.x - width / 2,
      right: center.x + width / 2,
      top: center.y - height / 2,
      bottom: center.y + height / 2,
    }
  }

  const getNodeScreenRect = (node: CanvasNodeRecord): Rect => {
    const size = nodeSizes[node.id]
    const width = (size?.width ?? 62) * view.scale + EDGE_LABEL_PADDING * 2
    const height = (size?.height ?? 56) * view.scale + EDGE_LABEL_PADDING * 2
    const centerX = node.x * view.scale + view.x
    const centerY = node.y * view.scale + view.y

    return {
      left: centerX - width / 2,
      right: centerX + width / 2,
      top: centerY - height / 2,
      bottom: centerY + height / 2,
    }
  }

  const getNodeWorldRectWithoutCollisionPadding = (node: CanvasNodeRecord): Rect => {
    const size = nodeSizes[node.id]
    const width = size?.width ?? 62
    const height = size?.height ?? 56

    return {
      left: node.x - width / 2,
      right: node.x + width / 2,
      top: node.y - height / 2,
      bottom: node.y + height / 2,
    }
  }

  const getPointAlongGeometry = (geometry: OrthogonalEdgeGeometry, progress: number): Point => {
    const clampedProgress = Math.max(0, Math.min(1, progress))
    const points = geometry.points

    if (points.length === 0) {
      return geometry.midPoint
    }

    if (points.length === 1) {
      return points[0]
    }

    const segmentLengths: number[] = []
    let totalLength = 0

    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1]
      const current = points[index]
      const length = Math.hypot(current.x - previous.x, current.y - previous.y)
      segmentLengths.push(length)
      totalLength += length
    }

    if (totalLength === 0) {
      return geometry.midPoint
    }

    let targetDistance = totalLength * clampedProgress

    for (let index = 1; index < points.length; index += 1) {
      const segmentLength = segmentLengths[index - 1]

      if (targetDistance > segmentLength) {
        targetDistance -= segmentLength
        continue
      }

      const previous = points[index - 1]
      const current = points[index]
      const ratio = segmentLength === 0 ? 0 : targetDistance / segmentLength

      return {
        x: previous.x + (current.x - previous.x) * ratio,
        y: previous.y + (current.y - previous.y) * ratio,
      }
    }

    return points[points.length - 1]
  }

  const edgeLabelPlacements = (() => {
    const occupiedRects: Rect[] = []
    const nodeRects = placedNodes.map((node) => getNodeWorldRectWithoutCollisionPadding(node))
    const placements = new Map<string, Point>()

    edges.forEach((edge) => {
      const fromNode = placedNodes.find((node) => node.id === edge.fromNodeId)
      const toNode = placedNodes.find((node) => node.id === edge.toNodeId)

      if (!fromNode || !toNode) {
        return
      }

      const edgeLabel = getCanvasEdgeLabelForNode(fromNode.type, edge.fromSide)

      if (!edgeLabel) {
        return
      }

      const fromPoint = getConnectorScreenPosition(fromNode.id, fromNode, edge.fromSide)
      const toPoint = getConnectorScreenPosition(toNode.id, toNode, edge.toSide)
      const sourceSiblingEdges = edges.filter((candidate) => candidate.fromNodeId === edge.fromNodeId && candidate.fromSide === edge.fromSide)
      const targetSiblingEdges = edges.filter((candidate) => candidate.toNodeId === edge.toNodeId && candidate.toSide === edge.toSide)
      const sourceIndex = sourceSiblingEdges.findIndex((candidate) => candidate.id === edge.id)
      const targetIndex = targetSiblingEdges.findIndex((candidate) => candidate.id === edge.id)
      const sourceOffset = sourceSiblingEdges.length > 1 ? (sourceIndex - (sourceSiblingEdges.length - 1) / 2) * 14 : 0
      const targetOffset = targetSiblingEdges.length > 1 ? (targetIndex - (targetSiblingEdges.length - 1) / 2) * 14 : 0
      const geometry = getOrthogonalEdgeGeometry(fromPoint, toPoint, edge.fromSide, edge.toSide, sourceOffset, targetOffset)

      let candidateCenter = { ...geometry.midPoint }
      let candidateRect = getEdgeLabelWorldRect({ x: candidateCenter.x / view.scale - view.x / view.scale, y: candidateCenter.y / view.scale - view.y / view.scale }, edgeLabel)

      for (let attempt = 0; attempt < EDGE_LABEL_MAX_NUDGES; attempt += 1) {
        const collides = nodeRects.some((rect) => rectsOverlap(rect, candidateRect)) || occupiedRects.some((rect) => rectsOverlap(rect, candidateRect))

        if (!collides) {
          break
        }

        const direction = attempt % 2 === 0 ? 1 : -1
        const level = Math.floor(attempt / 2) + 1
        const progressOffset = Math.min(EDGE_LABEL_MAX_PROGRESS_OFFSET, EDGE_LABEL_PROGRESS_STEP * level) * direction
        const nextProgress = 0.5 + progressOffset

        candidateCenter = getPointAlongGeometry(geometry, nextProgress)
        candidateRect = getEdgeLabelWorldRect({ x: candidateCenter.x / view.scale - view.x / view.scale, y: candidateCenter.y / view.scale - view.y / view.scale }, edgeLabel)
      }

      occupiedRects.push(candidateRect)
      placements.set(edge.id, candidateCenter)
    })

    return placements
  })()

  const resolveNodeCollisions = () => {
    const movableNodes = placedNodes.filter((node) => nodeSizes[node.id])

    if (movableNodes.length < 2) {
      return
    }

    movableNodes.forEach((node) => {
      if (!preferredNodePositionsRef.current[node.id]) {
        preferredNodePositionsRef.current[node.id] = { x: node.x, y: node.y }
      }
    })

    const nextPositions = new Map(
      movableNodes.map((node) => {
        const preferred = preferredNodePositionsRef.current[node.id]
        return [node.id, preferred ? { x: preferred.x, y: preferred.y } : { x: node.x, y: node.y }]
      }),
    )
    let hasChanges = false

    for (let iteration = 0; iteration < 12; iteration += 1) {
      let movedThisPass = false

      for (let index = 0; index < movableNodes.length; index += 1) {
        for (let compareIndex = index + 1; compareIndex < movableNodes.length; compareIndex += 1) {
          const nodeA = movableNodes[index]
          const nodeB = movableNodes[compareIndex]
          const positionA = nextPositions.get(nodeA.id) ?? { x: nodeA.x, y: nodeA.y }
          const positionB = nextPositions.get(nodeB.id) ?? { x: nodeB.x, y: nodeB.y }
          const rectA = getNodeWorldRect(nodeA, positionA)
          const rectB = getNodeWorldRect(nodeB, positionB)

          if (!rectsOverlap(rectA, rectB)) {
            continue
          }

          const overlapX = Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left)
          const overlapY = Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top)

          if (overlapX <= 0 || overlapY <= 0) {
            continue
          }

          const centerDeltaX = positionB.x - positionA.x
          const centerDeltaY = positionB.y - positionA.y

          const nodeAIsDragged = nodeDragStateRef.current?.nodeIds.includes(nodeA.id) ?? false
          const nodeBIsDragged = nodeDragStateRef.current?.nodeIds.includes(nodeB.id) ?? false

          if (overlapX <= overlapY) {
            const push = overlapX / 2 + 6
            const direction = centerDeltaX >= 0 ? 1 : -1

            if (nodeAIsDragged && !nodeBIsDragged) {
              nextPositions.set(nodeB.id, { x: positionB.x + push * direction * 2, y: positionB.y })
            } else if (!nodeAIsDragged && nodeBIsDragged) {
              nextPositions.set(nodeA.id, { x: positionA.x - push * direction * 2, y: positionA.y })
            } else {
              nextPositions.set(nodeA.id, { x: positionA.x - push * direction, y: positionA.y })
              nextPositions.set(nodeB.id, { x: positionB.x + push * direction, y: positionB.y })
            }
          } else {
            const push = overlapY / 2 + 6
            const direction = centerDeltaY >= 0 ? 1 : -1

            if (nodeAIsDragged && !nodeBIsDragged) {
              nextPositions.set(nodeB.id, { x: positionB.x, y: positionB.y + push * direction * 2 })
            } else if (!nodeAIsDragged && nodeBIsDragged) {
              nextPositions.set(nodeA.id, { x: positionA.x, y: positionA.y - push * direction * 2 })
            } else {
              nextPositions.set(nodeA.id, { x: positionA.x, y: positionA.y - push * direction })
              nextPositions.set(nodeB.id, { x: positionB.x, y: positionB.y + push * direction })
            }
          }

          movedThisPass = true
          hasChanges = true
        }
      }

      if (!movedThisPass) {
        break
      }
    }

    if (!hasChanges) {
      return
    }

    const updates = movableNodes.flatMap((node) => {
      const nextPosition = nextPositions.get(node.id)

      if (!nextPosition) {
        return []
      }

      if (Math.abs(nextPosition.x - node.x) < 0.5 && Math.abs(nextPosition.y - node.y) < 0.5) {
        return []
      }

      return [{ id: node.id, x: nextPosition.x, y: nextPosition.y }]
    })

    if (updates.length === 0) {
      return
    }

    isResolvingCollisionsRef.current = true
    setCanvasNodePositions(updates)
    window.setTimeout(() => {
      isResolvingCollisionsRef.current = false
    }, 0)
  }

  const getIfFunctionLabel = (value?: string) => {
    if (value === 'currentPrice') {
      return 'Current Price'
    }

    if (value === 'currentMarketCap') {
      return 'Current Market Cap'
    }

    if (value === 'volume') {
      return 'Volume'
    }

    if (value === 'simpleMovingAverage') {
      return 'Simple Moving Average'
    }

    if (value === 'exponentialMovingAverage') {
      return 'EMA'
    }

    if (value === 'rsi') {
      return 'RSI'
    }

    if (value === 'macdLine') {
      return 'MACD Line'
    }

    if (value === 'macdSignal') {
      return 'MACD Signal'
    }

    if (value === 'macdHistogram') {
      return 'MACD Histogram'
    }

    if (value === 'atr') {
      return 'ATR'
    }

    if (value === 'cashPercent') {
      return 'Cash %'
    }

    if (value === 'portfolioExposure') {
      return 'Portfolio Exposure %'
    }

    if (value === 'openPositions') {
      return 'Open Positions'
    }

    if (value === 'unrealizedPnl') {
      return 'Unrealized PnL %'
    }

    if (value === 'drawdownPercent') {
      return 'Drawdown %'
    }

    if (value === 'positionSizePercent') {
      return 'Position Size %'
    }

    return ''
  }

  const getIfValuePrefix = (value?: string) => {
    if (value === 'currentPrice' || value === 'currentMarketCap') {
      return '$'
    }

    return ''
  }

  const getIfMetricBadgeLabel = (value?: CanvasIfFunction, period?: string) => {
    const baseLabel = getIfFunctionLabel(value)

    if (!baseLabel) {
      return ''
    }

    const trimmedPeriod = period?.trim()

    if (!trimmedPeriod) {
      return baseLabel
    }

    if (value === 'simpleMovingAverage' || value === 'exponentialMovingAverage' || value === 'rsi' || value === 'atr') {
      return `${baseLabel} ${trimmedPeriod}`
    }

    return baseLabel
  }

  const getIfConditionSegments = (node: CanvasNodeRecord): NodeShellLabelSegment[] => {
    const primaryAssetLabel = getLinkedAssetLabel(node.ifPrimaryAssetNodeId)
    const primaryAssetIcon = getLinkedAssetIcon(node.ifPrimaryAssetNodeId)
    const secondaryAssetLabel = getLinkedAssetLabel(node.ifSecondaryAssetNodeId)
    const secondaryAssetIcon = getLinkedAssetIcon(node.ifSecondaryAssetNodeId)
    const conditionType = node.ifConditionType ?? 'threshold'
    const primaryMetricLabel = getIfMetricBadgeLabel(node.ifPrimaryFunction, node.ifPrimaryPeriod)
    const secondaryMetricLabel = getIfMetricBadgeLabel(node.ifSecondaryFunction, node.ifSecondaryPeriod)
    const valuePrefix = getIfValuePrefix(node.ifPrimaryFunction)
    const rangeMin = node.ifRangeMinValue?.trim() ?? ''
    const rangeMax = node.ifRangeMaxValue?.trim() ?? ''
    const comparisonValue = node.ifComparisonValue?.trim() ?? ''
    const crossoverLabel = node.ifCrossoverEvent === 'crossesBelow' ? 'crosses below' : 'crosses above'
    const sourceLabel = node.ifSourceType === 'portfolio' ? 'Portfolio' : node.ifSourceType === 'position' ? 'Position' : 'Market'
    const segments: NodeShellLabelSegment[] = [{ kind: 'text', text: 'If' }, { kind: 'badge', text: sourceLabel }, { kind: 'badge', text: 'When' }]

    if (!primaryMetricLabel) {
      return segments
    }

    segments.push({ kind: 'badge', text: primaryMetricLabel })

    if (primaryAssetLabel !== 'Asset') {
      segments.push({ kind: 'badge', text: primaryAssetLabel, icon: primaryAssetIcon })
    }

    if (conditionType === 'threshold') {
      segments.push({ kind: 'text', text: 'is' })
      segments.push({ kind: 'badge', text: node.ifComparator ?? '>' })
      segments.push({ kind: 'badge', text: `${valuePrefix}${comparisonValue || '0'}` })
      return segments
    }

    if (conditionType === 'relative') {
      segments.push({ kind: 'text', text: 'is' })
      segments.push({ kind: 'badge', text: node.ifComparator ?? '>' })
      if (secondaryMetricLabel) {
        segments.push({ kind: 'badge', text: secondaryMetricLabel })
      }
      if (secondaryAssetLabel !== 'Asset') {
        segments.push({ kind: 'badge', text: secondaryAssetLabel, icon: secondaryAssetIcon })
      }
      return segments
    }

    if (conditionType === 'crossover') {
      segments.push({ kind: 'text', text: crossoverLabel })
      if (secondaryMetricLabel) {
        segments.push({ kind: 'badge', text: secondaryMetricLabel })
      }
      if (secondaryAssetLabel !== 'Asset') {
        segments.push({ kind: 'badge', text: secondaryAssetLabel, icon: secondaryAssetIcon })
      }
      return segments
    }

    if (conditionType === 'range') {
      segments.push({ kind: 'text', text: 'stays in' })
      segments.push({ kind: 'badge', text: `${valuePrefix}${rangeMin || '0'}` })
      segments.push({ kind: 'text', text: 'to' })
      segments.push({ kind: 'badge', text: `${valuePrefix}${rangeMax || '0'}` })
      return segments
    }

    segments.push({ kind: 'badge', text: 'Advanced' })
    segments.push({ kind: 'text', text: 'uses' })
    segments.push({ kind: 'badge', text: node.ifComparator ?? '>' })

    if ((node.ifComparisonTargetType ?? 'metric') === 'value') {
      segments.push({ kind: 'badge', text: `${valuePrefix}${comparisonValue || '0'}` })
    } else {
      if (secondaryMetricLabel) {
        segments.push({ kind: 'badge', text: secondaryMetricLabel })
      }
      if (secondaryAssetLabel !== 'Asset') {
        segments.push({ kind: 'badge', text: secondaryAssetLabel, icon: secondaryAssetIcon })
      }
    }

    return segments
  }

  const getLinkedAssetNode = (nodeId?: string) => placedNodes.find((placedNode) => placedNode.id === nodeId)

  const getLinkedAssetLabel = (nodeId?: string) => {
    const linkedNode = getLinkedAssetNode(nodeId)
    return linkedNode?.assetSymbol ?? linkedNode?.assetName ?? 'Asset'
  }

  const getLinkedAssetIcon = (nodeId?: string) => {
    const linkedNode = getLinkedAssetNode(nodeId)

    if (linkedNode?.type === 'stock' && linkedNode.assetSymbol) {
      return <CanvasAssetLogo assetType="stock" symbol={linkedNode.assetSymbol} size={14} />
    }

    if (linkedNode?.type === 'token' && linkedNode.assetSymbol) {
      return <CanvasAssetLogo assetType="token" symbol={linkedNode.assetSymbol} size={14} />
    }

    return undefined
  }

  const getEndScopeLabel = (scope?: CanvasNodeRecord['endScope']) => {
    if (scope === 'stopPath') {
      return 'Stop Path'
    }

    if (scope === 'closeHere') {
      return 'Close Here'
    }

    return 'End Branch'
  }

  const getEndLabelSegments = (node: CanvasNodeRecord): NodeShellLabelSegment[] => {
    const scopeBadge: NodeShellLabelSegment = { kind: 'badge', text: getEndScopeLabel(node.endScope) }

    if (node.endType === 'priceReaches') {
      return [
        scopeBadge,
        { kind: 'text', text: 'Price' },
        { kind: 'badge', text: getLinkedAssetLabel(node.endAssetNodeId), icon: getLinkedAssetIcon(node.endAssetNodeId) },
        { kind: 'text', text: 'reaches' },
        { kind: 'badge', text: `${node.endOperator ?? ''} ${node.endTargetValue?.trim() ? `$${node.endTargetValue.trim()}` : '$0'}`.trim() },
      ]
    }

    if (node.endType === 'portfolioValue') {
      return [scopeBadge, { kind: 'text', text: 'Portfolio' }, { kind: 'text', text: 'reaches' }, { kind: 'badge', text: `${node.endOperator ?? ''} ${node.endTargetValue?.trim() ? `$${node.endTargetValue.trim()}` : '$0'}`.trim() }]
    }

    if (node.endType === 'timeBased') {
      return [scopeBadge, { kind: 'text', text: 'Time' }, { kind: 'text', text: 'after' }, { kind: 'badge', text: `${node.endTimeValue?.trim() ? node.endTimeValue.trim() : '0'} ${node.endTimeUnit ? node.endTimeUnit.charAt(0).toUpperCase() + node.endTimeUnit.slice(1) : 'Unit'}` }]
    }

    if (node.endType === 'maxDrawdown') {
      return [scopeBadge, { kind: 'text', text: 'Max drawdown' }, { kind: 'text', text: 'hits' }, { kind: 'badge', text: `${node.endOperator ?? '<='} ${node.endTargetValue?.trim() ? `${node.endTargetValue.trim()}%` : '0%'}`.trim() }]
    }

    if (node.endType === 'dailyLoss') {
      return [scopeBadge, { kind: 'text', text: 'Daily loss' }, { kind: 'text', text: 'hits' }, { kind: 'badge', text: `${node.endOperator ?? '<='} ${node.endTargetValue?.trim() ? `${node.endTargetValue.trim()}%` : '0%'}`.trim() }]
    }

    if (node.endType === 'exposureLimit') {
      return [scopeBadge, { kind: 'text', text: 'Exposure' }, { kind: 'text', text: 'exceeds' }, { kind: 'badge', text: `${node.endOperator ?? '>='} ${node.endTargetValue?.trim() ? `${node.endTargetValue.trim()}%` : '0%'}`.trim() }]
    }

    if (node.endType === 'positionConcentration') {
      return [scopeBadge, { kind: 'text', text: 'Position' }, { kind: 'text', text: 'exceeds' }, { kind: 'badge', text: `${node.endOperator ?? '>='} ${node.endTargetValue?.trim() ? `${node.endTargetValue.trim()}%` : '0%'}`.trim() }]
    }

    if (node.endType === 'volatilityLimit') {
      return [scopeBadge, { kind: 'text', text: 'Volatility' }, { kind: 'text', text: 'exceeds' }, { kind: 'badge', text: `${node.endOperator ?? '>='} ${node.endTargetValue?.trim() ? `${node.endTargetValue.trim()}%` : '0%'}`.trim() }]
    }

    return [{ kind: 'text', text: 'End' }]
  }

  const handleNodeMeasure = (nodeId: string, size: { width: number; height: number }) => {
    setNodeSizes((current) => {
      const previous = current[nodeId]

      if (previous && previous.width === size.width && previous.height === size.height) {
        return current
      }

      return {
        ...current,
        [nodeId]: size,
      }
    })
  }

  useEffect(() => {
    if (isResolvingCollisionsRef.current) {
      return
    }

    resolveNodeCollisions()
  }, [nodeSizes, placedNodes])

  useEffect(() => {
    const nextPreferredPositions: Record<string, { x: number; y: number }> = {}

    placedNodes.forEach((node) => {
      nextPreferredPositions[node.id] = preferredNodePositionsRef.current[node.id] ?? { x: node.x, y: node.y }
    })

    preferredNodePositionsRef.current = nextPreferredPositions
  }, [placedNodes])

  const getCommonNodeProps = (nodeId: string) => ({
    selected: selectedNodeIds.includes(nodeId),
    activeConnectorSide: connectorDragStateRef.current?.fromNodeId === nodeId
      ? connectorDragStateRef.current.fromSide
      : connectorHoverTarget?.nodeId === nodeId
        ? connectorHoverTarget.side
        : null,
    invalidConnectorSide: invalidConnectorHoverTarget?.nodeId === nodeId ? invalidConnectorHoverTarget.side : null,
    connectedConnectorSides: edges.flatMap((edge) => {
      if (edge.fromNodeId === nodeId) {
        return [edge.fromSide]
      }

      if (edge.toNodeId === nodeId) {
        return [edge.toSide]
      }

      return []
    }),
    onConnectorPointerDown: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => handleConnectorPointerDown(event, nodeId, side),
    onMeasure: (size: { width: number; height: number }) => handleNodeMeasure(nodeId, size),
  })

  const getConnectionValidation = (sourceNodeId: string, targetNodeId: string) => {
    const sourceNode = placedNodes.find((node) => node.id === sourceNodeId)
    const targetNode = placedNodes.find((node) => node.id === targetNodeId)

    return getCanvasConnectionValidation(sourceNode, targetNode)
  }

  function getOrthogonalEdgeGeometry(
    fromPoint: Point,
    toPoint: Point,
    fromSide: CanvasConnectorSide,
    toSide: CanvasConnectorSide,
    sourceOffset = 0,
    targetOffset = 0,
  ): OrthogonalEdgeGeometry {
    const points: Point[] = [{ ...fromPoint }]
    const isHorizontalStart = fromSide === 'left' || fromSide === 'right'
    const isHorizontalEnd = toSide === 'left' || toSide === 'right'
    const stubLength = 24
    const getOutwardStub = (point: Point, side: CanvasConnectorSide) => {
      if (side === 'top') {
        return { x: point.x, y: point.y - stubLength }
      }

      if (side === 'right') {
        return { x: point.x + stubLength, y: point.y }
      }

      if (side === 'bottom') {
        return { x: point.x, y: point.y + stubLength }
      }

      return { x: point.x - stubLength, y: point.y }
    }
    const fromStub = getOutwardStub(fromPoint, fromSide)
    const toStub = getOutwardStub(toPoint, toSide)
    const adjustedFromPoint = isHorizontalStart
      ? { x: fromStub.x, y: fromStub.y + sourceOffset }
      : { x: fromStub.x + sourceOffset, y: fromStub.y }
    const adjustedToPoint = isHorizontalEnd
      ? { x: toStub.x, y: toStub.y + targetOffset }
      : { x: toStub.x + targetOffset, y: toStub.y }
    const directCorner = isHorizontalStart
      ? { x: adjustedToPoint.x, y: adjustedFromPoint.y }
      : { x: adjustedFromPoint.x, y: adjustedToPoint.y }

    if (fromStub.x !== fromPoint.x || fromStub.y !== fromPoint.y) {
      points.push(fromStub)
    }

    if (adjustedFromPoint.x !== fromStub.x || adjustedFromPoint.y !== fromStub.y) {
      points.push(adjustedFromPoint)
    }

    if ((directCorner.x !== adjustedFromPoint.x || directCorner.y !== adjustedFromPoint.y) && (directCorner.x !== adjustedToPoint.x || directCorner.y !== adjustedToPoint.y)) {
      points.push(directCorner)
    } else {
      const middlePoint = isHorizontalStart && isHorizontalEnd
        ? { x: (adjustedFromPoint.x + adjustedToPoint.x) / 2, y: adjustedFromPoint.y }
        : !isHorizontalStart && !isHorizontalEnd
          ? { x: adjustedFromPoint.x, y: (adjustedFromPoint.y + adjustedToPoint.y) / 2 }
          : directCorner

      if (middlePoint.x !== adjustedFromPoint.x || middlePoint.y !== adjustedFromPoint.y) {
        points.push(middlePoint)
      }
    }

    if (adjustedToPoint.x !== toStub.x || adjustedToPoint.y !== toStub.y) {
      points.push(adjustedToPoint)
    }

    if (toStub.x !== toPoint.x || toStub.y !== toPoint.y) {
      points.push(toStub)
    }

    points.push({ ...toPoint })

    const dedupedPoints = points.filter((point, index, current) => {
      if (index === 0) {
        return true
      }

      const previous = current[index - 1]
      return previous.x !== point.x || previous.y !== point.y
    })

    const path = dedupedPoints
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ')

    const segmentLengths: number[] = []
    let totalLength = 0

    for (let index = 1; index < dedupedPoints.length; index += 1) {
      const previous = dedupedPoints[index - 1]
      const current = dedupedPoints[index]
      const segmentLength = Math.hypot(current.x - previous.x, current.y - previous.y)
      segmentLengths.push(segmentLength)
      totalLength += segmentLength
    }

    const visualCenter = {
      x: (fromPoint.x + toPoint.x) / 2,
      y: (fromPoint.y + toPoint.y) / 2,
    }
    let midPoint = dedupedPoints[Math.floor(dedupedPoints.length / 2)] ?? fromPoint
    let closestDistance = Number.POSITIVE_INFINITY

    for (let index = 1; index < dedupedPoints.length; index += 1) {
      const previous = dedupedPoints[index - 1]
      const current = dedupedPoints[index]
      const deltaX = current.x - previous.x
      const deltaY = current.y - previous.y
      const segmentLengthSquared = deltaX * deltaX + deltaY * deltaY

      if (segmentLengthSquared === 0) {
        continue
      }

      const projection = ((visualCenter.x - previous.x) * deltaX + (visualCenter.y - previous.y) * deltaY) / segmentLengthSquared
      const ratio = Math.max(0, Math.min(1, projection))
      const candidatePoint = {
        x: previous.x + deltaX * ratio,
        y: previous.y + deltaY * ratio,
      }
      const distance = Math.hypot(candidatePoint.x - visualCenter.x, candidatePoint.y - visualCenter.y)

      if (distance < closestDistance) {
        closestDistance = distance
        midPoint = candidatePoint
      }
    }

    const xs = dedupedPoints.map((point) => point.x)
    const ys = dedupedPoints.map((point) => point.y)

    return {
      points: dedupedPoints,
      path,
      midPoint,
      bounds: {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys),
      },
    }
  }

  const getConnectorDropTarget = (clientX: number, clientY: number, sourceNodeId: string, sourceSide: CanvasConnectorSide) => {
    const viewportRect = viewportRef.current?.getBoundingClientRect()

    if (!viewportRect) {
      return null
    }

    const localX = clientX - viewportRect.left
    const localY = clientY - viewportRect.top
    const threshold = CANVAS_CONNECTION_DROP_TARGET_THRESHOLD
    const candidates: Array<{ nodeId: string; side: CanvasConnectorSide; valid: true } | { nodeId: string; side: CanvasConnectorSide; valid: false; reason?: string; distance: number }> = []
    const validCandidates: Array<{ nodeId: string; side: CanvasConnectorSide; valid: true; distance: number }> = []

    for (const node of placedNodes) {
      for (const side of CANVAS_CONNECTOR_SIDES) {
        if (node.id === sourceNodeId && side === sourceSide) {
          continue
        }

        const point = getConnectorScreenPosition(node.id, node, side)
        const dx = point.x - localX
        const dy = point.y - localY
        const distance = Math.hypot(dx, dy)

        if (distance <= threshold) {
          const sourceNode = placedNodes.find((placedNode) => placedNode.id === sourceNodeId)
          const validation = getCanvasConnectionValidation(sourceNode, node, { sourceSide, targetSide: side, edges })

          if (!validation.valid) {
            candidates.push({ nodeId: node.id, side, valid: false as const, reason: validation.reason, distance })
            continue
          }

          validCandidates.push({ nodeId: node.id, side, valid: true as const, distance })
        }
      }
    }

    if (validCandidates.length > 0) {
      validCandidates.sort((left, right) => left.distance - right.distance)
      const bestCandidate = validCandidates[0]
      return { nodeId: bestCandidate.nodeId, side: bestCandidate.side, valid: true as const }
    }

    if (candidates.length > 0) {
      candidates.sort((left, right) => left.distance - right.distance)
      const bestCandidate = candidates[0]
      return { nodeId: bestCandidate.nodeId, side: bestCandidate.side, valid: false as const, reason: bestCandidate.reason }
    }

    return null
  }

  const closeCommentContextMenu = () => {
    setContextMenuPosition(null)
    setContextMenuThreadId(null)
  }

  const closeCanvasContextMenu = () => {
    setCanvasContextMenuPosition(null)
  }

  const updateLastCanvasPointerClientPosition = (clientX: number, clientY: number) => {
    lastCanvasPointerClientPositionRef.current = { x: clientX, y: clientY }
  }

  const copySelectedCanvasNodes = () => {
    if (selectedNodeIds.length === 0) {
      return
    }

    const selectedNodeIdSet = new Set(selectedNodeIds)
    const nodesToCopy = placedNodes
      .filter((node) => selectedNodeIdSet.has(node.id))
      .map((node) => ({ ...node }))
    const edgesToCopy = edges
      .filter((edge) => selectedNodeIdSet.has(edge.fromNodeId) && selectedNodeIdSet.has(edge.toNodeId))
      .map((edge) => ({
        fromNodeId: edge.fromNodeId,
        fromSide: edge.fromSide,
        toNodeId: edge.toNodeId,
        toSide: edge.toSide,
      }))

    clipboardRef.current = {
      nodes: nodesToCopy,
      edges: edgesToCopy,
    }
  }

  const pasteCanvasNodes = (targetClientPoint?: Point | null) => {
    const clipboard = clipboardRef.current

    if (!clipboard || clipboard.nodes.length === 0) {
      return
    }

    const viewportRect = viewportRef.current?.getBoundingClientRect()
    const pasteClientPoint = targetClientPoint ?? canvasContextMenuPosition ?? lastCanvasPointerClientPositionRef.current
    const clipboardBounds = clipboard.nodes.reduce<Rect>((bounds, node) => ({
      left: Math.min(bounds.left, node.x),
      top: Math.min(bounds.top, node.y),
      right: Math.max(bounds.right, node.x),
      bottom: Math.max(bounds.bottom, node.y),
    }), {
      left: clipboard.nodes[0].x,
      top: clipboard.nodes[0].y,
      right: clipboard.nodes[0].x,
      bottom: clipboard.nodes[0].y,
    })
    const clipboardCenter = {
      x: (clipboardBounds.left + clipboardBounds.right) / 2,
      y: (clipboardBounds.top + clipboardBounds.bottom) / 2,
    }
    const pasteAnchor = viewportRect && pasteClientPoint
      ? {
          x: (pasteClientPoint.x - viewportRect.left - view.x) / view.scale,
          y: (pasteClientPoint.y - viewportRect.top - view.y) / view.scale,
        }
      : null
    const pasteDelta = pasteAnchor
      ? {
          x: pasteAnchor.x - clipboardCenter.x,
          y: pasteAnchor.y - clipboardCenter.y,
        }
      : PASTE_OFFSET

    const idMap = new Map<string, string>()
    const pastedNodeIds: string[] = []
    const timestamp = Date.now()

    clipboard.nodes.forEach((node, index) => {
      const nextId = `node-${timestamp}-${index}`
      idMap.set(node.id, nextId)
      pastedNodeIds.push(nextId)
      const pastedNode: CanvasNodeRecord = {
        ...node,
        id: nextId,
        x: node.x + pasteDelta.x,
        y: node.y + pasteDelta.y,
      }
      addCanvasNode(pastedNode)
      preferredNodePositionsRef.current[nextId] = { x: pastedNode.x, y: pastedNode.y }
    })

    clipboard.edges.forEach((edge, index) => {
      const nextFromNodeId = idMap.get(edge.fromNodeId)
      const nextToNodeId = idMap.get(edge.toNodeId)

      if (!nextFromNodeId || !nextToNodeId) {
        return
      }

      addCanvasEdge({
        id: `edge-${timestamp}-${index}`,
        fromNodeId: nextFromNodeId,
        fromSide: edge.fromSide,
        toNodeId: nextToNodeId,
        toSide: edge.toSide,
      })
    })

    setSelectedCanvasNodeIds(pastedNodeIds)
    setSelectedCanvasEdgeIds([])
  }

  const canvasContextMenuGroups = [
    {
      items: [
        { label: 'Delete', value: 'delete', shortcut: 'Del' },
        { label: 'Copy', value: 'copy', shortcut: 'Ctrl+C' },
        { label: 'Paste', value: 'paste', shortcut: 'Ctrl+V' },
      ],
    },
  ]

  const handleCanvasContextMenuAction = (value?: string) => {
    if (value === 'delete') {
      if (selectedEdgeIds.length > 0) {
        removeCanvasEdges(selectedEdgeIds)
      } else if (selectedNodeIds.length > 0) {
        removeCanvasNodes(selectedNodeIds)
      }
      closeCanvasContextMenu()
      return
    }

    if (value === 'copy') {
      copySelectedCanvasNodes()
      closeCanvasContextMenu()
      return
    }

    if (value === 'paste') {
      pasteCanvasNodes(canvasContextMenuPosition)
      closeCanvasContextMenu()
      return
    }
  }

  const handleCanvasContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    closeCommentContextMenu()
    updateLastCanvasPointerClientPosition(event.clientX, event.clientY)

    const clickedNodeElement = (event.target as HTMLElement | null)?.closest('[data-canvas-node-id]') as HTMLElement | null
    const clickedNodeId = clickedNodeElement?.dataset.canvasNodeId ?? null

    if (clickedNodeId && !selectedNodeIds.includes(clickedNodeId)) {
      setSelectedCanvasNodeIds([clickedNodeId])
      setSelectedCanvasEdgeIds([])
    }

    setCanvasContextMenuPosition({ x: event.clientX, y: event.clientY })
  }

  const handleDeleteCommentThread = (threadId: string) => {
    setCommentThreads((current) => current.filter((thread) => thread.id !== threadId))
    setDrafts((current) => {
      const next = { ...current }
      delete next[threadId]
      return next
    })
    setHoveredThreadId((current) => (current === threadId ? null : current))
    setPinnedThreadId((current) => (current === threadId ? null : current))
    closeCommentContextMenu()
    clearReplyTimeout(threadId)
  }

  const clearEmptyThread = (threadId: string | null) => {
    if (!threadId) {
      return
    }

    const thread = commentThreads.find((item) => item.id === threadId)

    if (!thread || thread.messages.length > 0) {
      return
    }

    setCommentThreads((current) => current.filter((item) => item.id !== threadId))
    setDrafts((current) => {
      const next = { ...current }
      delete next[threadId]
      return next
    })
    setHoveredThreadId((current) => (current === threadId ? null : current))
    setPinnedThreadId((current) => (current === threadId ? null : current))
  }

  const cancelCommentHideTimeout = () => {
    if (hideCommentTimeoutRef.current !== null) {
      window.clearTimeout(hideCommentTimeoutRef.current)
      hideCommentTimeoutRef.current = null
    }
  }

  const clearReplyTimeout = (threadId: string) => {
    const timeoutId = replyTimeoutsRef.current[threadId]

    if (!timeoutId) {
      return
    }

    window.clearTimeout(timeoutId)
    delete replyTimeoutsRef.current[threadId]
  }

  const scheduleAutoReply = (threadId: string, messageText: string) => {
    if (messageText.trim().toLowerCase() !== AUTO_REPLY_TRIGGER) {
      return
    }

    clearReplyTimeout(threadId)

    setCommentThreads((current) =>
      current.map((thread) => (thread.id === threadId ? { ...thread, isTyping: true } : thread)),
    )
    setHoveredThreadId(threadId)

    replyTimeoutsRef.current[threadId] = window.setTimeout(() => {
      setCommentThreads((current) =>
        current.map((thread) => {
          if (thread.id !== threadId) {
            return thread
          }

          return {
            ...thread,
            isTyping: false,
            messages: [
              ...thread.messages,
              {
                id: `${threadId}-message-${Date.now()}-dummy`,
                authorName: DUMMY_USER.name,
                authorAvatar: DUMMY_USER.avatarSrc,
                text: AUTO_REPLY_TEXT,
                createdAt: Date.now(),
              },
            ],
          }
        }),
      )
      delete replyTimeoutsRef.current[threadId]
    }, 1400)
  }

  const scheduleCommentHide = (threadId: string) => {
    cancelCommentHideTimeout()

    hideCommentTimeoutRef.current = window.setTimeout(() => {
      if (pinnedThreadId === threadId) {
        return
      }

      clearEmptyThread(threadId)
      setHoveredThreadId((current) => (current === threadId ? null : current))
      hideCommentTimeoutRef.current = null
    }, 500)
  }

  useEffect(() => {
    setView((current) => {
      if (current.scale === canvasScale) {
        return current
      }

      return { ...current, scale: canvasScale }
    })
  }, [canvasScale])

  useEffect(() => {
    if (activeTool === 'comment') {
      return
    }

    cancelCommentHideTimeout()
    clearEmptyThread(pinnedThreadId)
  }, [activeTool, pinnedThreadId, commentThreads])

  useEffect(
    () => () => {
      cancelCommentHideTimeout()
      Object.keys(replyTimeoutsRef.current).forEach((threadId) => clearReplyTimeout(threadId))
    },
    [],
  )

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()

      const viewport = viewportRef.current

      if (!viewport) {
        return
      }

      const rect = viewport.getBoundingClientRect()
      const pointerX = event.clientX - rect.left
      const pointerY = event.clientY - rect.top

      const zoomFactor = Math.exp(-event.deltaY * 0.0015)

      setView((current) => {
        const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current.scale * zoomFactor))
        setCanvasScale(nextScale)
        const scaleRatio = nextScale / current.scale

        return {
          scale: nextScale,
          x: pointerX - (pointerX - current.x) * scaleRatio,
          y: pointerY - (pointerY - current.y) * scaleRatio,
        }
      })
    }

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }

    const handlePointerMove = (event: PointerEvent) => {
      updateLastCanvasPointerClientPosition(event.clientX, event.clientY)

      const selectionState = selectionStateRef.current
      const dragState = dragStateRef.current
      const nodeDragState = nodeDragStateRef.current
      const connectorDragState = connectorDragStateRef.current

      if (connectorDragState && event.pointerId === connectorDragState.pointerId) {
        const viewportRect = viewportRef.current?.getBoundingClientRect()

        if (!viewportRect) {
          return
        }

        setConnectorPreviewPoint({
          x: event.clientX - viewportRect.left,
          y: event.clientY - viewportRect.top,
        })
        const nextDropTarget = getConnectorDropTarget(event.clientX, event.clientY, connectorDragState.fromNodeId, connectorDragState.fromSide)
        setConnectorHoverTarget(nextDropTarget?.valid ? { nodeId: nextDropTarget.nodeId, side: nextDropTarget.side } : null)
        setInvalidConnectorHoverTarget(nextDropTarget && !nextDropTarget.valid ? { nodeId: nextDropTarget.nodeId, side: nextDropTarget.side, reason: nextDropTarget.reason } : null)
        return
      }

      if (nodeDragState && event.pointerId === nodeDragState.pointerId) {
        if (!nodeDragState.hasExceededDragThreshold) {
          const rawDeltaX = event.clientX - nodeDragState.start.x
          const rawDeltaY = event.clientY - nodeDragState.start.y

          if (Math.hypot(rawDeltaX, rawDeltaY) < 4) {
            return
          }

          nodeDragStateRef.current = {
            ...nodeDragState,
            hasExceededDragThreshold: true,
          }
        }

        const nextDeltaX = (event.clientX - nodeDragState.start.x) / view.scale
        const nextDeltaY = (event.clientY - nodeDragState.start.y) / view.scale
        const stepDeltaX = nextDeltaX - nodeDragState.lastDelta.x
        const stepDeltaY = nextDeltaY - nodeDragState.lastDelta.y

        moveCanvasNodes(nodeDragState.nodeIds, {
          x: stepDeltaX,
          y: stepDeltaY,
        })
        nodeDragState.nodeIds.forEach((nodeId) => {
          const currentPreferredPosition = preferredNodePositionsRef.current[nodeId] ?? placedNodes.find((node) => node.id === nodeId)

          if (!currentPreferredPosition) {
            return
          }

          preferredNodePositionsRef.current[nodeId] = {
            x: currentPreferredPosition.x + stepDeltaX,
            y: currentPreferredPosition.y + stepDeltaY,
          }
        })
        nodeDragStateRef.current = {
          ...nodeDragState,
          lastDelta: {
            x: nextDeltaX,
            y: nextDeltaY,
          },
        }
        return
      }

      if (selectionState && event.pointerId === selectionState.pointerId) {
        const startX = selectionState.start.x
        const startY = selectionState.start.y

        const currentX = event.clientX
        const currentY = event.clientY

        setSelectionRect({
          x: Math.min(startX, currentX),
          y: Math.min(startY, currentY),
          width: Math.abs(currentX - startX),
          height: Math.abs(currentY - startY),
        })

        return
      }

      if (!dragState || event.pointerId !== dragState.pointerId) {
        return
      }

      setView((current) => ({
        ...current,
        x: dragState.origin.x + (event.clientX - dragState.start.x),
        y: dragState.origin.y + (event.clientY - dragState.start.y),
      }))
    }

    const handlePointerUp = (event: PointerEvent) => {
      const selectionState = selectionStateRef.current
      const dragState = dragStateRef.current
      const nodeDragState = nodeDragStateRef.current
      const connectorDragState = connectorDragStateRef.current

      if (connectorDragState && event.pointerId === connectorDragState.pointerId) {
        const dropTarget = getConnectorDropTarget(event.clientX, event.clientY, connectorDragState.fromNodeId, connectorDragState.fromSide)

        if (dropTarget?.valid) {
          addCanvasEdge({
            id: `edge-${Date.now()}`,
            fromNodeId: connectorDragState.fromNodeId,
            fromSide: connectorDragState.fromSide,
            toNodeId: dropTarget.nodeId,
            toSide: dropTarget.side,
          })
        } else if (dropTarget && !dropTarget.valid) {
          setInvalidConnectionMessage(dropTarget.reason ?? CANVAS_CONNECTION_INVALID_MESSAGE)
          window.setTimeout(() => {
            setInvalidConnectionMessage((current) => (current === dropTarget.reason ? null : current))
          }, 1800)
        }

        connectorDragStateRef.current = null
        setConnectorPreviewPoint(null)
        setConnectorHoverTarget(null)
        setInvalidConnectorHoverTarget(null)
        return
      }

      if (nodeDragState && event.pointerId === nodeDragState.pointerId) {
        nodeDragStateRef.current = null
        return
      }

      if (selectionState && event.pointerId === selectionState.pointerId) {
        const viewportRect = viewportRef.current?.getBoundingClientRect()
        selectionStateRef.current = null
        if (viewportRect && selectionRect) {
          const left = Math.min(selectionRect.x, selectionRect.x + selectionRect.width) - viewportRect.left
          const top = Math.min(selectionRect.y, selectionRect.y + selectionRect.height) - viewportRect.top
          const right = left + selectionRect.width
          const bottom = top + selectionRect.height

          const selectedIds = placedNodes
            .filter((node) => {
              const screenX = node.x * view.scale + view.x
              const screenY = node.y * view.scale + view.y

              return screenX >= left && screenX <= right && screenY >= top && screenY <= bottom
            })
            .map((node) => node.id)

          const selectedEdgeIds = edges
            .filter((edge) => {
              const fromNode = placedNodes.find((node) => node.id === edge.fromNodeId)
              const toNode = placedNodes.find((node) => node.id === edge.toNodeId)

              if (!fromNode || !toNode) {
                return false
              }

              const fromPoint = getConnectorScreenPosition(fromNode.id, fromNode, edge.fromSide)
              const toPoint = getConnectorScreenPosition(toNode.id, toNode, edge.toSide)
              const sourceSiblingEdges = edges.filter((candidate) => candidate.fromNodeId === edge.fromNodeId && candidate.fromSide === edge.fromSide)
              const targetSiblingEdges = edges.filter((candidate) => candidate.toNodeId === edge.toNodeId && candidate.toSide === edge.toSide)
              const sourceIndex = sourceSiblingEdges.findIndex((candidate) => candidate.id === edge.id)
              const targetIndex = targetSiblingEdges.findIndex((candidate) => candidate.id === edge.id)
              const sourceOffset = sourceSiblingEdges.length > 1 ? (sourceIndex - (sourceSiblingEdges.length - 1) / 2) * 14 : 0
              const targetOffset = targetSiblingEdges.length > 1 ? (targetIndex - (targetSiblingEdges.length - 1) / 2) * 14 : 0
              const geometry = getOrthogonalEdgeGeometry(fromPoint, toPoint, edge.fromSide, edge.toSide, sourceOffset, targetOffset)

              return geometry.bounds.maxX >= left && geometry.bounds.minX <= right && geometry.bounds.maxY >= top && geometry.bounds.minY <= bottom
            })
            .map((edge) => edge.id)

          setSelectedCanvasNodeIds(selectedIds)
          setSelectedCanvasEdgeIds(selectedEdgeIds)
        }
        setSelectionRect(null)
        return
      }

      if (!dragState || event.pointerId !== dragState.pointerId) {
        return
      }

      dragStateRef.current = null
      setIsDragging(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    viewportRef.current?.addEventListener('contextmenu', handleContextMenu)
    viewportRef.current?.addEventListener('wheel', handleWheel, { passive: false })

    const handleKeyDown = (event: KeyboardEvent) => {
      const eventTarget = event.target as HTMLElement | null
      const isTypingField =
        eventTarget?.tagName === 'INPUT' ||
        eventTarget?.tagName === 'TEXTAREA' ||
        eventTarget?.isContentEditable === true

      if (isTypingField) {
        return
      }

      if (event.key.toLowerCase() === 't') {
        event.preventDefault()
        toggleCanvasTheme()
        return
      }

      if (canvasActionShortcuts.deleteSelectedNodes.includes(event.key as 'Backspace' | 'Delete')) {
        event.preventDefault()

        if (selectedEdgeIds.length > 0) {
          removeCanvasEdges(selectedEdgeIds)
          return
        }

        if (selectedNodeIds.length === 0) {
          return
        }

        removeCanvasNodes(selectedNodeIds)
        return
      }

      const isMetaOrCtrl = event.ctrlKey || event.metaKey

      if (isMetaOrCtrl && event.key.toLowerCase() === 'z' && !event.shiftKey) {
        event.preventDefault()
        undoCanvasGraph()
        return
      }

      if (isMetaOrCtrl && event.key.toLowerCase() === 'y') {
        event.preventDefault()
        redoCanvasGraph()
        return
      }

      if (isMetaOrCtrl && event.key.toLowerCase() === 'c') {
        event.preventDefault()
        copySelectedCanvasNodes()
        return
      }

      if (isMetaOrCtrl && event.key.toLowerCase() === 'v') {
        event.preventDefault()
        pasteCanvasNodes()
        return
      }

      if (isMetaOrCtrl && event.key === '=') {
        event.preventDefault()
        executeCanvasZoomAction('zoomIn')
        return
      }

      if (isMetaOrCtrl && event.key === '-') {
        event.preventDefault()
        executeCanvasZoomAction('zoomOut')
        return
      }

      if (event.shiftKey && event.key === '0') {
        event.preventDefault()
        executeCanvasZoomAction('zoom100')
        return
      }

      if (event.shiftKey && event.key === '1') {
        event.preventDefault()
        executeCanvasZoomAction('zoomFit')
        return
      }

      if (event.shiftKey && event.key === '2') {
        event.preventDefault()
        executeCanvasZoomAction('zoomSelection')
        return
      }

      if (selectedNodeIds.length > 0 && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault()
        const delta = event.shiftKey ? 24 : 8
        const movement = event.key === 'ArrowUp'
          ? { x: 0, y: -delta }
          : event.key === 'ArrowDown'
            ? { x: 0, y: delta }
            : event.key === 'ArrowLeft'
              ? { x: -delta, y: 0 }
              : { x: delta, y: 0 }

        moveCanvasNodes(selectedNodeIds, movement)
        selectedNodeIds.forEach((nodeId) => {
          const currentPreferredPosition = preferredNodePositionsRef.current[nodeId] ?? placedNodes.find((node) => node.id === nodeId)

          if (!currentPreferredPosition) {
            return
          }

          preferredNodePositionsRef.current[nodeId] = {
            x: currentPreferredPosition.x + movement.x,
            y: currentPreferredPosition.y + movement.y,
          }
        })
        return
      }

      const nextTool = isMetaOrCtrl ? undefined : (TOOL_CODE_BINDINGS[event.code] ?? TOOL_KEY_BINDINGS[event.key.toLowerCase()])

      if (!nextTool) {
        return
      }

      event.preventDefault()
      setCanvasTool(nextTool)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      viewportRef.current?.removeEventListener('contextmenu', handleContextMenu)
      viewportRef.current?.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [edges, placedNodes, selectedEdgeIds, selectedNodeIds, selectionRect, view.scale, view.x, view.y])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    closeCommentContextMenu()
    closeCanvasContextMenu()
    setSelectedCanvasEdgeIds([])
    updateLastCanvasPointerClientPosition(event.clientX, event.clientY)

    const visibleThreadId = pinnedThreadId ?? hoveredThreadId

    if (visibleThreadId) {
      cancelCommentHideTimeout()
      clearEmptyThread(visibleThreadId)
      setPinnedThreadId(null)
      setHoveredThreadId(null)
      return
    }

    if (activeTool === 'comment') {
      if (event.button !== 0) {
        return
      }

      const threadId = `comment-${Date.now()}`
      const worldX = (event.clientX - view.x) / view.scale
      const worldY = (event.clientY - view.y) / view.scale

      setCommentThreads((current) => [
        ...current,
        {
          id: threadId,
          x: worldX,
          y: worldY,
          createdBy: CURRENT_USER.name,
          createdAt: Date.now(),
          messages: [],
        },
      ])
      cancelCommentHideTimeout()
      setPinnedThreadId(threadId)
      setHoveredThreadId(threadId)
      setDrafts((current) => ({ ...current, [threadId]: '' }))
      return
    }

    if (activeTool === 'node') {
      if (event.button !== 0) {
        return
      }

      const worldX = (event.clientX - view.x) / view.scale
      const worldY = (event.clientY - view.y) / view.scale

      addCanvasNode(createCanvasNodeDraft(activeNodeType, worldX, worldY))
      return
    }

    if (activeTool === 'click') {
      setSelectedCanvasNodeId(null)
      event.currentTarget.setPointerCapture(event.pointerId)

      selectionStateRef.current = {
        pointerId: event.pointerId,
        start: { x: event.clientX, y: event.clientY },
      }

      setSelectionRect({
        x: event.clientX,
        y: event.clientY,
        width: 0,
        height: 0,
      })

      return
    }

    if (activeTool !== 'hand') {
      return
    }

    if (event.button !== 0) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)

    dragStateRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: { x: view.x, y: view.y },
    }

    setIsDragging(true)
  }

  const handleCommentDraftChange = (threadId: string, value: string) => {
    setDrafts((current) => ({ ...current, [threadId]: value }))
  }

  const handleConnectorPointerDown = (event: React.PointerEvent<HTMLButtonElement>, nodeId: string, side: CanvasConnectorSide) => {
    event.stopPropagation()
    event.preventDefault()

    const viewportRect = viewportRef.current?.getBoundingClientRect()

    if (!viewportRect) {
      return
    }

    connectorDragStateRef.current = {
      pointerId: event.pointerId,
      fromNodeId: nodeId,
      fromSide: side,
      start: {
        x: event.clientX - viewportRect.left,
        y: event.clientY - viewportRect.top,
      },
    }
    setConnectorPreviewPoint({
      x: event.clientX - viewportRect.left,
      y: event.clientY - viewportRect.top,
    })
    setConnectorHoverTarget(null)
    setInvalidConnectorHoverTarget(null)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleNodePointerDown = (event: ReactPointerEvent<HTMLDivElement>, nodeId: string) => {
    closeCanvasContextMenu()
    event.stopPropagation()

    if (event.button !== 0) {
      return
    }

    if (connectorDragStateRef.current) {
      return
    }

    const nextSelectedNodeIds = selectedNodeIds.includes(nodeId) ? selectedNodeIds : [nodeId]
    setSelectedCanvasNodeIds(nextSelectedNodeIds)
    event.currentTarget.setPointerCapture(event.pointerId)

    nodeDragStateRef.current = {
      pointerId: event.pointerId,
      nodeIds: nextSelectedNodeIds,
      start: { x: event.clientX, y: event.clientY },
      lastDelta: { x: 0, y: 0 },
      hasExceededDragThreshold: false,
    }

    if (activeTool !== 'click') {
      return
    }
  }

  const handleCommentSend = (threadId: string) => {
    const nextDraft = drafts[threadId]?.trim()

    if (!nextDraft) {
      return
    }

    const nextMessage = {
      id: `${threadId}-message-${Date.now()}`,
      authorName: CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatarSrc,
      text: nextDraft,
      createdAt: Date.now(),
    }

    const isFirstMessage = commentThreads.find((thread) => thread.id === threadId)?.messages.length === 0

    setCommentThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? { ...thread, isTyping: false, messages: [...thread.messages, nextMessage] } : thread,
      ),
    )
    setDrafts((current) => ({ ...current, [threadId]: '' }))
    scheduleAutoReply(threadId, nextDraft)

    if (isFirstMessage) {
      cancelCommentHideTimeout()
      setPinnedThreadId(null)
      setHoveredThreadId(null)
      return
    }

    setPinnedThreadId(threadId)
    setHoveredThreadId(threadId)
  }

  return (
    <div
      ref={viewportRef}
      onPointerDown={handlePointerDown}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: 'var(--canvas-bg)',
        contain: 'strict',
        cursor:
          activeTool === 'hand'
            ? isDragging
              ? 'grabbing'
              : 'grab'
            : activeTool === 'scale'
              ? 'ns-resize'
              : 'auto',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} onContextMenu={handleCanvasContextMenu}>
        {invalidConnectionMessage ? (
          <div
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              zIndex: 6,
              maxWidth: 320,
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid var(--canvas-panel-divider)',
              background: 'color-mix(in srgb, var(--canvas-surface) 94%, transparent)',
              color: 'var(--canvas-text-primary)',
              boxShadow: 'var(--canvas-shadow-floating)',
              fontFamily: 'var(--canvas-font-sans)',
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1.45,
              backdropFilter: 'blur(12px)',
            }}
          >
            {invalidConnectionMessage}
          </div>
        ) : null}
        <div style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
          <GridPattern opacity={0.35} offsetX={view.x} offsetY={view.y} scale={view.scale} />
          <DotsPattern opacity={0.35} offsetX={view.x} offsetY={view.y} scale={view.scale} />

          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(circle at center, rgba(0,0,0,0) 35%, var(--canvas-vignette-color) 100%)',
            }}
          />

          {activeTool === 'click' && selectionRect ? (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: selectionRect.x,
                top: selectionRect.y,
                width: selectionRect.width,
                height: selectionRect.height,
                border: '1px solid var(--canvas-selection-border)',
                background: 'var(--canvas-selection-bg)',
                boxSizing: 'border-box',
                pointerEvents: 'none',
              }}
            />
          ) : null}

          {placedNodes.map((node) => (
            <div
              key={node.id}
              data-canvas-node-id={node.id}
              style={{
                position: 'absolute',
                left: node.x * view.scale + view.x,
                top: node.y * view.scale + view.y,
                transform: 'translate(-50%, -50%)',
                transformOrigin: 'center center',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              <div
                onPointerDown={(event) => handleNodePointerDown(event, node.id)}
                style={{
                  transform: `scale(${view.scale})`,
                  transformOrigin: 'center center',
                  pointerEvents: 'auto',
                  cursor: 'grab',
                }}
              >
                {node.type === 'start' ? (
                  <StartNode labelSegments={node.startWeightingType === 'marketCap' ? [{ kind: 'text', text: 'Start with' }, { kind: 'badge', text: 'Market Cap' }] : node.startWeightingType === 'specificPercentage' ? (() => {
                    const specificEntries = Object.entries(node.startSpecificPercentages ?? {})
                      .filter(([, value]) => value.trim().length > 0)
                      .map(([targetNodeId, value]) => {
                        const targetNode = placedNodes.find((placedNode) => placedNode.id === targetNodeId)
                        const targetLabel = targetNode?.assetSymbol ?? targetNode?.assetName ?? 'Asset'
                        const targetIcon = targetNode?.type === 'stock' && targetNode.assetSymbol
                          ? <CanvasAssetLogo assetType="stock" symbol={targetNode.assetSymbol} size={14} />
                          : targetNode?.type === 'token' && targetNode.assetSymbol
                            ? <CanvasAssetLogo assetType="token" symbol={targetNode.assetSymbol} size={14} />
                            : undefined

                        return {
                          assetText: targetLabel,
                          valueText: `${value}%`,
                          icon: targetIcon,
                        }
                      })

                    if (specificEntries.length === 0) {
                      return [
                        { kind: 'text' as const, text: 'Start with' },
                        { kind: 'badge' as const, text: 'Specific %' },
                      ]
                    }

                    if (specificEntries.length === 1) {
                      return [
                        { kind: 'text' as const, text: 'Start with' },
                        { kind: 'badge' as const, text: specificEntries[0].assetText, icon: specificEntries[0].icon },
                        { kind: 'text' as const, text: 'at' },
                        { kind: 'badge' as const, text: specificEntries[0].valueText },
                      ]
                    }

                    return [
                      { kind: 'text' as const, text: 'Start with' },
                      { kind: 'badge' as const, text: specificEntries[0].assetText, icon: specificEntries[0].icon },
                      { kind: 'text' as const, text: 'at' },
                      { kind: 'badge' as const, text: specificEntries[0].valueText },
                      { kind: 'text' as const, text: 'with' },
                      { kind: 'badge' as const, text: `+${specificEntries.length - 1}` },
                    ]
                  })() : node.startWeightingType === 'equal' ? [{ kind: 'text', text: 'Start with' }, { kind: 'badge', text: 'Equal' }] : [{ kind: 'text', text: 'Start' }]} icon={node.startWeightingType === 'marketCap' ? <ChartPieSlice size={18} weight="fill" /> : node.startWeightingType === 'specificPercentage' ? <Percent size={18} weight="bold" /> : node.startWeightingType === 'equal' ? <Play size={18} weight="fill" /> : undefined} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
                    setNodeSizes((current) => {
                      const previous = current[node.id]

                      if (previous && previous.width === size.width && previous.height === size.height) {
                        return current
                      }

                      return {
                        ...current,
                        [node.id]: size,
                      }
                    })
                  }} />
                ) : node.type === 'loop' ? (
                  <LoopNode labelSegments={node.loopType === 'timeInterval' ? [{ kind: 'text', text: 'Re-check in' }, { kind: 'badge', text: `${node.loopIntervalValue && node.loopIntervalValue.trim().length > 0 ? node.loopIntervalValue : '0'} ${node.loopTimeUnit ? node.loopTimeUnit.charAt(0).toUpperCase() + node.loopTimeUnit.slice(1) : 'Unit'}` }, { kind: 'badge', text: node.loopRunMode === 'oncePerPeriod' ? 'Once Per Period' : 'Always' }, ...(node.loopPostAction && node.loopPostAction !== 'none' ? [{ kind: 'badge' as const, text: node.loopPostAction === 'cooldown' ? 'Cooldown' : 'Wait' }] : [])] : node.loopType === 'driftThreshold' ? [{ kind: 'text', text: 'Re-check at' }, { kind: 'badge', text: `Drift ${node.loopDriftThreshold && node.loopDriftThreshold.trim().length > 0 ? `${node.loopDriftThreshold}%` : '0%'}` }, { kind: 'badge', text: node.loopRunMode === 'oncePerPeriod' ? 'Once Per Period' : 'Always' }] : node.loopType === 'onNewDeposit' ? node.loopDepositTiming === 'onTime' ? [{ kind: 'text', text: 'Re-check' }, { kind: 'badge', text: 'After Deposit' }, { kind: 'text', text: 'in' }, { kind: 'badge', text: `${node.loopDepositTimeValue && node.loopDepositTimeValue.trim().length > 0 ? node.loopDepositTimeValue : '0'} ${node.loopDepositTimeUnit ? node.loopDepositTimeUnit.charAt(0).toUpperCase() + node.loopDepositTimeUnit.slice(1) : 'Unit'}` }] : node.loopDepositTiming === 'directly' ? [{ kind: 'text', text: 'Re-check' }, { kind: 'badge', text: 'After Deposit' }, { kind: 'text', text: 'directly' }] : [{ kind: 'text', text: 'Re-check' }, { kind: 'badge', text: 'On New Deposit' }] : [{ kind: 'text', text: 'Loop' }]} icon={node.loopType === 'timeInterval' ? <ClockCountdown size={18} weight="fill" /> : node.loopType === 'driftThreshold' ? <FunnelSimple size={18} weight="fill" /> : node.loopType === 'onNewDeposit' ? <Wallet size={18} weight="fill" /> : <ArrowsClockwise size={18} weight="bold" />} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
                    setNodeSizes((current) => {
                      const previous = current[node.id]

                      if (previous && previous.width === size.width && previous.height === size.height) {
                        return current
                      }

                      return {
                        ...current,
                        [node.id]: size,
                      }
                    })
                  }} />
                ) : node.type === 'if' ? (
                  <IfNode labelSegments={getIfConditionSegments(node)} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
                    setNodeSizes((current) => {
                      const previous = current[node.id]

                      if (previous && previous.width === size.width && previous.height === size.height) {
                        return current
                      }

                      return {
                        ...current,
                        [node.id]: size,
                      }
                    })
                  }} />
                ) : node.type === 'else' ? (
                  <ElseNode labelSegments={[{ kind: 'text', text: 'Else' }, { kind: 'badge', text: 'Fallback' }, { kind: 'text', text: 'continue here' }]} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
                    setNodeSizes((current) => {
                      const previous = current[node.id]

                      if (previous && previous.width === size.width && previous.height === size.height) {
                        return current
                      }

                      return {
                        ...current,
                        [node.id]: size,
                      }
                    })
                  }} />
                ) : node.type === 'and' ? (
                  <AndNode
                    labelSegments={[
                      { kind: 'text', text: 'All' },
                      { kind: 'badge', text: 'Of' },
                      { kind: 'text', text: 'conditions pass' },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'or' ? (
                  <OrNode
                    labelSegments={[
                      { kind: 'text', text: 'Any' },
                      { kind: 'badge', text: 'Of' },
                      { kind: 'text', text: 'conditions pass' },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'not' ? (
                  <NotNode
                    labelSegments={[
                      { kind: 'text', text: 'Not' },
                      { kind: 'badge', text: 'Invert' },
                      { kind: 'text', text: 'this result' },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'xor' ? (
                  <XorNode
                    labelSegments={[
                      { kind: 'text', text: 'Only' },
                      { kind: 'badge', text: 'One' },
                      { kind: 'text', text: 'may pass' },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'intersect' ? (
                  <IntersectNode
                    labelSegments={[
                      { kind: 'text', text: 'Match' },
                      { kind: 'badge', text: 'All' },
                      { kind: 'text', text: 'results' },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'union' ? (
                  <UnionNode
                    labelSegments={[
                      { kind: 'text', text: 'Match' },
                      { kind: 'badge', text: 'Any' },
                      { kind: 'text', text: 'result' },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'exclude' ? (
                  <ExcludeNode
                    labelSegments={[
                      { kind: 'text', text: 'Exclude' },
                      { kind: 'badge', text: 'Remove' },
                      { kind: 'text', text: 'matches' },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'filter' ? (() => {
                  const incomingAssetNodes = edges
                    .filter((edge) => edge.toNodeId === node.id)
                    .map((edge) => placedNodes.find((placedNode) => placedNode.id === edge.fromNodeId))
                    .filter((placedNode): placedNode is CanvasNodeRecord => Boolean(placedNode && (placedNode.type === 'stock' || placedNode.type === 'token' || placedNode.type === 'assetBasket')))
                  const incomingAssetCount = incomingAssetNodes.length
                  const configuredAssetIds = Object.keys(node.filterConfigsByAssetNodeId ?? {})
                  const availableFilterAssetIds = Array.from(new Set([...incomingAssetNodes.map((assetNode) => assetNode.id), ...configuredAssetIds]))
                  const availableFilterAssetCount = availableFilterAssetIds.length
                  const activeConfigAsset = node.filterAssetNodeId ? placedNodes.find((placedNode) => placedNode.id === node.filterAssetNodeId) : null
                  const targetLabel = incomingAssetCount === 1
                    ? incomingAssetNodes[0]?.assetSymbol ?? incomingAssetNodes[0]?.assetName ?? incomingAssetNodes[0]?.assetBasketName ?? ''
                    : incomingAssetCount > 1
                      ? `${incomingAssetCount} assets`
                      : ''
                  const targetIcon = incomingAssetCount === 1 && incomingAssetNodes[0]?.type === 'stock' && incomingAssetNodes[0].assetSymbol
                    ? <CanvasAssetLogo assetType="stock" symbol={incomingAssetNodes[0].assetSymbol} size={14} />
                    : incomingAssetCount === 1 && incomingAssetNodes[0]?.type === 'token' && incomingAssetNodes[0].assetSymbol
                      ? <CanvasAssetLogo assetType="token" symbol={incomingAssetNodes[0].assetSymbol} size={14} />
                      : undefined
                  const primaryRuleLabel = node.filterSortFunction === 'currentPrice'
                    ? 'Current Price'
                    : node.filterSortFunction === 'currentMarketCap'
                      ? 'Current Market Cap'
                      : node.filterSortFunction === 'volume'
                        ? 'Volume'
                        : node.filterSortFunction === 'percentGain'
                          ? 'Percent Gain'
                          : node.filterSortFunction === 'simpleMovingAverage'
                            ? `SMA ${node.filterSortPeriod?.trim() ? node.filterSortPeriod.trim() : '14'}`
                            : node.filterSortFunction === 'exponentialMovingAverage'
                              ? `EMA ${node.filterSortPeriod?.trim() ? node.filterSortPeriod.trim() : '14'}`
                              : node.filterSortFunction === 'rsi'
                                ? `RSI ${node.filterSortPeriod?.trim() ? node.filterSortPeriod.trim() : '14'}`
                                : node.filterSortFunction === 'macdHistogram'
                                  ? 'MACD Histogram'
                                  : node.filterSortFunction === 'atr'
                                    ? `ATR ${node.filterSortPeriod?.trim() ? node.filterSortPeriod.trim() : '14'}`
                                    : ''
                  const secondaryRuleLabel = node.filterSecondarySortFunction === 'currentPrice'
                    ? 'Current Price'
                    : node.filterSecondarySortFunction === 'currentMarketCap'
                      ? 'Current Market Cap'
                      : node.filterSecondarySortFunction === 'volume'
                        ? 'Volume'
                        : node.filterSecondarySortFunction === 'percentGain'
                          ? 'Percent Gain'
                          : node.filterSecondarySortFunction === 'simpleMovingAverage'
                            ? `SMA ${node.filterSecondarySortPeriod?.trim() ? node.filterSecondarySortPeriod.trim() : '14'}`
                            : node.filterSecondarySortFunction === 'exponentialMovingAverage'
                              ? `EMA ${node.filterSecondarySortPeriod?.trim() ? node.filterSecondarySortPeriod.trim() : '14'}`
                              : node.filterSecondarySortFunction === 'rsi'
                                ? `RSI ${node.filterSecondarySortPeriod?.trim() ? node.filterSecondarySortPeriod.trim() : '14'}`
                                : node.filterSecondarySortFunction === 'macdHistogram'
                                  ? 'MACD Histogram'
                                  : node.filterSecondarySortFunction === 'atr'
                                    ? `ATR ${node.filterSecondarySortPeriod?.trim() ? node.filterSecondarySortPeriod.trim() : '14'}`
                                    : ''
                  const orderingLabel = node.filterOrdering === 'top'
                    ? 'Top'
                    : node.filterOrdering === 'bottom'
                      ? 'Bottom'
                      : ''
                  const howManyLabel = node.filterHowMany && node.filterHowMany.trim().length > 0 ? node.filterHowMany : ''
                  const operatorLabel = node.filterConditionOperator === 'or' ? 'OR' : 'AND'
                  const segments: NodeShellLabelSegment[] = [{ kind: 'text', text: 'Filter' }]

                    if (availableFilterAssetCount > 1) {
                      segments.push({ kind: 'badge' as const, text: `${availableFilterAssetCount} assets` })
                    } else if (targetLabel) {
                      segments.push({ kind: 'badge' as const, text: targetLabel, icon: targetIcon })
                    }

                    if (primaryRuleLabel) {
                      if (targetLabel || availableFilterAssetCount > 1) {
                        segments.push({ kind: 'text' as const, text: 'by' })
                      }
                    segments.push({ kind: 'badge' as const, text: primaryRuleLabel })
                  }

                  if (secondaryRuleLabel) {
                    segments.push({ kind: 'badge' as const, text: operatorLabel })
                    segments.push({ kind: 'badge' as const, text: secondaryRuleLabel })
                  }

                  if (orderingLabel) {
                    segments.push({ kind: 'text' as const, text: 'order by' })
                    segments.push({ kind: 'badge' as const, text: orderingLabel })
                  }

                  if (howManyLabel) {
                    segments.push({ kind: 'text' as const, text: 'limit' })
                    segments.push({ kind: 'badge' as const, text: howManyLabel })
                  }

                  segments.push({ kind: 'badge' as const, text: node.filterResultMode === 'topOne' ? 'Top 1' : node.filterResultMode === 'allMatches' ? 'All Matches' : 'Top N' })

                  const inlineControl = (() => {
                    if (availableFilterAssetCount <= 1) {
                      return null
                    }

                    const filterAssetOptions = availableFilterAssetIds
                      .map((assetNodeId) => placedNodes.find((placedNode) => placedNode.id === assetNodeId))
                      .filter((placedNode): placedNode is CanvasNodeRecord => Boolean(placedNode && (placedNode.type === 'stock' || placedNode.type === 'token' || placedNode.type === 'assetBasket')))
                    const activeAssetLabel = activeConfigAsset?.assetSymbol ?? activeConfigAsset?.assetName ?? activeConfigAsset?.assetBasketName ?? 'Asset'
                    const activeAssetIcon = activeConfigAsset?.type === 'stock' && activeConfigAsset.assetSymbol
                      ? <CanvasAssetLogo assetType="stock" symbol={activeConfigAsset.assetSymbol} size={12} />
                      : activeConfigAsset?.type === 'token' && activeConfigAsset.assetSymbol
                        ? <CanvasAssetLogo assetType="token" symbol={activeConfigAsset.assetSymbol} size={12} />
                        : undefined
                    const assetMenuItems: DropdownMenuItem[] = filterAssetOptions.map((assetNode) => ({
                      label: assetNode.assetSymbol ?? assetNode.assetName ?? assetNode.assetBasketName ?? 'Asset',
                      value: assetNode.id,
                      active: assetNode.id === node.filterAssetNodeId,
                      icon: assetNode.assetSymbol && (assetNode.type === 'stock' || assetNode.type === 'token') ? <CanvasAssetLogo assetType={assetNode.type} symbol={assetNode.assetSymbol} size={16} /> : null,
                      trailingIcon: assetNode.id === node.filterAssetNodeId ? '✓' : undefined,
                    }))

                    return (
                      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                        <button
                          type="button"
                          onPointerDown={(event) => {
                            event.stopPropagation()
                          }}
                          onClick={(event) => {
                            event.stopPropagation()
                            setOpenFilterViewNodeId((current) => (current === node.id ? null : node.id))
                          }}
                          style={{
                            minHeight: 24,
                            padding: '0 8px',
                            borderRadius: 999,
                            border: `1px solid ${selectedNodeIds.includes(node.id) ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}`,
                            background: 'var(--canvas-surface-soft)',
                            color: 'var(--canvas-text-secondary)',
                            fontFamily: 'var(--canvas-font-sans)',
                            fontSize: 11,
                            fontWeight: 700,
                            lineHeight: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            cursor: 'pointer',
                          }}
                        >
                          {activeAssetIcon ? <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{activeAssetIcon}</span> : null}
                          <span>{`View ${activeAssetLabel}`}</span>
                        </button>
                        {openFilterViewNodeId === node.id ? (
                          <DropdownMenu
                            open
                            groups={[{ items: assetMenuItems }]}
                            position="bottom"
                            onClose={() => setOpenFilterViewNodeId(null)}
                            onItemClick={(item) => {
                              if (item.value) {
                                setCanvasFilterAssetNodeId(node.id, item.value)
                              }

                              setOpenFilterViewNodeId(null)
                            }}
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '100%',
                              marginTop: 8,
                              transform: 'translateX(-50%)',
                              minWidth: 120,
                              zIndex: 30,
                            }}
                          />
                        ) : null}
                      </span>
                    )
                  })()

                  return (
                    <FilterNode
                      labelSegments={segments}
                      inlineControl={inlineControl}
                      {...getCommonNodeProps(node.id)}
                      onMeasure={(size) => {
                        setNodeSizes((current) => {
                          const previous = current[node.id]

                          if (previous && previous.width === size.width && previous.height === size.height) {
                            return current
                          }

                          return {
                            ...current,
                            [node.id]: size,
                          }
                        })
                      }}
                    />
                  )
                })() : node.type === 'buy' ? (
                  <BuyNode
                    labelSegments={(() => {
                      const assetLabel = getLinkedAssetLabel(node.actionAssetNodeId)
                      const assetIcon = getLinkedAssetIcon(node.actionAssetNodeId)
                      const amountMode = node.actionAmountMode === 'value' ? 'Value' : 'Percentage'
                      const amountValue = node.actionAmountValue?.trim() ? node.actionAmountValue.trim() : '0'

                      return [
                        { kind: 'text' as const, text: 'Buy' },
                        { kind: 'badge' as const, text: node.buyType === 'add' ? 'Add' : node.buyType === 'rotateInto' ? 'Rotate Into' : 'Open' },
                        { kind: 'badge' as const, text: assetLabel, icon: assetIcon },
                        { kind: 'text' as const, text: 'with' },
                        { kind: 'badge' as const, text: amountMode },
                        { kind: 'badge' as const, text: node.actionAmountMode === 'value' ? `$${amountValue}` : `${amountValue}%` },
                      ]
                    })()}
                    icon={<ArrowCircleDownRight size={18} weight="fill" />}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'sell' ? (
                  <SellNode
                    labelSegments={(() => {
                      const assetLabel = getLinkedAssetLabel(node.actionAssetNodeId)
                      const assetIcon = getLinkedAssetIcon(node.actionAssetNodeId)
                      const amountMode = node.actionAmountMode === 'value' ? 'Value' : 'Percentage'
                      const amountValue = node.actionAmountValue?.trim() ? node.actionAmountValue.trim() : '0'

                      return [
                        { kind: 'text' as const, text: 'Sell' },
                        { kind: 'badge' as const, text: node.sellType === 'reduce' ? 'Reduce' : node.sellType === 'takePartial' ? 'Take Partial' : 'Full Exit' },
                        { kind: 'badge' as const, text: assetLabel, icon: assetIcon },
                        { kind: 'text' as const, text: 'with' },
                        { kind: 'badge' as const, text: amountMode },
                        { kind: 'badge' as const, text: node.actionAmountMode === 'value' ? `$${amountValue}` : `${amountValue}%` },
                      ]
                    })()}
                    icon={<ArrowCircleUpRight size={18} weight="fill" />}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'rebalance' ? (
                  <RebalanceNode
                    labelSegments={[
                      { kind: 'text', text: 'Rebalance' },
                      { kind: 'badge', text: node.rebalanceScope === 'selectedAssets' ? 'Selected Assets' : node.rebalanceScope === 'portfolioSet' ? 'Portfolio Set' : 'This Branch' },
                      { kind: 'text', text: 'using' },
                      { kind: 'badge', text: node.rebalanceMode === 'target' ? 'Target' : 'Equal' },
                      { kind: 'text', text: 'trigger' },
                      { kind: 'badge', text: `${node.rebalanceThreshold?.trim() ? node.rebalanceThreshold.trim() : '0'}%` },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'allocate' ? (
                  <AllocateNode
                    labelSegments={[
                      { kind: 'text', text: 'Allocate' },
                      { kind: 'badge', text: node.allocateStyle === 'addExposure' ? 'Add Exposure' : 'Target Weight' },
                      { kind: 'text', text: 'using' },
                      { kind: 'badge', text: node.allocateWeightingMode === 'value' ? 'Value' : 'Percentage' },
                      { kind: 'badge', text: node.allocateWeightingMode === 'value' ? `$${node.allocateAmountValue?.trim() ? node.allocateAmountValue.trim() : '0'}` : `${node.allocateAmountValue?.trim() ? node.allocateAmountValue.trim() : '0'}%` },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'scaleOut' ? (
                  <ScaleOutNode
                    labelSegments={[
                      { kind: 'text', text: 'Scale out' },
                      { kind: 'text', text: 'by' },
                      { kind: 'badge', text: `${node.scaleOutPercent?.trim() ? node.scaleOutPercent.trim() : '0'}%` },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'takeProfit' ? (
                  <TakeProfitNode
                    labelSegments={node.takeProfitMode === 'atrBased'
                      ? [
                          { kind: 'text', text: 'Take profit' },
                          { kind: 'badge', text: 'ATR-based' },
                          { kind: 'badge', text: getLinkedAssetLabel(node.riskAssetNodeId), icon: getLinkedAssetIcon(node.riskAssetNodeId) },
                          { kind: 'text', text: 'ATR' },
                          { kind: 'badge', text: node.riskAtrPeriod?.trim() ? node.riskAtrPeriod.trim() : '14' },
                          { kind: 'badge', text: `x ${node.riskAtrMultiplier?.trim() ? node.riskAtrMultiplier.trim() : '2'}` },
                        ]
                      : [
                          { kind: 'text', text: 'Take profit' },
                          { kind: 'badge', text: node.takeProfitMode === 'partial' ? 'Partial' : node.takeProfitMode === 'ladder' ? 'Ladder' : 'Single' },
                          { kind: 'text', text: 'if' },
                          { kind: 'badge', text: getLinkedAssetLabel(node.riskAssetNodeId), icon: getLinkedAssetIcon(node.riskAssetNodeId) },
                          { kind: 'badge', text: node.riskComparator ?? '>=' },
                          { kind: 'badge', text: `$${node.riskThresholdValue?.trim() ? node.riskThresholdValue.trim() : '0'}` },
                        ]}
                    icon={<TrendUp size={18} weight="bold" />}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'stopLoss' ? (
                  <StopLossNode
                    labelSegments={node.stopLossMode === 'atrBased'
                      ? [
                          { kind: 'text', text: 'Stop loss' },
                          { kind: 'badge', text: 'ATR-based' },
                          { kind: 'badge', text: getLinkedAssetLabel(node.riskAssetNodeId), icon: getLinkedAssetIcon(node.riskAssetNodeId) },
                          { kind: 'text', text: 'ATR' },
                          { kind: 'badge', text: node.riskAtrPeriod?.trim() ? node.riskAtrPeriod.trim() : '14' },
                          { kind: 'badge', text: `x ${node.riskAtrMultiplier?.trim() ? node.riskAtrMultiplier.trim() : '2'}` },
                        ]
                      : [
                          { kind: 'text', text: 'Stop loss' },
                          { kind: 'badge', text: node.stopLossMode === 'trailing' ? 'Trailing' : node.stopLossMode === 'breakEven' ? 'Break-even' : 'Fixed' },
                          { kind: 'text', text: 'if' },
                          { kind: 'badge', text: getLinkedAssetLabel(node.riskAssetNodeId), icon: getLinkedAssetIcon(node.riskAssetNodeId) },
                          { kind: 'badge', text: node.riskComparator ?? '<=' },
                          { kind: 'badge', text: `$${node.riskThresholdValue?.trim() ? node.riskThresholdValue.trim() : '0'}` },
                        ]}
                    icon={<TrendDown size={18} weight="bold" />}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'portfolioCondition' ? (
                  <PortfolioConditionNode
                    labelSegments={[
                      { kind: 'text', text: 'Portfolio' },
                      { kind: 'badge', text: 'Condition' },
                      { kind: 'badge', text: node.portfolioMetric === 'portfolioExposure' ? 'Portfolio Exposure %' : node.portfolioMetric === 'openPositions' ? 'Open Positions' : node.portfolioMetric === 'unrealizedPnl' ? 'Unrealized PnL %' : node.portfolioMetric === 'drawdownPercent' ? 'Drawdown %' : node.portfolioMetric === 'positionSizePercent' ? 'Position Size %' : 'Cash %' },
                      { kind: 'badge', text: node.portfolioComparator ?? '>=' },
                      { kind: 'badge', text: node.portfolioValue?.trim() ? node.portfolioValue.trim() : '0' },
                    ]}
                    icon={<Wallet size={18} weight="fill" />}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'cooldown' ? (
                  <CooldownNode
                    labelSegments={[
                      { kind: 'text', text: 'Cooldown' },
                      { kind: 'badge', text: node.cooldownScope === 'strategy' ? 'Whole Strategy' : 'This Branch' },
                      { kind: 'text', text: 'for' },
                      { kind: 'badge', text: `${node.cooldownDuration?.trim() ? node.cooldownDuration.trim() : '0'} ${node.cooldownUnit ? node.cooldownUnit.charAt(0).toUpperCase() + node.cooldownUnit.slice(1) : 'Day'}` },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'wait' ? (
                  <WaitNode
                    labelSegments={[
                      { kind: 'text', text: 'Wait' },
                      { kind: 'text', text: 'for' },
                      { kind: 'badge', text: `${node.waitDuration?.trim() ? node.waitDuration.trim() : '0'} ${node.waitUnit ? node.waitUnit.charAt(0).toUpperCase() + node.waitUnit.slice(1) : 'Day'}` },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'pauseTrading' ? (
                  <PauseTradingNode
                    labelSegments={node.pauseTradingMode === 'untilCondition'
                      ? [
                          { kind: 'text', text: 'Pause' },
                          { kind: 'badge', text: 'Trading' },
                          { kind: 'text', text: 'until' },
                          { kind: 'badge', text: node.pauseTradingCondition?.trim() ? node.pauseTradingCondition.trim() : 'Condition' },
                        ]
                      : [
                          { kind: 'text', text: 'Pause' },
                          { kind: 'badge', text: 'Trading' },
                          { kind: 'text', text: 'for' },
                          { kind: 'badge', text: `${node.pauseTradingDuration?.trim() ? node.pauseTradingDuration.trim() : '0'} ${node.pauseTradingUnit ? node.pauseTradingUnit.charAt(0).toUpperCase() + node.pauseTradingUnit.slice(1) : 'Day'}` },
                        ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'positionLimit' ? (
                  <PositionLimitNode
                    labelSegments={[
                      { kind: 'text', text: 'Position' },
                      { kind: 'badge', text: 'Limit' },
                      { kind: 'badge', text: node.positionLimitApplyTo === 'branchAssets' ? 'Branch Assets' : 'Single Asset' },
                      { kind: 'badge', text: node.positionLimitMode === 'value' ? `$${node.positionLimitValue?.trim() ? node.positionLimitValue.trim() : '0'}` : `${node.positionLimitValue?.trim() ? node.positionLimitValue.trim() : '0'}%` },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'positionCountLimit' ? (
                  <PositionCountLimitNode
                    labelSegments={[
                      { kind: 'text', text: 'Position Count' },
                      { kind: 'badge', text: 'Limit' },
                      { kind: 'badge', text: node.positionCountScope === 'portfolio' ? 'Whole Portfolio' : 'This Branch' },
                      { kind: 'badge', text: node.positionCountComparator ?? '>=' },
                      { kind: 'badge', text: node.positionCountValue?.trim() ? node.positionCountValue.trim() : '0' },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'exposureLimit' ? (
                  <ExposureLimitNode
                    labelSegments={[
                      { kind: 'text', text: 'Exposure' },
                      { kind: 'badge', text: 'Limit' },
                      { kind: 'badge', text: node.exposureLimitType === 'basket' ? 'Basket' : node.exposureLimitType === 'portfolio' ? 'Portfolio' : 'Asset Class' },
                      { kind: 'badge', text: node.riskComparator ?? '>=' },
                      { kind: 'badge', text: `${node.exposureLimitValue?.trim() ? node.exposureLimitValue.trim() : '0'}%` },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'cashReserve' ? (
                  <CashReserveNode
                    labelSegments={[
                      { kind: 'text', text: 'Reserve' },
                      { kind: 'badge', text: 'Cash' },
                      { kind: 'badge', text: `${node.cashReservePercent?.trim() ? node.cashReservePercent.trim() : '0'}%` },
                      ...(node.cashReserveLabel?.trim() ? [{ kind: 'badge' as const, text: node.cashReserveLabel.trim() }] : []),
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'assetBasket' ? (
                  <AssetBasketNode
                    labelSegments={[
                      { kind: 'text', text: 'Asset' },
                      { kind: 'badge', text: 'Basket' },
                      { kind: 'badge', text: node.assetBasketName?.trim() ? node.assetBasketName.trim() : 'Grouped Assets' },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'stock' ? (
                  <StockNode label={node.assetSymbol ?? 'Select asset'} icon={node.assetSymbol ? <CanvasAssetLogo assetType="stock" symbol={node.assetSymbol} size={24} /> : undefined} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
                    setNodeSizes((current) => {
                      const previous = current[node.id]

                      if (previous && previous.width === size.width && previous.height === size.height) {
                        return current
                      }

                      return {
                        ...current,
                        [node.id]: size,
                      }
                    })
                  }} />
                ) : node.type === 'token' ? (
                  <TokenNode label={node.assetSymbol ?? 'Select asset'} icon={node.assetSymbol ? <CanvasAssetLogo assetType="token" symbol={node.assetSymbol} size={24} /> : undefined} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
                    setNodeSizes((current) => {
                      const previous = current[node.id]

                      if (previous && previous.width === size.width && previous.height === size.height) {
                        return current
                      }

                      return {
                        ...current,
                        [node.id]: size,
                      }
                    })
                  }} />
                ) : (
                  <EndNode labelSegments={getEndLabelSegments(node)} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
                    setNodeSizes((current) => {
                      const previous = current[node.id]

                      if (previous && previous.width === size.width && previous.height === size.height) {
                        return current
                      }

                      return {
                        ...current,
                        [node.id]: size,
                      }
                    })
                  }} />
                )}
              </div>
            </div>
          ))}

          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'auto',
              overflow: 'visible',
              zIndex: 1,
            }}
          >
            {edges.map((edge) => {
              const fromNode = placedNodes.find((node) => node.id === edge.fromNodeId)
              const toNode = placedNodes.find((node) => node.id === edge.toNodeId)

              if (!fromNode || !toNode) {
                return null
              }

              const fromPoint = getConnectorScreenPosition(fromNode.id, fromNode, edge.fromSide)
              const toPoint = getConnectorScreenPosition(toNode.id, toNode, edge.toSide)
              const sourceSiblingEdges = edges.filter((candidate) => candidate.fromNodeId === edge.fromNodeId && candidate.fromSide === edge.fromSide)
              const targetSiblingEdges = edges.filter((candidate) => candidate.toNodeId === edge.toNodeId && candidate.toSide === edge.toSide)
              const sourceIndex = sourceSiblingEdges.findIndex((candidate) => candidate.id === edge.id)
              const targetIndex = targetSiblingEdges.findIndex((candidate) => candidate.id === edge.id)
              const sourceOffset = sourceSiblingEdges.length > 1 ? (sourceIndex - (sourceSiblingEdges.length - 1) / 2) * 14 : 0
              const targetOffset = targetSiblingEdges.length > 1 ? (targetIndex - (targetSiblingEdges.length - 1) / 2) * 14 : 0
              const geometry = getOrthogonalEdgeGeometry(fromPoint, toPoint, edge.fromSide, edge.toSide, sourceOffset, targetOffset)
              const isConnectedToSelectedNode = selectedNodeIds.includes(edge.fromNodeId) || selectedNodeIds.includes(edge.toNodeId)
              const selectEdge = (event: React.PointerEvent<SVGElement>) => {
                event.stopPropagation()
                setSelectedCanvasEdgeIds([edge.id])
                setSelectedCanvasNodeId(null)
                setSelectedCanvasNodeIds([])
              }

              return (
                <g key={edge.id}>
                  <path
                    d={geometry.path}
                    stroke="transparent"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    onPointerDown={selectEdge}
                  />
                  <path
                    d={geometry.path}
                    stroke={selectedEdgeIds.includes(edge.id) || isConnectedToSelectedNode ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}
                    strokeWidth={selectedEdgeIds.includes(edge.id) ? '3' : isConnectedToSelectedNode ? '2.5' : '2'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{ pointerEvents: 'none' }}
                  />
                </g>
              )
            })}

            {connectorDragStateRef.current && connectorPreviewPoint ? (() => {
              const sourceNode = placedNodes.find((node) => node.id === connectorDragStateRef.current?.fromNodeId)

              if (!sourceNode) {
                return null
              }

              const fromPoint = getConnectorScreenPosition(sourceNode.id, sourceNode, connectorDragStateRef.current.fromSide)
              const toPoint = connectorHoverTarget
                ? getConnectorScreenPosition(
                    connectorHoverTarget.nodeId,
                    placedNodes.find((node) => node.id === connectorHoverTarget.nodeId) ?? sourceNode,
                    connectorHoverTarget.side,
                  )
                : connectorPreviewPoint
              const geometry = getOrthogonalEdgeGeometry(
                fromPoint,
                toPoint,
                connectorDragStateRef.current.fromSide,
                connectorHoverTarget?.side ?? (Math.abs(toPoint.x - fromPoint.x) >= Math.abs(toPoint.y - fromPoint.y)
                  ? toPoint.x >= fromPoint.x
                    ? 'left'
                    : 'right'
                  : toPoint.y >= fromPoint.y
                    ? 'top'
                    : 'bottom'),
              )

              return (
                <path
                  d={geometry.path}
                  stroke="var(--canvas-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  strokeDasharray={connectorHoverTarget ? undefined : '6 4'}
                />
              )
            })() : null}
          </svg>

          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              overflow: 'visible',
              zIndex: 2,
            }}
          >
            {alignmentGuide?.verticalGuide ? (
              <line
                x1={alignmentGuide.verticalGuide.x}
                y1={alignmentGuide.verticalGuide.fromY}
                x2={alignmentGuide.verticalGuide.x}
                y2={alignmentGuide.verticalGuide.toY}
                stroke="var(--canvas-accent)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.9"
              />
            ) : null}

            {alignmentGuide?.horizontalGuide ? (
              <line
                x1={alignmentGuide.horizontalGuide.fromX}
                y1={alignmentGuide.horizontalGuide.y}
                x2={alignmentGuide.horizontalGuide.toX}
                y2={alignmentGuide.horizontalGuide.y}
                stroke="var(--canvas-accent)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.9"
              />
            ) : null}
          </svg>

          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              overflow: 'visible',
              zIndex: 3,
            }}
          >
            {edges.map((edge) => {
              const fromNode = placedNodes.find((node) => node.id === edge.fromNodeId)
              const toNode = placedNodes.find((node) => node.id === edge.toNodeId)

              if (!fromNode || !toNode) {
                return null
              }

              const fromPoint = getConnectorScreenPosition(fromNode.id, fromNode, edge.fromSide)
              const toPoint = getConnectorScreenPosition(toNode.id, toNode, edge.toSide)
              const sourceSiblingEdges = edges.filter((candidate) => candidate.fromNodeId === edge.fromNodeId && candidate.fromSide === edge.fromSide)
              const targetSiblingEdges = edges.filter((candidate) => candidate.toNodeId === edge.toNodeId && candidate.toSide === edge.toSide)
              const sourceIndex = sourceSiblingEdges.findIndex((candidate) => candidate.id === edge.id)
              const targetIndex = targetSiblingEdges.findIndex((candidate) => candidate.id === edge.id)
              const sourceOffset = sourceSiblingEdges.length > 1 ? (sourceIndex - (sourceSiblingEdges.length - 1) / 2) * 14 : 0
              const targetOffset = targetSiblingEdges.length > 1 ? (targetIndex - (targetSiblingEdges.length - 1) / 2) * 14 : 0
              const geometry = getOrthogonalEdgeGeometry(fromPoint, toPoint, edge.fromSide, edge.toSide, sourceOffset, targetOffset)
              const edgeLabel = getCanvasEdgeLabelForNode(fromNode.type, edge.fromSide)

              return (
                <g key={`edge-hit-${edge.id}`}>
                  <path
                    d={geometry.path}
                    stroke="transparent"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    onPointerDown={(event) => {
                      event.stopPropagation()
                      setSelectedCanvasEdgeIds([edge.id])
                      setSelectedCanvasNodeId(null)
                      setSelectedCanvasNodeIds([])
                    }}
                  />
                  <circle
                    cx={geometry.midPoint.x}
                    cy={geometry.midPoint.y}
                    r={18}
                    fill="transparent"
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    onPointerDown={(event) => {
                      event.stopPropagation()
                      setSelectedCanvasEdgeIds([edge.id])
                      setSelectedCanvasNodeId(null)
                      setSelectedCanvasNodeIds([])
                    }}
                  />
                  {edgeLabel ? (
                    <g
                      transform={`translate(${(edgeLabelPlacements.get(edge.id) ?? geometry.midPoint).x}, ${(edgeLabelPlacements.get(edge.id) ?? geometry.midPoint).y})`}
                      style={{ pointerEvents: 'none' }}
                    >
                      <g transform={`scale(${Math.max(0.65, Math.min(1.35, view.scale))})`}>
                        <rect
                          x={-(Math.max(60, edgeLabel.length * 7) / 2)}
                          y={-13}
                          width={Math.max(60, edgeLabel.length * 7)}
                          height={26}
                          rx={13}
                          fill="var(--canvas-bg)"
                          stroke="var(--canvas-panel-divider)"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="1"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="var(--canvas-text-secondary)"
                          style={{
                            fontFamily: 'var(--canvas-font-sans)',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {edgeLabel}
                        </text>
                      </g>
                    </g>
                  ) : null}
                </g>
              )
            })}
          </svg>

          {isLoading ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                opacity: skeletonOpacity,
                transition: 'opacity 220ms ease',
                zIndex: 1,
              }}
            >
              <div style={{ position: 'absolute', left: '12%', top: '18%', width: 280, display: 'grid', gap: 16 }}>
                <Skeleton width={220} height={20} radius={999} />
                <Skeleton width={280} height={140} radius={24} />
              </div>

              <div style={{ position: 'absolute', right: '16%', top: '28%', width: 240, display: 'grid', gap: 14 }}>
                <Skeleton width={180} height={18} radius={999} />
                <Skeleton width={240} height={110} radius={20} />
              </div>

              <div style={{ position: 'absolute', left: '24%', bottom: '20%', width: 300, display: 'grid', gap: 16 }}>
                <Skeleton width={160} height={18} radius={999} />
                <Skeleton width={300} height={120} radius={22} />
              </div>
            </div>
          ) : null}

          <CommentThreadLayer
            activeTool={activeTool}
            avatarSrc={CURRENT_USER.avatarSrc}
            drafts={drafts}
            dummyResponderAvatar={DUMMY_USER.avatarSrc}
            dummyResponderName={DUMMY_USER.name}
            contextMenuPosition={contextMenuPosition}
            contextMenuThreadId={contextMenuThreadId}
            hoveredThreadId={hoveredThreadId}
            pinnedThreadId={pinnedThreadId}
            threads={commentThreads}
            view={view}
            onContextMenuDelete={handleDeleteCommentThread}
            onContextMenuOpen={(threadId, x, y) => {
              cancelCommentHideTimeout()
              setHoveredThreadId(threadId)
              setPinnedThreadId(threadId)
              setContextMenuThreadId(threadId)
              setContextMenuPosition({ x, y })
            }}
            onContextMenuClose={closeCommentContextMenu}
            onDraftChange={handleCommentDraftChange}
            onHoverThread={(threadId) => {
              cancelCommentHideTimeout()
              setHoveredThreadId(threadId)
            }}
            onLeaveThread={(threadId) => {
              if (pinnedThreadId !== threadId) {
                scheduleCommentHide(threadId)
              }
            }}
            onPinThread={(threadId) => {
              cancelCommentHideTimeout()

              if (threadId === null) {
                clearEmptyThread(pinnedThreadId)
              }

              setPinnedThreadId(threadId)
            }}
            onSendThread={handleCommentSend}
          />

          {canvasContextMenuPosition ? (
            <div
              onPointerDown={(event) => event.stopPropagation()}
              style={{
                position: 'fixed',
                left: canvasContextMenuPosition.x,
                top: canvasContextMenuPosition.y,
                transform: 'translate(-8px, 8px)',
                pointerEvents: 'auto',
                zIndex: 31,
              }}
            >
              <DropdownMenu
                open
                groups={canvasContextMenuGroups}
                onClose={closeCanvasContextMenu}
                onItemClick={(item) => handleCanvasContextMenuAction(item.value)}
                style={{ left: 0, transform: 'translateY(0)', minWidth: 180 }}
              />
            </div>
          ) : null}
        </div>
      </div>

    </div>
  )
}
  const createCanvasNodeDraft = (type: CanvasNodeType, x: number, y: number): CanvasNodeRecord => {
    const baseNode: CanvasNodeRecord = {
      id: `node-${Date.now()}`,
      type,
      x,
      y,
    }

    if (type === 'start') {
      return { ...baseNode, startWeightingType: 'equal', startStyle: 'standard', startReserveCashPercent: '20', startEntryLimit: '35' }
    }

    if (type === 'end') {
      return { ...baseNode, endType: 'timeBased', endScope: 'endBranch', endTimeValue: '7', endTimeUnit: 'day' }
    }

    if (type === 'scaleOut') {
      return { ...baseNode, scaleOutPercent: '10', scaleOutMode: 'standard', scaleOutSteps: '3' }
    }

    if (type === 'cooldown') {
      return { ...baseNode, cooldownDuration: '7', cooldownUnit: 'day', cooldownScope: 'branch' }
    }

    if (type === 'wait') {
      return { ...baseNode, waitDuration: '1', waitUnit: 'day' }
    }

    if (type === 'pauseTrading') {
      return { ...baseNode, pauseTradingMode: 'duration', pauseTradingDuration: '3', pauseTradingUnit: 'day' }
    }

    if (type === 'positionCountLimit') {
      return { ...baseNode, positionCountComparator: '>=', positionCountValue: '5', positionCountScope: 'branch' }
    }

    if (type === 'cashReserve') {
      return { ...baseNode, cashReservePercent: '20', cashReserveLabel: 'Reserve Buffer' }
    }

    if (type === 'assetBasket') {
      return { ...baseNode, assetBasketName: 'Asset Basket' }
    }

    return baseNode
  }
