import type { CanvasActionAmountMode, CanvasNodeRecord } from '../../state/canvas-node-store'
import { CanvasTradeSidebar } from './canvas-action-sidebar-base'

type AssetOption = { id: string; type: 'stock' | 'token'; assetSymbol?: string; assetName?: string }

export default function CanvasBuySidebar({ active, node, assetNodeOptions, onClose, onAssetChange, onAmountModeChange, onAmountValueChange, onBehaviorChange }: { active: boolean; node: CanvasNodeRecord | null; assetNodeOptions: AssetOption[]; onClose: () => void; onAssetChange: (value: string) => void; onAmountModeChange: (value: CanvasActionAmountMode) => void; onAmountValueChange: (value: string) => void; onBehaviorChange: (value: string) => void }) {
  return <CanvasTradeSidebar active={active} node={node} nodeTitle="Buy Node" nodeDescription="Buys a connected asset when the current branch should enter a position." helpBody="The Buy node chooses an asset, amount style, and entry behavior so the branch reads more naturally in the builder." actionLabel="Buy" assetNodeOptions={assetNodeOptions} onClose={onClose} onAssetChange={onAssetChange} onAmountModeChange={onAmountModeChange} onAmountValueChange={onAmountValueChange} onBehaviorChange={onBehaviorChange} />
}
