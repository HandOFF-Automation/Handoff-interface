import { ChartPieSlice } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell, { type NodeShellLabelSegment } from '../shared/node-shell'

type AllocateNodeProps = {
  label?: string
  labelSegments?: NodeShellLabelSegment[]
  icon?: ReactNode
  selected?: boolean
  activeConnectorSide?: CanvasConnectorSide | null
  onConnectorPointerDown?: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => void
  onMeasure?: (size: { width: number; height: number }) => void
}

export default function AllocateNode({ label = 'Allocate', labelSegments, icon, selected = false, activeConnectorSide = null, onConnectorPointerDown, onMeasure }: AllocateNodeProps) {
  return <NodeShell icon={icon ?? <ChartPieSlice size={18} weight="fill" />} label={label} labelSegments={labelSegments} selected={selected} activeConnectorSide={activeConnectorSide} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
