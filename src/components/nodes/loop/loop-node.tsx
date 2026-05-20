import { ArrowsClockwise } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell, { type NodeShellLabelSegment } from '../shared/node-shell'

type LoopNodeProps = {
  label?: string
  labelBadge?: string
  labelSegments?: NodeShellLabelSegment[]
  icon?: ReactNode
  selected?: boolean
  activeConnectorSide?: CanvasConnectorSide | null
  onConnectorPointerDown?: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => void
  onMeasure?: (size: { width: number; height: number }) => void
}

export default function LoopNode({ label = 'Loop', labelBadge, labelSegments, icon, selected = false, activeConnectorSide = null, onConnectorPointerDown, onMeasure }: LoopNodeProps) {
  return <NodeShell icon={icon ?? <ArrowsClockwise size={18} weight="bold" />} label={label} labelBadge={labelBadge} labelSegments={labelSegments} selected={selected} activeConnectorSide={activeConnectorSide} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
