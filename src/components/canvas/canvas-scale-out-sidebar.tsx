import type { CanvasNodeRecord } from '../../state/canvas-node-store'
import { CanvasScaleOutSidebarBase } from './canvas-action-sidebar-base'

export default function CanvasScaleOutSidebar({ active, node, onClose, onPercentChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onPercentChange: (value: string) => void }) {
  return <CanvasScaleOutSidebarBase active={active} node={node} onClose={onClose} onPercentChange={onPercentChange} />
}
