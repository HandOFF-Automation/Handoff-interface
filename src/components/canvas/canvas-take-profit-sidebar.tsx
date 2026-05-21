import type { CanvasNodeRecord, CanvasRiskComparator } from '../../state/canvas-node-store'
import { CanvasRiskSidebarBase } from './canvas-action-sidebar-base'

type AssetOption = { id: string; type: 'stock' | 'token'; assetSymbol?: string; assetName?: string }

export default function CanvasTakeProfitSidebar({ active, node, assetNodeOptions, onClose, onAssetChange, onComparatorChange, onThresholdChange, onModeChange }: { active: boolean; node: CanvasNodeRecord | null; assetNodeOptions: AssetOption[]; onClose: () => void; onAssetChange: (value: string) => void; onComparatorChange: (value: CanvasRiskComparator) => void; onThresholdChange: (value: string) => void; onModeChange: (value: string) => void }) {
  return <CanvasRiskSidebarBase active={active} node={node} nodeTitle="Take Profit Node" nodeDescription="Closes or reacts when this branch reaches a profit threshold." helpBody="The Take Profit node now supports single, partial, and ladder styles so the canvas reads closer to a real strategy plan." assetNodeOptions={assetNodeOptions} onClose={onClose} onAssetChange={onAssetChange} onComparatorChange={onComparatorChange} onThresholdChange={onThresholdChange} onModeChange={onModeChange} />
}
