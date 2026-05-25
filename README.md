# Handoff Interface

<p>
  <img src="./src/assets/icon/icon%20handoff.png" alt="Handoff Interface" width="72" align="left">
</p>

# Handoff Interface

Frontend workspace for Handoff's visual strategy builder.

Handoff is a protocol direction for building onchain strategy workflows, with Mantle as one of the intended environments for deployment and execution. Handoff Interface is the visual layer of that system: a frontend-first canvas for designing strategy logic, configuring node behavior, shaping portfolio and risk flows, and preparing strategy graphs that can later connect to backend services, agents, APIs, contracts, and onchain deployment surfaces.

---

## What This Project Is

Handoff Interface is a frontend-first canvas product for composing investment, portfolio, and risk workflows visually.

Core goals:

| No | Goal | Description |
|---|---|---|
| 1 | Build strategy flows | Compose strategy graphs directly on a canvas |
| 2 | Configure node behavior | Use node sidebars for logic, portfolio, and risk settings |
| 3 | Connect graph stages | Link assets, filters, conditions, and actions in one flow |
| 4 | Support collaboration | Add inline comments and annotations inside the workspace |
| 5 | Prepare future execution | Shape strategy definitions that can later connect to agents, APIs, or contracts |

Workspace split:

| Workspace | Responsibility |
|---|---|
| [`handoff-interface`](https://github.com/HandOFF-Automation/Handoff-interface.git) | Frontend canvas, UX, comments, configuration, strategy editing |
| `handoff-backend` | Backend services, APIs, orchestration, and future execution plumbing |
| `Handoff-contract` | Contract-side execution and deployment logic |
---

## Current Highlights

The current implementation is strongest around the canvas editor and node system.

| No | Highlight | Notes |
|---|---|---|
| 1 | Canvas interaction | Figma-like pan, zoom, drag, marquee select, and alignment guides |
| 2 | Theming | Light and dark themes using shared canvas tokens from `src/index.css` |
| 3 | Dock menus | Grouped menus for `Pointer`, `Flow`, `Logic`, `Asset Type`, `Execution`, and `Zoom` |
| 4 | Canvas title | Editable title on `/canvas/staging` |
| 5 | Node sidebars | Typed sidebars for selected nodes |
| 6 | Connector labels | Config-driven edge labels |
| 7 | Edge rendering | Orthogonal edge rendering with preview connections |
| 8 | Filter UX | Inline filter asset-view switching |
| 9 | Context menu | Delete, copy, and paste actions |
| 10 | Keyboard support | Dropdown navigation, undo, redo, copy, paste, and node nudging |
| 11 | Connection rules | Centralized under `src/config/canvas-connection/` |
| 12 | Debug tools | Built-in debug dropdown panel for validation visibility |
| 13 | Templates | Registry for loading realistic strategy graphs |

---

## Supported Assets

Handoff interface supports the following assets on Mantle for strategy building and portfolio management:

### Core Assets (MVP)
| Asset | Type | Purpose |
|-------|------|---------|
| **USDC** | Stablecoin | Primary settlement and trading pair |
| **MNT** | Native Token | Gas fees and native rewards |

### RWA Assets (Differentiation)
| Asset | Type | Purpose |
|-------|------|---------|
| **USDY** | RWA Stablecoin | Yield strategies and RWA focus |
| **mETH** | RWA Asset | Risk management and collateral |

### Extended Assets (Phase 2)
| Asset | Type | Purpose |
|-------|------|---------|
| **WETH** | Wrapped ETH | Diversification and collateral |
| **FBTC** | Omnichain BTC | Mantle's core Bitcoin yield integration |
| **USDe** | Synthetic Dollar | Delta-neutral yield (Ethena integration) |
| **USDT** | Stablecoin | Alternative settlement |
| **cmETH** | Restaked ETH | Advanced yield and restaking strategies |
| **COOK** | Governance Token | Mantle LSP reward harvesting and auto-compounding |
| **wstETH** | Liquid Staking | Yield and staking strategies |
| **MNT LP Tokens** | DEX LP | Liquidity provision strategies |
| **Mantle LSP** | Liquid Staking | Native staking yield |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | `React` |
| Language | `TypeScript` |
| Build Tool | `Vite` |
| Icons | `Phosphor Icons` |

---

## Installation

| Step | Command | Purpose |
|---|---|---|
| 1 | `git clone https://github.com/HandOFF-Automation/Handoff-interface.git` | Clone the repository |
| 2 | `cd Handoff-interface` | Enter the project folder |
| 3 | `npm install` | Install dependencies |
| 4 | `npm run dev` | Run the development server |
| 5 | `npm run build` | Create a production build |

Note: the canvas workspace is actively implemented, but the repo may still contain unrelated TypeScript build errors outside the current canvas scope.

---

## Environment Notes

| Item | Value / Note |
|---|---|
| Env-backed frontend config | Already used for some frontend integrations |
| Example key | `VITE_LOGO_DEV_PUBLISHABLE_KEY` |
| Security note | Do not place secret frontend keys in client-side env files |

---

## Main Routes

The app exposes routes for the canvas workspace, strategy staging, and dashboard views. The most important working routes today are `/canvas/staging` and `/strategies/staging`.

| No | Route | Purpose |
|---|---|---|
| 1 | `/` | Main app entry |
| 2 | `/canvas/staging` | Main visual strategy canvas workspace |
| 3 | `/canvas/:id` | Reserved canvas detail route pattern |
| 4 | `/strategies/staging` | Strategy staging page |
| 5 | `/strategies/:id` | Reserved strategy detail route pattern |
| 6 | `/dashboard/...` | Dashboard workspace routes |

### Staging Canvas Notes

The staging canvas route contains extra test and preview-oriented behavior used to exercise the node system and canvas workflow.

| No | Staging Behavior | Current Implementation |
|---|---|---|
| 1 | Default template preload | When the canvas graph is empty, `/canvas/staging` auto-loads the selected template snapshot. The default selected template is `realStrategy`. |
| 2 | Template selector | A top-center `Template` selector allows replacing the current staging graph with any template from `src/config/canvas-template/config.tsx`. |
| 3 | Editable canvas name | The staging page includes inline canvas renaming with `Enter` to commit and `Escape` to cancel. |
| 4 | Loading sequence messages | The page drives staged loading messages: `Connecting to strategy workspace`, `Loading strategy graph`, `Syncing AI providers`, and `Preparing collaboration layer`. |
| 5 | Full sidebar mounting test surface | The staging page mounts the full set of typed node sidebars so individual node configurations can be tested from one route. |
| 6 | Filter source auto-selection | If a `Filter` node is selected and no source asset view is set yet, the page auto-selects the first connected incoming asset source. |
| 7 | Start-node connected market discovery | When a `Start` node is selected, the page walks the downstream graph to collect connected market nodes for specific-percentage allocation editing. |

### Canvas Overlay And Test Controls

Canvas routes also mount extra overlay components outside the staging page body itself. These help with debugging, profile actions, test execution flows, and operator-facing information.

| No | Overlay / Control Surface | Current Implementation |
|---|---|---|
| 1 | Debug panel | `CanvasDebugPanel` is mounted from `src/components/canvas/dock-app.tsx` and provides canvas validation visibility on canvas routes. |
| 2 | Brand badge | `BrandBadge` is mounted as a canvas overlay on canvas routes. |
| 3 | Profile panel | `ProfileAvatar` is mounted as a canvas overlay and acts as a profile, collaboration, and execution-test control surface. |
| 4 | FAQ panel | `HelpFaq` is mounted on canvas routes for in-product help content. |
| 5 | Keybindings panel | `HelpKeybindings` is mounted on canvas routes to expose shortcut information. |
| 6 | Canvas dock | `CanvasDock` is mounted from `dock-app.tsx` as the primary canvas command surface. |

### Profile Configurator And Test Information

The profile overlay currently contains mock configuration and test-oriented execution controls. This is useful as a staging/configurator surface and should be treated as part of the current testable canvas experience.

| No | Profile / Configurator Feature | Current Implementation |
|---|---|---|
| 1 | Start strategy menu | Provides `Start On-Chain Strategies`, `Start Real-Time Test`, and `Start Historical Backtest`. |
| 2 | Execution state flow | Uses mock execution states: `idle`, `configuring`, `starting`, and `running`. |
| 3 | Test mode selection | Supports mock mode selection between on-chain start, real-time test, and historical backtest. |
| 4 | Historical backtest speed | Supports mock backtest speed options: `fast`, `mid`, and `low`. |
| 5 | Real-time duration control | Supports configurable real-time test duration through `realtimeDuration`. |
| 6 | Total duration tracking | Tracks mock total execution duration and remaining time during active test flows. |
| 7 | Active duration ticker | Shows elapsed run duration while execution is in the `running` state. |
| 8 | Collaborator invite flow | Includes mock collaborator invite controls with permission selection. |
| 9 | Permission configurator | Supports collaborator permission states: `full-collaborate` and `view-only`. |
| 10 | Wallet copy action | Includes wallet-address copy interaction from the profile surface. |
| 11 | Profile menu actions | Includes profile-level actions such as `Settings` and `Disconnected`. |
| 12 | Strategy running UI state | Toggles a body-level `strategies-running` class while the mock running state is active. |

---

## Canvas Interaction Model

The canvas is designed to feel spatial, direct, and keyboard-usable. The goal is to keep editing inside one surface instead of pushing configuration into separate pages.

Supported behavior:

| No | Behavior | Notes |
|---|---|---|
| 1 | Pan and zoom | Spatial canvas navigation |
| 2 | Click selection | Single-node selection |
| 3 | Marquee selection | Multi-node selection |
| 4 | Drag nodes | Direct node repositioning |
| 5 | Drag threshold | Prevents accidental movement during simple click selection |
| 6 | Four-side connections | Nodes can connect from all four sides where rules allow |
| 7 | Edge preview | Shows preview connections before placement |
| 8 | Connector validation | Invalid hover feedback during connection attempts |
| 9 | Edge labels | Rendered from config defaults |
| 10 | Alignment guides | Visible while dragging |
| 11 | Selected-node sidebars | Inline configuration surface for active node |
| 12 | Comments and markers | Inline comments and collaboration markers |
| 13 | Undo / redo | Editing history shortcuts |
| 14 | Copy / paste | Copies selected nodes with config included |
| 15 | Arrow-key nudging | Move selected nodes with keyboard |
| 16 | Context menu | Right-click delete, copy, and paste |

---

## Dock Menus

The dock is the primary control surface for working on the canvas. Menus are grouped so the canvas stays visually clean while still exposing the full node catalog.

| No | Dock Menu | Purpose | Current Items |
|---|---|---|---|
| 1 | `Pointer` | Canvas interaction tools | `Click`, `Hand` |
| 2 | `Flow` | Entry, loop, and exit flow nodes | `Start`, `Loop`, `End` |
| 3 | `Logic` | Conditions, AI review, and set-logic nodes | `If`, `Else`, `All Of`, `Any Of`, `Not`, `Only One`, `Portfolio Condition`, `Rethink`, `Match All`, `Match Any`, `Exclude`, `Filter` |
| 4 | `Asset Type` | Asset source nodes | `Stock`, `Token`, `Asset Basket` |
| 5 | `Execution` | Actions, portfolio actions, risk, and timing nodes | `Buy`, `Sell`, `Rebalance`, `Allocate`, `Scale Out`, `Cash Reserve`, `Take Profit`, `Stop Loss`, `Position Limit`, `Exposure Limit`, `Cooldown`, `Wait`, `Pause Trading`, `Position Count Limit` |
| 6 | `Zoom` | Dock utility menu for view controls | `Zoom`, `Zoom In`, `Zoom Out`, `Zoom to 100%`, `Zoom to Fit` |

### Logic Dropdown Groups

The `Logic` menu is split so it stays readable and does not become crowded.

| Group | Items |
|---|---|
| `Conditions` | `If`, `Else`, `All Of`, `Any Of`, `Not`, `Only One`, `Portfolio Condition`, `Rethink` |
| `Set Logic` | `Match All`, `Match Any`, `Exclude`, `Filter` |

### Execution Dropdown Groups

The `Execution` menu is split into action and guardrail layers.

| Group | Items |
|---|---|
| `Actions` | `Buy`, `Sell`, `Rebalance` |
| `Portfolio` | `Allocate`, `Scale Out`, `Cash Reserve` |
| `Risk` | `Take Profit`, `Stop Loss`, `Position Limit`, `Exposure Limit` |
| `Timing & Limits` | `Cooldown`, `Wait`, `Pause Trading`, `Position Count Limit` |

---

## Canvas Node Catalog

Nodes are the building blocks of each strategy graph. The current implementation spans flow control, conditional logic, asset sources, execution actions, risk management, and timing/guardrail nodes.

| No | Node | Group | Role |
|---|---|---|---|
| 1 | `Start` | Flow | Defines how the strategy begins and allocates into connected assets |
| 2 | `Loop` | Flow | Re-checks or re-enters the strategy flow over time or by trigger |
| 3 | `End` | Flow | Ends the current branch or path using exit or stop conditions |
| 4 | `If` | Logic / Conditions | Main strategy decision node for metric-based branching |
| 5 | `Else` | Logic / Conditions | Fallback branch when the paired condition path does not continue |
| 6 | `All Of` (`and`) | Logic / Conditions | Requires multiple condition results together |
| 7 | `Any Of` (`or`) | Logic / Conditions | Accepts one or more condition results |
| 8 | `Not` | Logic / Conditions | Inverts a condition path |
| 9 | `Only One` (`xor`) | Logic / Conditions | Passes only one matching condition path |
| 10 | `Portfolio Condition` | Logic / Conditions | Branches on portfolio-level state instead of market-only state |
| 11 | `Rethink` | Logic / AI Review | Adds an AI review step before the next branch or action continues |
| 12 | `Match All` (`intersect`) | Logic / Set Logic | Keeps only assets shared across incoming filtered sets |
| 13 | `Match Any` (`union`) | Logic / Set Logic | Merges incoming asset sets |
| 14 | `Exclude` | Logic / Set Logic | Removes one asset set from another |
| 15 | `Filter` | Logic / Set Logic | Ranks and narrows incoming assets or baskets before continuing |
| 16 | `Stock` | Asset | Equity asset source node |
| 17 | `Token` | Asset | Crypto or token asset source node |
| 18 | `Asset Basket` | Asset | Groups multiple connected assets into one basket target |
| 19 | `Buy` | Execution / Actions | Opens or increases a position |
| 20 | `Sell` | Execution / Actions | Reduces or exits a position |
| 21 | `Rebalance` | Execution / Actions | Re-aligns portfolio or branch allocation |
| 22 | `Allocate` | Execution / Portfolio | Routes a defined allocation amount into the next path |
| 23 | `Scale Out` | Execution / Portfolio | Reduces exposure in staged or gradual form |
| 24 | `Cash Reserve` | Execution / Portfolio | Preserves a configured cash buffer |
| 25 | `Take Profit` | Execution / Risk | Applies upside exit or partial-profit logic |
| 26 | `Stop Loss` | Execution / Risk | Applies downside protection logic |
| 27 | `Position Limit` | Execution / Risk | Caps exposure per position or branch asset |
| 28 | `Exposure Limit` | Execution / Risk | Caps exposure by portfolio, basket, or asset class |
| 29 | `Cooldown` | Execution / Timing & Limits | Pauses repeated action for a cooldown window |
| 30 | `Wait` | Execution / Timing & Limits | Inserts a time-based wait stage |
| 31 | `Pause Trading` | Execution / Timing & Limits | Temporarily suspends execution or trading flow |
| 32 | `Position Count Limit` | Execution / Timing & Limits | Caps how many positions may remain open |

---

## Nodes Breakdown

This section summarizes the actual sidebar configuration surface for the current canvas nodes. The goal is to reflect what can be configured from the UI today, not a future backend schema.

There is currently no separate `Function Node` category in the dock. Function-like behavior lives inside node sidebars through modes, comparators, scopes, operators, asset-view switching, and conditional fields. To make that explicit, the tables below include a `Sidebar Functions / Modes` column.

Shared sidebar implementations used by multiple nodes:

- `Stock` and `Token` both use `src/components/canvas/canvas-asset-sidebar.tsx`
- `All Of`, `Any Of`, `Not`, `Only One`, `Match All`, `Match Any`, and `Exclude` all use `src/components/canvas/canvas-logic-aggregator-sidebar.tsx`
- `Buy`, `Sell`, `Rebalance`, `Allocate`, `Scale Out`, `Take Profit`, and `Stop Loss` use shared form logic from `src/components/canvas/canvas-action-sidebar-base.tsx`

### Flow Breakdown

| Node | Sidebar Fields | Sidebar Functions / Modes | Current Notes |
|---|---|---|---|
| `Start` | `Weighting Type`, `Start Style`, `Reserve Cash`, `Entry Limit`, `Connected Markets` percentage inputs | Weighting: `Equal`, `Specific Percentage`, `Market Cap`. Styles: `Standard`, `Staged Entry`, `Risk First`. | `Connected Markets` appears only when `Weighting Type = Specific Percentage`, with one percentage input per connected market node. |
| `Loop` | `Loop Type`, `Run Mode`, `After Branch Action`, `Delay or Cooldown`, `Interval`, `Drift Threshold`, `Deposit Timing`, `Delay` | Loop types: `Time Interval`, `Drift Threshold`, `On New Deposit`. Run mode: `Always`, `Once Per Period`. Post action: `None`, `Wait`, `Cooldown`. Units: `Day`, `Week`, `Month`. Deposit timing: `Directly`, `On Time`. | `Delay or Cooldown` appears only when `After Branch Action` is not `None`. `Interval` only appears for `Time Interval`. `Drift Threshold` only appears for `Drift Threshold`. `Deposit Timing` only appears for `On New Deposit`, and nested `Delay` only appears when `Deposit Timing = On Time`. |
| `End` | `End Type`, `End Scope`, `Asset Node`, `Operator`, `Target Value`, `Duration`, `Time Unit` | End types: `Price Reaches`, `Portfolio Value`, `Time Based`, `Max Drawdown`, `Daily Loss`, `Exposure Limit`, `Position Concentration`, `Volatility Limit`. Scope: `End Branch`, `Stop Path`, `Close Here`. Operators: `>=`, `<=`. Units: `Day`, `Week`, `Month`. | `Asset Node` only appears for `Price Reaches`. Threshold block is used by `Price Reaches`, `Portfolio Value`, and the risk-threshold end types. Threshold prefix is `$` for price/value modes and `%` for risk-threshold modes. `Duration` only appears for `Time Based`. |

### Logic Breakdown

| Node | Sidebar Fields | Sidebar Functions / Modes | Current Notes |
|---|---|---|---|
| `If` | `Condition Type`, `Condition Source`, `Primary Metric`, `Primary Period`, `Primary Asset`, `Comparator`, `Threshold Value`, `Secondary Metric`, `Secondary Period`, `Secondary Asset`, `Event`, `Range Minimum`, `Range Maximum`, `Compare Against`, `Value` | Condition types: `Threshold`, `Relative`, `Crossover`, `Range`, `Advanced`. Sources: `Market`, `Portfolio`, `Position`. Metrics: `Current Price`, `Current Market Cap`, `Volume`, `SMA`, `EMA`, `RSI`, `MACD Line`, `MACD Signal`, `MACD Histogram`, `ATR`. Comparators: `>`, `<`, `>=`, `<=`, `=`. Compare Against: `Value`, `Metric`. Events: `Crosses Above`, `Crosses Below`. | `Primary Period` appears only for period-based metrics like `SMA`, `EMA`, `RSI`, `ATR`. `Threshold` shows comparator + threshold value. `Relative` and `Crossover` show secondary metric/asset. `Range` shows min/max. `Advanced` switches between comparing against a raw value or another metric. `$` prefix is used for price/market-cap based value inputs. |
| `Else` | informational sections only | No editable functions. Shows branch role and behavior guidance. | `Else` is a fallback branch node, not a second condition editor. |
| `Filter` | `Asset View`, `Primary Rule`, `Primary Rule Period`, `Rule Operator`, `Secondary Rule`, `Secondary Rule Period`, `Keep Results`, `Result Mode`, `How Many` | Rules: `Current Price`, `Current Market Cap`, `Volume`, `Percent Gain`, `SMA`, `EMA`, `RSI`, `MACD Histogram`, `ATR`. Operator: `AND`, `OR`. Keep results: `Top`, `Bottom`. Result mode: `Top 1`, `Top N`, `All Matches`. | Filter config is stored per selected `Asset View`, so each connected asset input can keep its own filter setup. Period fields only appear for rule types that need them: `SMA`, `EMA`, `RSI`, `ATR`. `How Many` is currently still visible even when `Result Mode` implies a single or all-match result. |
| `Portfolio Condition` | `Portfolio Metric`, `Comparator`, `Target Value` | Metrics: `Cash %`, `Portfolio Exposure %`, `Open Positions`, `Unrealized PnL %`, `Drawdown %`, `Position Size %`. Comparators: `>`, `<`, `>=`, `<=`, `=`. | Portfolio-level branching node. No metric-specific conditional UI is implemented yet. |
| `Rethink` | `Review Focus`, `Suggested Outcome`, `Operator Note` | Focus: `Yield`, `Risk`, `Allocation`, `Portfolio`. Outcome: `Continue`, `Adjust`, `Pause`. | AI evaluation node for yield/risk/allocation review before the next branch or action continues. Current summary pattern uses bridge text plus badges, e.g. `Rethink before [Adjust] for [Risk]`. |
| `All Of` (`and`) | informational sections only | No editable functions. Behavior: all connected conditions must pass. | Shared informational sidebar from `canvas-logic-aggregator-sidebar.tsx`. |
| `Any Of` (`or`) | informational sections only | No editable functions. Behavior: any connected condition may pass. | Shared informational sidebar from `canvas-logic-aggregator-sidebar.tsx`. |
| `Not` | informational sections only | No editable functions. Behavior: invert a connected condition result. | Shared informational sidebar from `canvas-logic-aggregator-sidebar.tsx`. |
| `Only One` (`xor`) | informational sections only | No editable functions. Behavior: exactly one connected condition passes. | Shared informational sidebar from `canvas-logic-aggregator-sidebar.tsx`. |
| `Match All` (`intersect`) | informational sections only | No editable functions. Behavior: keep only assets shared across filter results. | Shared informational sidebar from `canvas-logic-aggregator-sidebar.tsx`. |
| `Match Any` (`union`) | informational sections only | No editable functions. Behavior: merge assets from filter results. | Shared informational sidebar from `canvas-logic-aggregator-sidebar.tsx`. |
| `Exclude` | informational sections only | No editable functions. Behavior: subtract one asset set from another. | Shared informational sidebar from `canvas-logic-aggregator-sidebar.tsx`. |

### Asset Breakdown

| Node | Sidebar Fields | Sidebar Functions / Modes | Current Notes |
|---|---|---|---|
| `Stock` | `Asset` | Searchable asset picker with stock dataset. | Uses shared `canvas-asset-sidebar.tsx`. The list is filterable by search query. |
| `Token` | `Asset` | Searchable asset picker with token dataset. | Uses shared `canvas-asset-sidebar.tsx`. The list is filterable by search query. |
| `Asset Basket` | `Basket Name` | Free-text naming only. | Groups connected assets into one named basket that downstream nodes can filter or allocate against. |

### Actions Breakdown

| Node | Sidebar Fields | Sidebar Functions / Modes | Current Notes |
|---|---|---|---|
| `Buy` | `Target Asset`, `Amount Mode`, `Buy Type`, `Amount` | Amount mode: `Percentage`, `Value`. Buy type: `Open`, `Add`, `Rotate Into`. | Uses shared trade form from `canvas-action-sidebar-base.tsx`. `Amount` switches prefix and placeholder between `%` and `$` based on mode. |
| `Sell` | `Target Asset`, `Amount Mode`, `Sell Type`, `Amount` | Amount mode: `Percentage`, `Value`. Sell type: `Full Exit`, `Reduce`, `Take Partial`. | Uses shared trade form from `canvas-action-sidebar-base.tsx`. `Amount` switches prefix and placeholder between `%` and `$` based on mode. |
| `Rebalance` | `Rebalance Mode`, `Rebalance Scope`, `Trigger Threshold` | Mode: `Equal`, `Target`. Scope: `This Branch`, `Selected Assets`, `Portfolio Set`. | Uses shared action form base. `Trigger Threshold` is percentage-based. |
| `Allocate` | `Weighting Mode`, `Allocation Style`, `Amount` | Weighting mode: `Percentage`, `Value`. Allocation style: `Target Weight`, `Add Exposure`. | Uses shared action form base. `Amount` switches prefix and placeholder between `%` and `$` based on mode. |

### Portfolio And Risk Breakdown

| Node | Sidebar Fields | Sidebar Functions / Modes | Current Notes |
|---|---|---|---|
| `Scale Out` | `Exit Style`, `Reduce By`, `Exit Steps` | Exit style: `Standard Trim`, `Ladder Exit`, `Trim Only`. | Uses shared action form base. `Reduce By` is percentage-based. `Exit Steps` is currently always shown. |
| `Take Profit` | `Target Asset`, `Comparator`, `Mode`, `Threshold`, `ATR Period`, `ATR Multiplier` | Comparator: `>`, `<`, `>=`, `<=`. Modes: `Single`, `Partial`, `Ladder`, `ATR-based`. | Uses shared action form base. Non-`ATR-based` mode shows comparator + threshold. `ATR-based` hides comparator and shows ATR controls instead. |
| `Stop Loss` | `Target Asset`, `Comparator`, `Mode`, `Threshold`, `ATR Period`, `ATR Multiplier` | Comparator: `>`, `<`, `>=`, `<=`. Modes: `Fixed`, `Trailing`, `Break-even`, `ATR-based`. | Uses shared action form base. Non-`ATR-based` mode shows comparator + threshold. `ATR-based` hides comparator and shows ATR controls instead. |
| `Position Limit` | `Limit Mode`, `Apply To`, `Limit Value` | Limit mode: `Percentage`, `Value`. Apply to: `Single Asset`, `Branch Assets`. | `Limit Value` switches prefix between `%` and `$` depending on mode. |
| `Exposure Limit` | `Exposure Type`, `Comparator`, `Limit Value` | Exposure type: `Asset Class`, `Basket`, `Portfolio`. Comparator: `>`, `<`, `>=`, `<=`. | `Limit Value` is percentage-based in the current UI. |
| `Position Count Limit` | `Scope`, `Comparator`, `Position Count` | Scope: `This Branch`, `Whole Portfolio`. Comparator: `>`, `<`, `>=`, `<=`, `=`. | Count guardrail for branch-level or portfolio-level open positions. |
| `Cash Reserve` | `Reserve Percentage`, `Reserve Label` | Numeric percentage plus free-text label. | Used to preserve a cash buffer before further allocation or execution. |

### Timing And Suspension Breakdown

| Node | Sidebar Fields | Sidebar Functions / Modes | Current Notes |
|---|---|---|---|
| `Cooldown` | `Cooldown Scope`, `Cooldown Duration` | Scope: `This Branch`, `Whole Strategy`. Units: `Day`, `Week`, `Month`. | Duration field is paired with a unit selector. |
| `Wait` | `Wait Duration` | Units: `Day`, `Week`, `Month`. | Simple timed delay node for pacing a branch. |
| `Pause Trading` | `Pause Mode`, `Pause Duration`, `Release Condition` | Mode: `For Duration`, `Until Condition`. Units: `Day`, `Week`, `Month`. | `Pause Duration` appears only in `For Duration` mode. `Release Condition` appears only in `Until Condition` mode. |

---

## Templates

The staging canvas can preload realistic graphs from config. These templates live in `src/config/canvas-template/config.tsx` and help demo the full strategy builder without creating every node manually.

| Template | Purpose |
|---|---|
| `Logic Showcase` | Broadest mix of conditions, set logic, filters, branches, and risk |
| `Real Strategy` | More realistic end-to-end strategy with basket, reserve cash, wait, and loop behavior |
| `Portfolio Guardrails` | Focused on portfolio restrictions and risk gates |
| `Dip Buy With Recheck` | Time-aware dip-buy flow with wait, loop, and exits |
| `Basket Rotation` | Grouped-asset strategy using `Asset Basket`, `Filter`, `Allocate`, and `Rebalance` |

---

## Connection Rules

Canvas connection behavior is centralized under `src/config/canvas-connection/`.

Current files:

| File | Purpose |
|---|---|
| `src/config/canvas-connection/config.tsx` | Main rule definitions, categories, validator, messages, and drop-target constants |
| `src/config/canvas-connection/index.ts` | Barrel export |

Current rule system covers:

| No | Rule Coverage | Notes |
|---|---|---|
| 1 | Source and target presence validation | Source or target node must exist |
| 2 | Self-connection prevention | A node cannot connect to itself |
| 3 | `Start` incoming restriction | `Start` cannot receive incoming connections |
| 4 | `End` outgoing restriction | `End` cannot continue to another node |
| 5 | Node-type allowlist validation | Validates explicit allowed target types |
| 6 | Node-category allowlist validation | Validates allowed target categories |
| 7 | Source-side connector restrictions | Certain nodes can only emit from specific sides |
| 8 | Target-side connector restrictions | Certain nodes can only receive on specific sides |
| 9 | Max outgoing limits | Applied to selected source nodes |
| 10 | Max outgoing-per-side limits | Applied to selected source-node connectors |
| 11 | Max incoming limits | Applied to selected target nodes |
| 12 | Max incoming-per-side limits | Applied to selected target-node connectors |
| 13 | Exact duplicate connector-pair prevention | Blocks the same connector-to-connector edge |
| 14 | Invalid connection messages | Uses shared and rule-specific messages |
| 15 | Drop-target threshold constants | Shared drop-target behavior constants |

Implementation notes:

| Item | Current Behavior |
|---|---|
| Validation style | Primarily allowlist-based |
| `blockedTargetTypes` | Exists in the rule model but is not actively used by the current config |
| Duplicate policy | Blocks the same connector-to-connector edge, not every possible repeated node-to-node relationship |

### Connection Categories

| Category | Node Types |
|---|---|
| `asset` | `stock`, `token` |
| `assetSet` | `assetBasket`, `filter`, `intersect`, `union`, `exclude` |
| `boolean` | `if`, `portfolioCondition`, `rethink`, `and`, `or`, `not`, `xor`, `else` |
| `branch` | `start`, `loop` |
| `execution` | `buy`, `sell`, `rebalance`, `allocate`, `scaleOut`, `takeProfit`, `stopLoss`, `positionLimit`, `positionCountLimit`, `exposureLimit`, `cashReserve`, `cooldown`, `wait`, `pauseTrading` |
| `terminal` | `end` |

### Source-Side Rules

| Source Node | Allowed Target Types / Categories | Connector Rules |
|---|---|---|
| `Start` | `stock`, `token`, `assetBasket`, `filter`, `portfolioCondition`, `rethink` | Source side limited to `right` and `bottom`. Max outgoing `2`. Max per side: `right = 1`, `bottom = 1`. |
| `Stock`, `Token` | `assetBasket`, `filter`, `if`, `portfolioCondition`, `rethink`, `intersect`, `union`, `exclude` | No extra max-count rule beyond the shared validator. |
| `Filter`, `Asset Basket`, `Match All`, `Match Any`, `Exclude` | `filter`, `if`, `portfolioCondition`, `rethink`, `intersect`, `union`, `exclude`, plus target category `execution` | These nodes drive asset-set pipelines into more filtering, branching, AI review, or execution. |
| `If`, `Portfolio Condition`, `All Of`, `Any Of`, `Not`, `Only One` | `and`, `or`, `not`, `xor`, `else`, `rethink`, plus target category `execution` | `If` specifically is limited to source sides `right` and `bottom`, max outgoing `2`, max per side `1`. |
| `Rethink` | `and`, `or`, `not`, `xor`, `else`, plus target category `execution` | AI evaluation node that can continue into logic branching or execution after reviewing yield, risk, allocation, or portfolio posture. |
| `Else` | `end`, `loop`, `filter`, `if`, `portfolioCondition`, `rethink`, plus target category `execution` | Source side limited to `right`. Max outgoing `1`. |
| `Loop` | `end`, `loop`, `filter`, `if`, `portfolioCondition`, `rethink`, plus target category `execution` | Can connect from all four sides. |
| `Cooldown`, `Wait`, `Pause Trading` | `end`, `loop`, `filter`, `if`, `portfolioCondition`, `rethink`, plus target category `execution` | Timing/suspension nodes continue into evaluation, AI review, execution, loop, or end stages. |
| `Buy`, `Sell`, `Rebalance`, `Allocate`, `Scale Out`, `Take Profit`, `Stop Loss`, `Position Limit`, `Position Count Limit`, `Exposure Limit`, `Cash Reserve` | `loop`, `end`, `cooldown`, `wait`, `pauseTrading`, `rethink`, plus target category `execution` | Execution chains can continue into execution, AI review, timing, loop, or terminal nodes. |

### Target-Side Rules

| Target Node | Incoming Rules |
|---|---|
| `Start` | No incoming connections allowed. Max incoming `0`. |
| `If` | Can receive only on `top` or `left`. Max incoming `2`. Max per side: `top = 1`, `left = 1`. |
| `Else` | Can receive only on `top`, `left`, or `bottom`. Max incoming `3`. Max per side: `top = 1`, `left = 1`, `bottom = 1`. |
| `End` | Can receive on all four sides. Max incoming per side `1`. No total incoming cap is defined. |

### User-Facing Invalid Connection Messages

Examples of messages currently surfaced by the validator and viewport:

| No | Message |
|---|---|
| 1 | `Missing source or target node.` |
| 2 | `Cannot connect a node to itself.` |
| 3 | `Start cannot receive incoming connections.` |
| 4 | `End cannot continue to another node.` |
| 5 | `This connection is not allowed by the current flow rules.` |
| 6 | `These nodes are already connected through that connector.` |
| 7 | `If should receive incoming connections from the top or left side.` |
| 8 | `Else should receive incoming connections from the top, left, or bottom side.` |
| 9 | `Start should connect into assets or a filter stage.` |
| 10 | `Assets should connect into Filter, If, or asset-set logic nodes.` |
| 11 | `Filter results should continue into another Filter, an If node, or asset-set logic.` |
| 12 | `Condition results should connect into All Of, Any Of, Not, Only One, Else, or execution nodes.` |
| 13 | `Execution nodes should continue into execution, loop, or end nodes.` |

This keeps graph rules out of scattered viewport logic and makes future connection changes easier to manage while still reflecting the current implementation exactly.

---

## Validation Scope And Current Gaps

The current connection validator is strong for frontend graph construction, but it should not be read as a full runtime execution engine. The table below separates what is already enforced in the canvas from what is still future work or not yet explicitly defined.

### Covered Well Today

| Area | Current Coverage | Notes |
|---|---|---|
| Structural graph safety | Self-connection prevention, exact duplicate connector-pair prevention, incoming/outgoing caps, side restrictions, `Start`/`End` restrictions | Core graph-shape safety is implemented in `src/config/canvas-connection/config.tsx` |
| Semantic flow categories | `asset`, `assetSet`, `boolean`, `branch`, `execution`, `terminal` | Categories make the validator more scalable than raw node-to-node rules only |
| Asset pipeline separation | Distinguishes asset source, transformed asset pipeline, and execution stages | Supports flows like `stock -> filter -> matchAny -> allocate` separately from condition-to-action flows |
| Execution continuation | Execution nodes can continue into execution, timing, loop, or terminal nodes | Covers orchestration-style chains such as `buy -> cooldown -> loop` |

### Not Fully Covered Yet

| Area | Current State | Why It Matters |
|---|---|---|
| Cycle policy | The validator allows loop-capable shapes, but does not define intentional vs accidental cycles | Needed later for runtime guardrails such as iteration caps or recursion limits |
| Multi-branch merge semantics | Merge behavior for converging branches is not explicitly defined in the current README or validator | Important for execution order, parallelism, and race handling |
| Boolean runtime resolution | Nodes like `All Of`, `Any Of`, `Not`, and `Only One` currently communicate visual/graph semantics, not full runtime evaluation semantics | Needed to define waiting, short-circuiting, async behavior, and ordering |
| Typed edge payloads | Validation is based on node types and categories, not explicit payload schemas or IO contracts | Important if later phases need typed data compatibility such as `asset[]` vs execution inputs |
| Execution state interaction | Relationships like `Take Profit -> Stop Loss` do not yet define exclusivity, priority, or layering semantics | Important for execution engines and risk resolution |
| Graph completeness validation | No explicit completeness pass for dead ends, orphan nodes, disconnected subgraphs, or unreachable branches | A graph may be structurally connectable but still incomplete as a strategy |
| Cardinality semantics | The canvas does not yet define how many assets or results a downstream node consumes at runtime | Important for batch vs sequential execution and allocation behavior |
| Execution ordering grammar | The rules do not yet define higher-order semantics for chains like `Buy -> Allocate` vs `Allocate -> Buy` | Important when moving from visual flow to executable protocol logic |

### Suggested Future Validation Layers

| Layer | Purpose |
|---|---|
| Structural | Ensure the graph shape is connectable and rule-compliant |
| Semantic | Ensure the flow is meaningful across node categories and branches |
| Runtime | Ensure the graph can execute deterministically |
| Risk | Detect dangerous loops, unstable branch merges, and unsafe execution patterns |

### Runtime Semantics To Define Later

| Topic | Open Questions |
|---|---|
| Branch execution | Are branches parallel, sequential, or priority-based? |
| Merge behavior | What happens when multiple branches converge into one node? |
| Loop behavior | What runtime guard stops accidental infinite repetition? |
| Timing behavior | How do `Wait`, `Cooldown`, and `Pause Trading` interact with the rest of execution? |
| Async evaluation | Do boolean aggregators wait for all upstream paths or short-circuit? |

This distinction is important: the current rules system is already advanced for a frontend strategy canvas, but it is not yet a full protocol-level execution semantics model.

---

## Keyboard Shortcuts

The canvas supports keyboard-driven interaction for common editing actions. Shortcut labels live in `src/config/keybinding/canvas-keybindings.ts`.

| Action | Shortcut |
|---|---|
| Undo | `Ctrl+Z` |
| Redo | `Ctrl+Y` |
| Copy selected nodes | `Ctrl+C` |
| Paste nodes | `Ctrl+V` |
| Nudge up | `ArrowUp` |
| Nudge down | `ArrowDown` |
| Nudge left | `ArrowLeft` |
| Nudge right | `ArrowRight` |
| Delete selected nodes | `Backspace` / `Delete` |
| Dropdown previous item | `ArrowUp` |
| Dropdown next item | `ArrowDown` |
| Dropdown select | `Enter` |
| Dropdown close | `Esc` |
| Tool menu | `P` |
| Flow menu | `N` |
| Logic menu | `G` |
| Asset Type menu | `A` |
| Execution menu | `E` |
| Zoom menu | `Z` |

---

## Development Notes

Current design principles:

| No | Principle | Notes |
|---|---|---|
| 1 | Token-driven theming | Shared light/dark theme behavior |
| 2 | Reusable node shell | Visual consistency across node types |
| 3 | Reusable sidebar primitives | Shared headers and section components |
| 4 | Dock-first interaction | Avoid large permanent side panels |
| 5 | Horizontal node summaries | Badge-style configuration text inside nodes |
| 6 | Config-first rules | Connector labels and graph rules come from config |
| 7 | Frontend-first implementation | UI/product flow before backend or contract execution |
