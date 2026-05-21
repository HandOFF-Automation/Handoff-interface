import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell, { type NodeShellLabelSegment } from '../shared/node-shell'

type OrNodeProps = {
  label?: string
  labelSegments?: NodeShellLabelSegment[]
  icon?: ReactNode
  selected?: boolean
  activeConnectorSide?: CanvasConnectorSide | null
  connectedConnectorSides?: CanvasConnectorSide[]
  onConnectorPointerDown?: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => void
  onMeasure?: (size: { width: number; height: number }) => void
}

const textIcon = (
  <span style={{ fontFamily: 'var(--canvas-font-sans)', fontSize: 12, fontWeight: 800, lineHeight: 1, letterSpacing: '0.08em' }}>
    OR
  </span>
)

export default function OrNode({ label = 'OR', labelSegments, icon, selected = false, activeConnectorSide = null, connectedConnectorSides = [], onConnectorPointerDown, onMeasure }: OrNodeProps) {
  return <NodeShell icon={icon ?? textIcon} label={label} labelSegments={labelSegments} selected={selected} activeConnectorSide={activeConnectorSide} connectedConnectorSides={connectedConnectorSides} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
