import { ArrowCircleDownRight, ArrowCircleUpRight, ArrowsClockwise, ChartLineUp, ChartPieSlice, ClockCountdown, FlagCheckered, FunnelSimple, Percent, Play, ShieldWarning, TrendDown, TrendUp, Wallet, WaveSine } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

import DotsPattern from '../background/dots/dots-pattern'
import GridPattern from '../background/grid/grid-pattern'
import { CanvasAssetLogo } from './canvas-asset-options'
import AllocateNode from '../nodes/allocate/allocate-node'
import BuyNode from '../nodes/buy/buy-node'
import ElseNode from '../nodes/else/else-node'
import EndNode from '../nodes/end/end-node'
import FilterNode from '../nodes/filter/filter-node'
import IfNode from '../nodes/if/if-node'
import LoopNode from '../nodes/loop/loop-node'
import RebalanceNode from '../nodes/rebalance/rebalance-node'
import ScaleOutNode from '../nodes/scale-out/scale-out-node'
import SellNode from '../nodes/sell/sell-node'
import StartNode from '../nodes/start/start-node'
import StopLossNode from '../nodes/stop-loss/stop-loss-node'
import StockNode from '../nodes/stock/stock-node'
import TakeProfitNode from '../nodes/take-profit/take-profit-node'
import TokenNode from '../nodes/token/token-node'
import CommentThreadLayer from '../comment/comment-thread-layer'
import Skeleton from '../loading/skeleton'
import { useAppLoading } from '../../state/app-loading-store'
import { addCanvasEdge, removeCanvasEdges, setSelectedCanvasEdgeIds, useCanvasEdges, type CanvasConnectorSide } from '../../state/canvas-edge-store'
import { redoCanvasGraph, undoCanvasGraph } from '../../state/canvas-graph-store'
import { addCanvasNode, moveCanvasNodes, removeCanvasNodes, setSelectedCanvasNodeId, setSelectedCanvasNodeIds, useCanvasNodes } from '../../state/canvas-node-store'
import { canvasActionShortcuts } from '../../config/keybinding/canvas-keybindings'
import { executeCanvasZoomAction, setCanvasScale, setCanvasTool, useCanvasNodeType, useCanvasScale, useCanvasTool, type CanvasTool } from '../../state/canvas-tool-store'
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

