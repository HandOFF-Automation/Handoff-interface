import type { CanvasNodeRecord, CanvasRiskComparator } from '../../state/canvas-node-store'
import { CanvasRiskSidebarBase } from './canvas-action-sidebar-base'

type AssetOption = { id: string; type: 'stock' | 'token'; assetSymbol?: string; assetName?: string }

export default function CanvasStopLossSidebar({ active, node, assetNodeOptions, onClose, onAssetChange, onComparatorChange, onThresholdChange, onModeChange }: { active: boolean; node: CanvasNodeRecord | null; assetNodeOptions: AssetOption[]; onClose: () => void; onAssetChange: (value: string) => void; onComparatorChange: (value: CanvasRiskComparator) => void; onThresholdChange: (value: string) => void; onModeChange: (value: string) => void }) {
  return <CanvasRiskSidebarBase active={active} node={node} nodeTitle="Stop Loss Node" nodeDescription="Closes or reacts when this branch hits a loss threshold." helpBody="The Stop Loss node now supports fixed, trailing, and break-even styles so the visual logic feels more complete." assetNodeOptions={assetNodeOptions} onClose={onClose} onAssetChange={onAssetChange} onComparatorChange={onComparatorChange} onThresholdChange={onThresholdChange} onModeChange={onModeChange} />
}
