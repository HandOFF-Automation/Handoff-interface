import type { CanvasActionAmountMode, CanvasNodeRecord } from '../../state/canvas-node-store'
import { CanvasTradeSidebar } from './canvas-action-sidebar-base'

type AssetOption = { id: string; type: 'stock' | 'token'; assetSymbol?: string; assetName?: string }

export default function CanvasSellSidebar({ active, node, assetNodeOptions, onClose, onAssetChange, onAmountModeChange, onAmountValueChange, onBehaviorChange }: { active: boolean; node: CanvasNodeRecord | null; assetNodeOptions: AssetOption[]; onClose: () => void; onAssetChange: (value: string) => void; onAmountModeChange: (value: CanvasActionAmountMode) => void; onAmountValueChange: (value: string) => void; onBehaviorChange: (value: string) => void }) {
  return <CanvasTradeSidebar active={active} node={node} nodeTitle="Sell Node" nodeDescription="Sells a connected asset when the current branch should reduce or exit exposure." helpBody="The Sell node chooses an asset, amount style, and exit behavior so the branch is easier to understand at a glance." actionLabel="Sell" assetNodeOptions={assetNodeOptions} onClose={onClose} onAssetChange={onAssetChange} onAmountModeChange={onAmountModeChange} onAmountValueChange={onAmountValueChange} onBehaviorChange={onBehaviorChange} />
}