type AlignmentGuide = {
  verticalGuide: { x: number; fromY: number; toY: number } | null
  horizontalGuide: { y: number; fromX: number; toX: number } | null
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
  const [hoveredThreadId, setHoveredThreadId] = useState<string | null>(null)
  const [pinnedThreadId, setPinnedThreadId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [nodeSizes, setNodeSizes] = useState<Record<string, { width: number; height: number }>>({})
  const [connectorPreviewPoint, setConnectorPreviewPoint] = useState<Point | null>(null)
  const [connectorHoverTarget, setConnectorHoverTarget] = useState<{ nodeId: string; side: CanvasConnectorSide } | null>(null)
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
      return 'Exponential Moving Average'
    }

    return ''
  }

  const getIfValuePrefix = (value?: string) => {
    if (value === 'currentPrice' || value === 'currentMarketCap') {
      return '$'
    }

    return ''
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

  const getCommonNodeProps = (nodeId: string) => ({
    selected: selectedNodeIds.includes(nodeId),
    activeConnectorSide: connectorDragStateRef.current?.fromNodeId === nodeId
      ? connectorDragStateRef.current.fromSide
      : connectorHoverTarget?.nodeId === nodeId
        ? connectorHoverTarget.side
        : null,
    onConnectorPointerDown: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => handleConnectorPointerDown(event, nodeId, side),
    onMeasure: (size: { width: number; height: number }) => handleNodeMeasure(nodeId, size),
  })

  const getOrthogonalEdgeGeometry = (
    fromPoint: Point,
    toPoint: Point,
    fromSide: CanvasConnectorSide,
    toSide: CanvasConnectorSide,
  ): OrthogonalEdgeGeometry => {
    const points: Point[] = [{ ...fromPoint }]
    const isHorizontalStart = fromSide === 'left' || fromSide === 'right'
    const isHorizontalEnd = toSide === 'left' || toSide === 'right'
    const directCorner = isHorizontalStart
      ? { x: toPoint.x, y: fromPoint.y }
      : { x: fromPoint.x, y: toPoint.y }

    if ((directCorner.x !== fromPoint.x || directCorner.y !== fromPoint.y) && (directCorner.x !== toPoint.x || directCorner.y !== toPoint.y)) {
      points.push(directCorner)
    } else {
      const middlePoint = isHorizontalStart && isHorizontalEnd
        ? { x: (fromPoint.x + toPoint.x) / 2, y: fromPoint.y }
        : !isHorizontalStart && !isHorizontalEnd
          ? { x: fromPoint.x, y: (fromPoint.y + toPoint.y) / 2 }
          : directCorner

      if (middlePoint.x !== fromPoint.x || middlePoint.y !== fromPoint.y) {
        points.push(middlePoint)
      }
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

    let traversedLength = 0
    let midPoint = dedupedPoints[Math.floor(dedupedPoints.length / 2)] ?? fromPoint

    if (totalLength > 0) {
      const targetLength = totalLength / 2

      for (let index = 1; index < dedupedPoints.length; index += 1) {
        const segmentLength = segmentLengths[index - 1]

        if (traversedLength + segmentLength >= targetLength) {
          const previous = dedupedPoints[index - 1]
          const current = dedupedPoints[index]
          const ratio = (targetLength - traversedLength) / segmentLength

          midPoint = {
            x: previous.x + (current.x - previous.x) * ratio,
            y: previous.y + (current.y - previous.y) * ratio,
          }
          break
        }

        traversedLength += segmentLength
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
    const threshold = 12

    for (const node of placedNodes) {
      for (const side of ['top', 'right', 'bottom', 'left'] as CanvasConnectorSide[]) {
        if (node.id === sourceNodeId && side === sourceSide) {
          continue
        }

        const point = getConnectorScreenPosition(node.id, node, side)
        const dx = point.x - localX
        const dy = point.y - localY

        if (Math.hypot(dx, dy) <= threshold) {
          return { nodeId: node.id, side }
        }
      }
    }

    return null
  }

  const closeCommentContextMenu = () => {
    setContextMenuPosition(null)
    setContextMenuThreadId(null)
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
        setConnectorHoverTarget(getConnectorDropTarget(event.clientX, event.clientY, connectorDragState.fromNodeId, connectorDragState.fromSide))
        return
      }

      if (nodeDragState && event.pointerId === nodeDragState.pointerId) {
        const nextDeltaX = (event.clientX - nodeDragState.start.x) / view.scale
        const nextDeltaY = (event.clientY - nodeDragState.start.y) / view.scale
        const stepDeltaX = nextDeltaX - nodeDragState.lastDelta.x
        const stepDeltaY = nextDeltaY - nodeDragState.lastDelta.y

        moveCanvasNodes(nodeDragState.nodeIds, {
          x: stepDeltaX,
          y: stepDeltaY,
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

        if (dropTarget) {
          addCanvasEdge({
            id: `edge-${Date.now()}`,
            fromNodeId: connectorDragState.fromNodeId,
            fromSide: connectorDragState.fromSide,
            toNodeId: dropTarget.nodeId,
            toSide: dropTarget.side,
          })
        }

        connectorDragStateRef.current = null
        setConnectorPreviewPoint(null)
        setConnectorHoverTarget(null)
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
              const geometry = getOrthogonalEdgeGeometry(fromPoint, toPoint, edge.fromSide, edge.toSide)

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

      const nextTool = TOOL_CODE_BINDINGS[event.code] ?? TOOL_KEY_BINDINGS[event.key.toLowerCase()]

      if (!nextTool) {
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
    setSelectedCanvasEdgeIds([])

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

      addCanvasNode({
        id: `node-${Date.now()}`,
        type: activeNodeType,
        x: worldX,
        y: worldY,
      })
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
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleNodePointerDown = (event: ReactPointerEvent<HTMLDivElement>, nodeId: string) => {
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
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
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
                  <StartNode labelSegments={node.startWeightingType === 'marketCap' ? [{ kind: 'text', text: 'Weight' }, { kind: 'badge', text: 'Market Cap' }] : node.startWeightingType === 'specificPercentage' ? (() => {
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
                        { kind: 'text' as const, text: 'Weight' },
                        { kind: 'badge' as const, text: 'Specific %' },
                      ]
                    }

                    if (specificEntries.length === 1) {
                      return [
                        { kind: 'text' as const, text: 'Weight' },
                        { kind: 'badge' as const, text: specificEntries[0].assetText, icon: specificEntries[0].icon },
                        { kind: 'text' as const, text: 'at' },
                        { kind: 'badge' as const, text: specificEntries[0].valueText },
                      ]
                    }

                    return [
                      { kind: 'text' as const, text: 'Weight' },
                      { kind: 'badge' as const, text: specificEntries[0].assetText, icon: specificEntries[0].icon },
                      { kind: 'text' as const, text: 'at' },
                      { kind: 'badge' as const, text: specificEntries[0].valueText },
                      { kind: 'text' as const, text: 'with' },
                      { kind: 'badge' as const, text: `+${specificEntries.length - 1}` },
                    ]
                  })() : node.startWeightingType === 'equal' ? [{ kind: 'text', text: 'Weight' }, { kind: 'badge', text: 'Equal' }] : [{ kind: 'text', text: 'Start' }]} icon={node.startWeightingType === 'marketCap' ? <ChartPieSlice size={18} weight="fill" /> : node.startWeightingType === 'specificPercentage' ? <Percent size={18} weight="bold" /> : node.startWeightingType === 'equal' ? <Play size={18} weight="fill" /> : undefined} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
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
                  <LoopNode labelSegments={node.loopType === 'timeInterval' ? [{ kind: 'text', text: 'Every' }, { kind: 'badge', text: `${node.loopIntervalValue && node.loopIntervalValue.trim().length > 0 ? node.loopIntervalValue : '0'} ${node.loopTimeUnit ? node.loopTimeUnit.charAt(0).toUpperCase() + node.loopTimeUnit.slice(1) : 'Unit'}` }] : node.loopType === 'driftThreshold' ? [{ kind: 'text', text: 'Drift' }, { kind: 'badge', text: `> ${node.loopDriftThreshold && node.loopDriftThreshold.trim().length > 0 ? `${node.loopDriftThreshold}%` : '0%'}` }] : node.loopType === 'onNewDeposit' ? node.loopDepositTiming === 'onTime' ? [{ kind: 'text', text: 'Deposit' }, { kind: 'badge', text: 'On Time' }, { kind: 'text', text: 'in' }, { kind: 'badge', text: `${node.loopDepositTimeValue && node.loopDepositTimeValue.trim().length > 0 ? node.loopDepositTimeValue : '0'} ${node.loopDepositTimeUnit ? node.loopDepositTimeUnit.charAt(0).toUpperCase() + node.loopDepositTimeUnit.slice(1) : 'Unit'}` }] : node.loopDepositTiming === 'directly' ? [{ kind: 'text', text: 'Deposit' }, { kind: 'badge', text: 'Directly' }] : [{ kind: 'text', text: 'Deposit' }, { kind: 'badge', text: 'On New Deposit' }] : [{ kind: 'text', text: 'Loop' }]} icon={node.loopType === 'timeInterval' ? <ClockCountdown size={18} weight="fill" /> : node.loopType === 'driftThreshold' ? <FunnelSimple size={18} weight="fill" /> : node.loopType === 'onNewDeposit' ? <Wallet size={18} weight="fill" /> : <ArrowsClockwise size={18} weight="bold" />} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
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
                  <IfNode labelSegments={(() => {
                    const primaryAssetNode = placedNodes.find((placedNode) => placedNode.id === node.ifPrimaryAssetNodeId)
                    const secondaryAssetNode = placedNodes.find((placedNode) => placedNode.id === node.ifSecondaryAssetNodeId)
                    const primaryAssetLabel = primaryAssetNode?.assetSymbol ?? primaryAssetNode?.assetName ?? ''
                    const secondaryAssetLabel = secondaryAssetNode?.assetSymbol ?? secondaryAssetNode?.assetName ?? ''
                    const primaryAssetIcon = primaryAssetNode?.type === 'stock' && primaryAssetNode.assetSymbol
                      ? <CanvasAssetLogo assetType="stock" symbol={primaryAssetNode.assetSymbol} size={14} />
                      : primaryAssetNode?.type === 'token' && primaryAssetNode.assetSymbol
                        ? <CanvasAssetLogo assetType="token" symbol={primaryAssetNode.assetSymbol} size={14} />
                        : undefined
                    const secondaryAssetIcon = secondaryAssetNode?.type === 'stock' && secondaryAssetNode.assetSymbol
                      ? <CanvasAssetLogo assetType="stock" symbol={secondaryAssetNode.assetSymbol} size={14} />
                      : secondaryAssetNode?.type === 'token' && secondaryAssetNode.assetSymbol
                        ? <CanvasAssetLogo assetType="token" symbol={secondaryAssetNode.assetSymbol} size={14} />
                        : undefined
                    const primaryFunctionLabel = getIfFunctionLabel(node.ifPrimaryFunction)
                    const secondaryFunctionLabel = getIfFunctionLabel(node.ifSecondaryFunction)
                    const primaryValuePrefix = getIfValuePrefix(node.ifPrimaryFunction)
                    const comparisonTargetType = node.ifComparisonTargetType ?? 'metric'

                      const segments: NodeShellLabelSegment[] = [{ kind: 'text', text: 'If' }]

                    if (primaryFunctionLabel) {
                      segments.push({ kind: 'badge' as const, text: primaryFunctionLabel })
                    }

                    if (primaryAssetLabel) {
                      segments.push({ kind: 'text' as const, text: 'of' })
                      segments.push({ kind: 'badge' as const, text: primaryAssetLabel, icon: primaryAssetIcon })
                    }

                    if (node.ifComparator) {
                      segments.push({ kind: 'text' as const, text: 'is' })
                      segments.push({ kind: 'badge' as const, text: node.ifComparator })
                    }

                    if (comparisonTargetType === 'value') {
                      if (node.ifComparisonValue && node.ifComparisonValue.trim().length > 0) {
                        segments.push({ kind: 'text' as const, text: 'value' })
                        segments.push({ kind: 'badge' as const, text: `${primaryValuePrefix}${node.ifComparisonValue.trim()}` })
                      }
                    } else {
                      if (secondaryFunctionLabel) {
                        segments.push({ kind: 'text' as const, text: 'metric' })
                        segments.push({ kind: 'badge' as const, text: secondaryFunctionLabel })
                      }

                      if (secondaryAssetLabel) {
                        segments.push({ kind: 'text' as const, text: 'of' })
                        segments.push({ kind: 'badge' as const, text: secondaryAssetLabel, icon: secondaryAssetIcon })
                      }
                    }

                    return segments
                  })()} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
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
                  <ElseNode labelSegments={(() => {
                    const primaryAssetNode = placedNodes.find((placedNode) => placedNode.id === node.elsePrimaryAssetNodeId)
                    const secondaryAssetNode = placedNodes.find((placedNode) => placedNode.id === node.elseSecondaryAssetNodeId)
                    const primaryAssetLabel = primaryAssetNode?.assetSymbol ?? primaryAssetNode?.assetName ?? ''
                    const secondaryAssetLabel = secondaryAssetNode?.assetSymbol ?? secondaryAssetNode?.assetName ?? ''
                    const primaryAssetIcon = primaryAssetNode?.type === 'stock' && primaryAssetNode.assetSymbol
                      ? <CanvasAssetLogo assetType="stock" symbol={primaryAssetNode.assetSymbol} size={14} />
                      : primaryAssetNode?.type === 'token' && primaryAssetNode.assetSymbol
                        ? <CanvasAssetLogo assetType="token" symbol={primaryAssetNode.assetSymbol} size={14} />
                        : undefined
                    const secondaryAssetIcon = secondaryAssetNode?.type === 'stock' && secondaryAssetNode.assetSymbol
                      ? <CanvasAssetLogo assetType="stock" symbol={secondaryAssetNode.assetSymbol} size={14} />
                      : secondaryAssetNode?.type === 'token' && secondaryAssetNode.assetSymbol
                        ? <CanvasAssetLogo assetType="token" symbol={secondaryAssetNode.assetSymbol} size={14} />
                        : undefined
                    const primaryFunctionLabel = getIfFunctionLabel(node.elsePrimaryFunction)
                    const secondaryFunctionLabel = getIfFunctionLabel(node.elseSecondaryFunction)
                    const primaryValuePrefix = getIfValuePrefix(node.elsePrimaryFunction)
                    const comparisonTargetType = node.elseComparisonTargetType ?? 'metric'

                      const segments: NodeShellLabelSegment[] = [{ kind: 'text', text: 'Else' }]

                    if (primaryFunctionLabel) {
                      segments.push({ kind: 'badge' as const, text: primaryFunctionLabel })
                    }

                    if (primaryAssetLabel) {
                      segments.push({ kind: 'text' as const, text: 'of' })
                      segments.push({ kind: 'badge' as const, text: primaryAssetLabel, icon: primaryAssetIcon })
                    }

                    if (node.elseComparator) {
                      segments.push({ kind: 'text' as const, text: 'is' })
                      segments.push({ kind: 'badge' as const, text: node.elseComparator })
                    }

                    if (comparisonTargetType === 'value') {
                      if (node.elseComparisonValue && node.elseComparisonValue.trim().length > 0) {
                        segments.push({ kind: 'text' as const, text: 'value' })
                        segments.push({ kind: 'badge' as const, text: `${primaryValuePrefix}${node.elseComparisonValue.trim()}` })
                      }
                    } else {
                      if (secondaryFunctionLabel) {
                        segments.push({ kind: 'text' as const, text: 'metric' })
                        segments.push({ kind: 'badge' as const, text: secondaryFunctionLabel })
                      }

                      if (secondaryAssetLabel) {
                        segments.push({ kind: 'text' as const, text: 'of' })
                        segments.push({ kind: 'badge' as const, text: secondaryAssetLabel, icon: secondaryAssetIcon })
                      }
                    }

                    return segments
                  })()} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
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
                ) : node.type === 'filter' ? (
                  <FilterNode labelSegments={(() => {
                    const targetNode = placedNodes.find((placedNode) => placedNode.id === node.filterAssetNodeId)
                    const targetLabel = targetNode?.assetSymbol ?? targetNode?.assetName ?? ''
                    const targetIcon = targetNode?.type === 'stock' && targetNode.assetSymbol
                      ? <CanvasAssetLogo assetType="stock" symbol={targetNode.assetSymbol} size={14} />
                      : targetNode?.type === 'token' && targetNode.assetSymbol
                        ? <CanvasAssetLogo assetType="token" symbol={targetNode.assetSymbol} size={14} />
                        : undefined
                    const sortLabel = node.filterSortFunction === 'currentPrice'
                      ? 'Current Price'
                      : node.filterSortFunction === 'currentMarketCap'
                        ? 'Current Market Cap'
                        : node.filterSortFunction === 'volume'
                          ? 'Volume'
                          : node.filterSortFunction === 'percentGain'
                            ? 'Percent Gain'
                            : ''
                    const orderingLabel = node.filterOrdering === 'top'
                      ? 'Top'
                      : node.filterOrdering === 'bottom'
                        ? 'Bottom'
                        : ''
                    const howManyLabel = node.filterHowMany && node.filterHowMany.trim().length > 0 ? node.filterHowMany : ''

                      const segments: NodeShellLabelSegment[] = [{ kind: 'text', text: 'Filter' }]

                    if (targetLabel) {
                      segments.push({ kind: 'badge' as const, text: targetLabel, icon: targetIcon })
                    }

                    if (sortLabel) {
                      if (targetLabel) {
                        segments.push({ kind: 'text' as const, text: 'by' })
                      }
                      segments.push({ kind: 'badge' as const, text: sortLabel })
                    }

                    if (orderingLabel) {
                      segments.push({ kind: 'text' as const, text: 'order by' })
                      segments.push({ kind: 'badge' as const, text: orderingLabel })
                    }

                    if (howManyLabel) {
                      segments.push({ kind: 'text' as const, text: 'limit' })
                      segments.push({ kind: 'badge' as const, text: howManyLabel })
                    }

                    return segments
                  })()} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
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
                ) : node.type === 'buy' ? (
                  <BuyNode
                    labelSegments={(() => {
                      const assetLabel = getLinkedAssetLabel(node.actionAssetNodeId)
                      const assetIcon = getLinkedAssetIcon(node.actionAssetNodeId)
                      const amountMode = node.actionAmountMode === 'value' ? 'Value' : 'Percentage'
                      const amountValue = node.actionAmountValue?.trim() ? node.actionAmountValue.trim() : '0'

                      return [
                        { kind: 'text' as const, text: 'Buy' },
                        { kind: 'badge' as const, text: assetLabel, icon: assetIcon },
                        { kind: 'text' as const, text: 'by' },
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
                        { kind: 'badge' as const, text: assetLabel, icon: assetIcon },
                        { kind: 'text' as const, text: 'by' },
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
                      { kind: 'text', text: 'to' },
                      { kind: 'badge', text: node.rebalanceMode === 'target' ? 'Target' : 'Equal' },
                      { kind: 'text', text: 'at' },
                      { kind: 'badge', text: `${node.rebalanceThreshold?.trim() ? node.rebalanceThreshold.trim() : '0'}%` },
                    ]}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'allocate' ? (
                  <AllocateNode
                    labelSegments={[
                      { kind: 'text', text: 'Allocate' },
                      { kind: 'text', text: 'with' },
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
                    labelSegments={[
                      { kind: 'text', text: 'Take profit' },
                      { kind: 'text', text: 'when' },
                      { kind: 'badge', text: getLinkedAssetLabel(node.riskAssetNodeId), icon: getLinkedAssetIcon(node.riskAssetNodeId) },
                      { kind: 'badge', text: node.riskComparator ?? '>=' },
                      { kind: 'badge', text: `$${node.riskThresholdValue?.trim() ? node.riskThresholdValue.trim() : '0'}` },
                    ]}
                    icon={<TrendUp size={18} weight="bold" />}
                    {...getCommonNodeProps(node.id)}
                  />
                ) : node.type === 'stopLoss' ? (
                  <StopLossNode
                    labelSegments={[
                      { kind: 'text', text: 'Stop loss' },
                      { kind: 'text', text: 'when' },
                      { kind: 'badge', text: getLinkedAssetLabel(node.riskAssetNodeId), icon: getLinkedAssetIcon(node.riskAssetNodeId) },
                      { kind: 'badge', text: node.riskComparator ?? '<=' },
                      { kind: 'badge', text: `$${node.riskThresholdValue?.trim() ? node.riskThresholdValue.trim() : '0'}` },
                    ]}
                    icon={<TrendDown size={18} weight="bold" />}
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
                  <EndNode labelSegments={node.endType === 'priceReaches' ? (() => {
                    const targetNode = placedNodes.find((placedNode) => placedNode.id === node.endAssetNodeId)
                    const targetLabel = targetNode?.assetSymbol ?? targetNode?.assetName ?? 'Asset'
                    const targetIcon = targetNode?.type === 'stock' && targetNode.assetSymbol
                      ? <CanvasAssetLogo assetType="stock" symbol={targetNode.assetSymbol} size={14} />
                      : targetNode?.type === 'token' && targetNode.assetSymbol
                        ? <CanvasAssetLogo assetType="token" symbol={targetNode.assetSymbol} size={14} />
                        : undefined

                    return [
                      { kind: 'text' as const, text: 'Price' },
                      { kind: 'badge' as const, text: targetLabel, icon: targetIcon },
                      { kind: 'text' as const, text: 'reaches' },
                      { kind: 'badge' as const, text: `${node.endOperator ?? ''} ${node.endTargetValue && node.endTargetValue.trim().length > 0 ? `$${node.endTargetValue}` : '$0'}`.trim() },
                    ]
                  })() : node.endType === 'portfolioValue' ? [{ kind: 'text', text: 'Portfolio' }, { kind: 'text', text: 'reaches' }, { kind: 'badge', text: `${node.endOperator ?? ''} ${node.endTargetValue && node.endTargetValue.trim().length > 0 ? `$${node.endTargetValue}` : '$0'}`.trim() }] : node.endType === 'timeBased' ? [{ kind: 'text', text: 'Time' }, { kind: 'text', text: 'after' }, { kind: 'badge', text: `${node.endTimeValue && node.endTimeValue.trim().length > 0 ? node.endTimeValue : '0'} ${node.endTimeUnit ? node.endTimeUnit.charAt(0).toUpperCase() + node.endTimeUnit.slice(1) : 'Unit'}` }] : node.endType === 'maxDrawdown' ? [{ kind: 'text', text: 'Max drawdown' }, { kind: 'text', text: 'hits' }, { kind: 'badge', text: `${node.endOperator ?? '<='} ${node.endTargetValue && node.endTargetValue.trim().length > 0 ? `${node.endTargetValue}%` : '0%'}`.trim() }] : node.endType === 'dailyLoss' ? [{ kind: 'text', text: 'Daily loss' }, { kind: 'text', text: 'hits' }, { kind: 'badge', text: `${node.endOperator ?? '<='} ${node.endTargetValue && node.endTargetValue.trim().length > 0 ? `${node.endTargetValue}%` : '0%'}`.trim() }] : node.endType === 'exposureLimit' ? [{ kind: 'text', text: 'Exposure' }, { kind: 'text', text: 'exceeds' }, { kind: 'badge', text: `${node.endOperator ?? '>='} ${node.endTargetValue && node.endTargetValue.trim().length > 0 ? `${node.endTargetValue}%` : '0%'}`.trim() }] : node.endType === 'positionConcentration' ? [{ kind: 'text', text: 'Position' }, { kind: 'text', text: 'exceeds' }, { kind: 'badge', text: `${node.endOperator ?? '>='} ${node.endTargetValue && node.endTargetValue.trim().length > 0 ? `${node.endTargetValue}%` : '0%'}`.trim() }] : node.endType === 'volatilityLimit' ? [{ kind: 'text', text: 'Volatility' }, { kind: 'text', text: 'exceeds' }, { kind: 'badge', text: `${node.endOperator ?? '>='} ${node.endTargetValue && node.endTargetValue.trim().length > 0 ? `${node.endTargetValue}%` : '0%'}`.trim() }] : [{ kind: 'text', text: 'End' }]} icon={node.endType === 'priceReaches' ? <ChartLineUp size={18} weight="bold" /> : node.endType === 'portfolioValue' ? <Wallet size={18} weight="fill" /> : node.endType === 'timeBased' ? <ClockCountdown size={18} weight="fill" /> : node.endType === 'maxDrawdown' ? <TrendDown size={18} weight="bold" /> : node.endType === 'dailyLoss' ? <ShieldWarning size={18} weight="fill" /> : node.endType === 'exposureLimit' ? <Percent size={18} weight="bold" /> : node.endType === 'positionConcentration' ? <Wallet size={18} weight="fill" /> : node.endType === 'volatilityLimit' ? <WaveSine size={18} weight="bold" /> : <FlagCheckered size={18} weight="fill" />} selected={selectedNodeIds.includes(node.id)} activeConnectorSide={connectorDragStateRef.current?.fromNodeId === node.id ? connectorDragStateRef.current.fromSide : connectorHoverTarget?.nodeId === node.id ? connectorHoverTarget.side : null} onConnectorPointerDown={(side, event) => handleConnectorPointerDown(event, node.id, side)} onMeasure={(size) => {
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
              const geometry = getOrthogonalEdgeGeometry(fromPoint, toPoint, edge.fromSide, edge.toSide)
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
                    stroke={selectedEdgeIds.includes(edge.id) ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)'}
                    strokeWidth={selectedEdgeIds.includes(edge.id) ? '3' : '2'}
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
              const geometry = getOrthogonalEdgeGeometry(fromPoint, toPoint, edge.fromSide, edge.toSide)

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
        </div>
      </div>

    </div>
  )
}
