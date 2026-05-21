import { Percent } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell, { type NodeShellLabelSegment } from '../shared/node-shell'

type PositionCountLimitNodeProps = {
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

export default function PositionCountLimitNode({ label = 'Position Count Limit', labelSegments, icon, selected = false, activeConnectorSide = null, invalidConnectorSide = null, connectedConnectorSides = [], onConnectorPointerDown, onMeasure }: PositionCountLimitNodeProps) {
  return <NodeShell icon={icon ?? <Percent size={18} weight="bold" />} label={label} labelSegments={labelSegments} selected={selected} activeConnectorSide={activeConnectorSide} invalidConnectorSide={invalidConnectorSide} connectedConnectorSides={connectedConnectorSides} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
