import type { CanvasNodeRecord, CanvasRiskComparator } from '../../state/canvas-node-store'
import { CanvasRiskSidebarBase } from './canvas-action-sidebar-base'

type AssetOption = { id: string; type: 'stock' | 'token'; assetSymbol?: string; assetName?: string }

export default function CanvasStopLossSidebar({ active, node, assetNodeOptions, onClose, onAssetChange, onComparatorChange, onThresholdChange }: { active: boolean; node: CanvasNodeRecord | null; assetNodeOptions: AssetOption[]; onClose: () => void; onAssetChange: (value: string) => void; onComparatorChange: (value: CanvasRiskComparator) => void; onThresholdChange: (value: string) => void }) {
  return <CanvasRiskSidebarBase active={active} node={node} nodeTitle="Stop Loss Node" nodeDescription="Closes or reacts when a loss threshold is reached." helpBody="The stop loss node watches a connected asset and compares it against a threshold using a configurable comparator." assetNodeOptions={assetNodeOptions} onClose={onClose} onAssetChange={onAssetChange} onComparatorChange={onComparatorChange} onThresholdChange={onThresholdChange} />
}
