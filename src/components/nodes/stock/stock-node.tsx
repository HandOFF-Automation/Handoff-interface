import { TrendUp } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell from '../shared/node-shell'

type StockNodeProps = {
  label?: string
  icon?: ReactNode
  selected?: boolean
  activeConnectorSide?: CanvasConnectorSide | null
  onConnectorPointerDown?: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => void
  onMeasure?: (size: { width: number; height: number }) => void
}

export default function StockNode({ label = 'Stock', icon, selected = false, activeConnectorSide = null, onConnectorPointerDown, onMeasure }: StockNodeProps) {
  return <NodeShell icon={icon ?? <TrendUp size={18} weight="bold" />} label={label} selected={selected} activeConnectorSide={activeConnectorSide} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
