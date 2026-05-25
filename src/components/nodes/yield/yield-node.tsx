import { Drop } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell from '../shared/node-shell'

type YieldNodeProps = {
  label?: string
  icon?: ReactNode
  selected?: boolean
  activeConnectorSide?: CanvasConnectorSide | null
  onConnectorPointerDown?: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => void
  onMeasure?: (size: { width: number; height: number }) => void
}

export default function YieldNode({ label = 'Yield', icon, selected = false, activeConnectorSide = null, onConnectorPointerDown, onMeasure }: YieldNodeProps) {
  return <NodeShell icon={icon ?? <Drop size={18} weight="fill" />} label={label} selected={selected} activeConnectorSide={activeConnectorSide} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
