import { FlagCheckered } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell, { type NodeShellLabelSegment } from '../shared/node-shell'

type EndNodeProps = {
  label?: string
  labelBadge?: string
  labelSegments?: NodeShellLabelSegment[]
  icon?: ReactNode
  selected?: boolean
  activeConnectorSide?: CanvasConnectorSide | null
  onConnectorPointerDown?: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => void
  onMeasure?: (size: { width: number; height: number }) => void
}

export default function EndNode({ label = 'End', labelBadge, labelSegments, icon, selected = false, activeConnectorSide = null, onConnectorPointerDown, onMeasure }: EndNodeProps) {
  return <NodeShell icon={icon ?? <FlagCheckered size={18} weight="fill" />} label={label} labelBadge={labelBadge} labelSegments={labelSegments} selected={selected} activeConnectorSide={activeConnectorSide} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
