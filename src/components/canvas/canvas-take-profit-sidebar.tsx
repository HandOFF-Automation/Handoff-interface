import type { CanvasNodeRecord, CanvasRiskComparator } from '../../state/canvas-node-store'
import { CanvasRiskSidebarBase } from './canvas-action-sidebar-base'

type AssetOption = { id: string; type: 'stock' | 'token'; assetSymbol?: string; assetName?: string }

export default function CanvasTakeProfitSidebar({ active, node, assetNodeOptions, onClose, onAssetChange, onComparatorChange, onThresholdChange }: { active: boolean; node: CanvasNodeRecord | null; assetNodeOptions: AssetOption[]; onClose: () => void; onAssetChange: (value: string) => void; onComparatorChange: (value: CanvasRiskComparator) => void; onThresholdChange: (value: string) => void }) {
  return <CanvasRiskSidebarBase active={active} node={node} nodeTitle="Take Profit Node" nodeDescription="Closes or reacts when a profit threshold is reached." helpBody="The take profit node watches a connected asset and compares it against a threshold using a configurable comparator." assetNodeOptions={assetNodeOptions} onClose={onClose} onAssetChange={onAssetChange} onComparatorChange={onComparatorChange} onThresholdChange={onThresholdChange} />
}
