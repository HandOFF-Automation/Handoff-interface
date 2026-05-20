import type { CanvasNodeRecord, CanvasRebalanceMode } from '../../state/canvas-node-store'
import { CanvasRebalanceSidebarBase } from './canvas-action-sidebar-base'

export default function CanvasRebalanceSidebar({ active, node, onClose, onModeChange, onThresholdChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onModeChange: (value: CanvasRebalanceMode) => void; onThresholdChange: (value: string) => void }) {
  return <CanvasRebalanceSidebarBase active={active} node={node} onClose={onClose} onModeChange={onModeChange} onThresholdChange={onThresholdChange} />
}
