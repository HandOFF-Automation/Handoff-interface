import type { CanvasActionAmountMode, CanvasNodeRecord } from '../../state/canvas-node-store'
import { CanvasTradeSidebar } from './canvas-action-sidebar-base'

type AssetOption = { id: string; type: 'stock' | 'token'; assetSymbol?: string; assetName?: string }

export default function CanvasSellSidebar({ active, node, assetNodeOptions, onClose, onAssetChange, onAmountModeChange, onAmountValueChange }: { active: boolean; node: CanvasNodeRecord | null; assetNodeOptions: AssetOption[]; onClose: () => void; onAssetChange: (value: string) => void; onAmountModeChange: (value: CanvasActionAmountMode) => void; onAmountValueChange: (value: string) => void }) {
  return <CanvasTradeSidebar active={active} node={node} nodeTitle="Sell Node" nodeDescription="Sells a connected asset using a simple amount rule." helpBody="The sell node chooses an asset and an amount to sell using either a percentage or fixed value." actionLabel="Sell" assetNodeOptions={assetNodeOptions} onClose={onClose} onAssetChange={onAssetChange} onAmountModeChange={onAmountModeChange} onAmountValueChange={onAmountValueChange} />
}
