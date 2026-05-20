## Canvas Action, Portfolio, and Risk Nodes MVP

### Scope

Add seven new node types to the canvas strategy builder:

- Buy
- Sell
- Rebalance
- Allocate
- Scale Out
- Take Profit
- Stop Loss

Add three new dock groups:

- Actions: Buy, Sell, Rebalance
- Portfolio: Allocate, Scale Out
- Risk: Take Profit, Stop Loss

Each node gets:

- Its own node component under `src/components/nodes/<type>/`
- Its own sidebar component under `src/components/canvas/`
- A horizontal summary phrase using bridging text and badges

### Architecture

This MVP follows the existing canvas architecture.

- Extend `CanvasNodeType` with the seven new node types.
- Extend `CanvasNodeRecord` with flat per-node configuration fields.
- Keep per-type node rendering in `canvas-viewport.tsx`.
- Keep sidebar routing in `src/pages/canvas/staging/index.tsx`.
- Reuse `NodeShell` for visual consistency.
- Reuse `CanvasNodeSidebarHeader`, `CanvasSidebarFieldSection`, and `DropdownMenu` for sidebar consistency.

This avoids a larger refactor to a generic node config object and keeps changes localized.

### Data Model

#### Buy / Sell

- `actionAssetNodeId?: string`
- `actionAmountMode?: 'percentage' | 'value'`
- `actionAmountValue?: string`

#### Rebalance

- `rebalanceMode?: 'equal' | 'target'`

For MVP, `target` is stored as a mode only and does not yet manage per-asset allocations.

#### Allocate

- `allocateWeightingMode?: 'percentage' | 'value'`
- `allocateAmountValue?: string`

#### Scale Out

- `scaleOutPercent?: string`

#### Take Profit / Stop Loss

- `riskAssetNodeId?: string`
- `riskComparator?: '>' | '<' | '>=' | '<='`
- `riskThresholdValue?: string`

### UX

#### Dock

Add three new dropdown menus using the same dock interaction pattern:

- Actions
- Portfolio
- Risk

Each menu participates in the same keyboard behavior already supported by `DropdownMenu`:

- open by shortcut
- move with arrow keys
- select with Enter
- close with Esc

#### Sidebars

Each new node gets its own sidebar file, but all sidebars reuse shared canvas sidebar primitives.

Buy and Sell sidebars include:

- target asset selection
- amount mode selection
- amount value input

Rebalance sidebar includes:

- mode selection: Equal or Target

Allocate sidebar includes:

- weighting mode selection
- amount input

Scale Out sidebar includes:

- reduce-by-percent input

Take Profit and Stop Loss sidebars include:

- target asset selection
- comparator selection with full symbol set: `>`, `<`, `>=`, `<=`
- threshold input

### Summary Phrases

Summaries remain horizontal and compact.

- Buy: `Buy [Asset] by [mode] [value]`
- Sell: `Sell [Asset] by [mode] [value]`
- Rebalance: `Rebalance to [mode]`
- Allocate: `Allocate with [mode] [value]`
- Scale Out: `Scale out by [percent]`
- Take Profit: `Take profit when [Asset] [comparator] [threshold]`
- Stop Loss: `Stop loss when [Asset] [comparator] [threshold]`

Asset and value parts are rendered as badges where possible.

### Verification

Verify:

- dock menus open and create the correct node type
- new nodes render and connect like existing nodes
- sidebars appear on single selection
- updates persist through graph store mutations
- node summaries update after edits
- sidebar dropdowns render through portal without clipping

The repository may still have unrelated pre-existing TypeScript errors outside this scope.
