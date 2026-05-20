import type { CanvasAllocateWeightingMode, CanvasNodeRecord } from '../../state/canvas-node-store'
import { CanvasAllocateSidebarBase } from './canvas-action-sidebar-base'

export default function CanvasAllocateSidebar({ active, node, onClose, onModeChange, onAmountValueChange }: { active: boolean; node: CanvasNodeRecord | null; onClose: () => void; onModeChange: (value: CanvasAllocateWeightingMode) => void; onAmountValueChange: (value: string) => void }) {
  return <CanvasAllocateSidebarBase active={active} node={node} onClose={onClose} onModeChange={onModeChange} onAmountValueChange={onAmountValueChange} />
}
