import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell, { type NodeShellLabelSegment } from '../shared/node-shell'

type IntersectNodeProps = {
  label?: string
  labelSegments?: NodeShellLabelSegment[]
  icon?: ReactNode
  selected?: boolean
  activeConnectorSide?: CanvasConnectorSide | null
  invalidConnectorSide?: CanvasConnectorSide | null
  connectedConnectorSides?: CanvasConnectorSide[]
  onConnectorPointerDown?: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => void
  onMeasure?: (size: { width: number; height: number }) => void
}

const textIcon = <span style={{ fontFamily: 'var(--canvas-font-sans)', fontSize: 10, fontWeight: 800, lineHeight: 1 }}>ALL</span>

export default function IntersectNode({ label = 'Match All', labelSegments, icon, selected = false, activeConnectorSide = null, invalidConnectorSide = null, connectedConnectorSides = [], onConnectorPointerDown, onMeasure }: IntersectNodeProps) {
  return <NodeShell icon={icon ?? textIcon} label={label} labelSegments={labelSegments} selected={selected} activeConnectorSide={activeConnectorSide} invalidConnectorSide={invalidConnectorSide} connectedConnectorSides={connectedConnectorSides} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
