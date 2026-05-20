import { Coin } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

import type { CanvasConnectorSide } from '../../../state/canvas-edge-store'
import NodeShell from '../shared/node-shell'

type TokenNodeProps = {
  label?: string
  icon?: ReactNode
  selected?: boolean
  activeConnectorSide?: CanvasConnectorSide | null
  onConnectorPointerDown?: (side: CanvasConnectorSide, event: React.PointerEvent<HTMLButtonElement>) => void
  onMeasure?: (size: { width: number; height: number }) => void
}

export default function TokenNode({ label = 'Token', icon, selected = false, activeConnectorSide = null, onConnectorPointerDown, onMeasure }: TokenNodeProps) {
  return <NodeShell icon={icon ?? <Coin size={18} weight="fill" />} label={label} selected={selected} activeConnectorSide={activeConnectorSide} onConnectorPointerDown={onConnectorPointerDown} onMeasure={onMeasure} />
}
