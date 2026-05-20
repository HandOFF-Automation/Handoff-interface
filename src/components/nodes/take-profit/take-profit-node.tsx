import { TrendUp } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell, { type NodeShellLabelSegment } from '../shared/node-shell'

type TakeProfitNodeProps = {
  label?: string
  labelSegments?: NodeShellLabelSegment[]
  icon?: ReactNode
  selected?: boolean
  activeConnectorSide?: CanvasConnectorSide | null
  onConnectorPointerDown?: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => void
  onMeasure?: (size: { width: number; height: number }) => void
}

export default function TakeProfitNode({ label = 'Take Profit', labelSegments, icon, selected = false, activeConnectorSide = null, onConnectorPointerDown, onMeasure }: TakeProfitNodeProps) {
  return <NodeShell icon={icon ?? <TrendUp size={18} weight="bold" />} label={label} labelSegments={labelSegments} selected={selected} activeConnectorSide={activeConnectorSide} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
