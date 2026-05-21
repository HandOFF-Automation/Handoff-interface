import { FunnelSimple } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell, { type NodeShellLabelSegment } from '../shared/node-shell'

type FilterNodeProps = {
  label?: string
  labelBadge?: string
  labelBadges?: string[]
  labelSegments?: NodeShellLabelSegment[]
  inlineControl?: ReactNode
  icon?: ReactNode
  selected?: boolean
  activeConnectorSide?: CanvasConnectorSide | null
  invalidConnectorSide?: CanvasConnectorSide | null
  connectedConnectorSides?: CanvasConnectorSide[]
  onConnectorPointerDown?: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => void
  onMeasure?: (size: { width: number; height: number }) => void
}

export default function FilterNode({ label = 'Filter', labelBadge, labelBadges, labelSegments, inlineControl, icon, selected = false, activeConnectorSide = null, invalidConnectorSide = null, connectedConnectorSides = [], onConnectorPointerDown, onMeasure }: FilterNodeProps) {
  return <NodeShell icon={icon ?? <FunnelSimple size={18} weight="fill" />} label={label} labelBadge={labelBadge} labelBadges={labelBadges} labelSegments={labelSegments} inlineControl={inlineControl} selected={selected} activeConnectorSide={activeConnectorSide} invalidConnectorSide={invalidConnectorSide} connectedConnectorSides={connectedConnectorSides} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
