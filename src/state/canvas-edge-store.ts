import { commitCanvasGraphMutation, useCanvasGraph } from './canvas-graph-store'

export type CanvasConnectorSide = 'top' | 'right' | 'bottom' | 'left'

export type CanvasEdgeRecord = {
  id: string
  fromNodeId: string
  fromSide: CanvasConnectorSide
  toNodeId: string
  toSide: CanvasConnectorSide
}

export function addCanvasEdge(edge: CanvasEdgeRecord) {
  commitCanvasGraphMutation((current) => {
    const duplicate = current.edges.some(
      (existing) =>
        existing.fromNodeId === edge.fromNodeId &&
        existing.fromSide === edge.fromSide &&
        existing.toNodeId === edge.toNodeId &&
        existing.toSide === edge.toSide,
    )

    if (duplicate) {
      return current
    }

    return {
      ...current,
      edges: [...current.edges, edge],
      selectedEdgeIds: [edge.id],
    }
  })
}

export function setSelectedCanvasEdgeId(edgeId: string | null) {
  const nextSelectedEdgeIds = edgeId ? [edgeId] : []

  commitCanvasGraphMutation((current) => ({
    ...current,
    selectedEdgeIds: nextSelectedEdgeIds,
  }))
}

export function setSelectedCanvasEdgeIds(edgeIds: string[]) {
  const uniqueEdgeIds = Array.from(new Set(edgeIds))

  commitCanvasGraphMutation((current) => ({
    ...current,
    selectedEdgeIds: uniqueEdgeIds,
  }))
}

export function removeCanvasEdge(edgeId: string) {
  removeCanvasEdges([edgeId])
}

export function removeCanvasEdges(edgeIds: string[]) {
  if (edgeIds.length === 0) {
    return
  }

  const edgeIdSet = new Set(edgeIds)

  commitCanvasGraphMutation((current) => ({
    ...current,
    edges: current.edges.filter((edge) => !edgeIdSet.has(edge.id)),
    selectedEdgeIds: current.selectedEdgeIds.filter((currentId) => !edgeIdSet.has(currentId)),
  }))
}


export function useCanvasEdges() {
  const snapshot = useCanvasGraph()

  return {
    edges: snapshot.edges,
    selectedEdgeIds: snapshot.selectedEdgeIds,
  }
}
