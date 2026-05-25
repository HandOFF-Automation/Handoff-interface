import { WaveSine } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell, { type NodeShellLabelSegment } from '../shared/node-shell'

type RethinkNodeProps = {
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

export default function RethinkNode({ label = 'Rethink', labelSegments, icon, selected = false, activeConnectorSide = null, invalidConnectorSide = null, connectedConnectorSides = [], onConnectorPointerDown, onMeasure }: RethinkNodeProps) {
  return <NodeShell icon={icon ?? <WaveSine size={18} weight="duotone" />} label={label} labelSegments={labelSegments} selected={selected} activeConnectorSide={activeConnectorSide} invalidConnectorSide={invalidConnectorSide} connectedConnectorSides={connectedConnectorSides} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
