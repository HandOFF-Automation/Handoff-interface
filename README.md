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

- build strategy flows directly on a canvas
- configure logic, portfolio, and risk behavior through node sidebars
- connect assets, filters, conditions, and actions inside one graph
- support collaboration with inline comments and annotations
- prepare strategy definitions that can later connect to agents, APIs, or contracts

Workspace split:

| Workspace | Responsibility |
|---|---|
| [`handoff-interface`](https://github.com/HandOFF-Automation/Handoff-interface.git) | Frontend canvas, UX, comments, configuration, strategy editing |
| `handoff-backend` | Backend services, APIs, orchestration, and future execution plumbing |
| `Handoff-contract` | Contract-side execution and deployment logic |
---

## Current Highlights

The current implementation is strongest around the canvas editor and node system.

- Figma-like canvas interaction with pan, zoom, drag, marquee select, and alignment guides
- light and dark themes using shared canvas tokens from `src/index.css`
- grouped dock menus for `Pointer`, `Flow`, `Logic`, `Asset Type`, `Execution`, and `Zoom`
- editable canvas title on `/canvas/staging`
- typed node sidebars for selected nodes
- config-driven connector labels
- orthogonal edge rendering with preview connections
- inline filter asset-view switching
- context menu for delete, copy, and paste
- keyboard support for dropdown navigation, undo, redo, copy, paste, and node nudging
- centralized connection rules under `src/config/canvas-connection/`
- built-in debug dropdown panel for canvas validation visibility
- template registry for loading realistic strategy graphs

---

## Tech Stack

- React
- TypeScript
- Vite
- Phosphor Icons

---

## Installation

Clone the repository:

```bash
git clone https://github.com/HandOFF-Automation/Handoff-interface.git
```

Go into the project folder:

```bash
cd Handoff-interface
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Note: the canvas workspace is actively implemented, but the repo may still contain unrelated TypeScript build errors outside the current canvas scope.

---

## Environment Notes

This project already uses env-backed configuration for some frontend integrations.

Example:

- `VITE_LOGO_DEV_PUBLISHABLE_KEY`

Do not place secret frontend keys in client-side env files.

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

---

## Canvas Interaction Model

The canvas is designed to feel spatial, direct, and keyboard-usable. The goal is to keep editing inside one surface instead of pushing configuration into separate pages.

Supported behavior:

- pan and zoom
- click selection
- marquee selection
- drag nodes
- drag threshold so simple click selection does not move nodes
- connect nodes from all four sides
- preview edges before placement
- connector validation with invalid hover feedback
- edge labels rendered from config defaults
- alignment guides while dragging
- selected-node sidebars
- inline comments and collaboration markers
- undo and redo
- copy and paste selected nodes with config included
- arrow-key nudging for selected nodes
- right-click context menu for delete, copy, and paste

---

## Dock Menus

The dock is the primary control surface for working on the canvas. Menus are grouped so the canvas stays visually clean while still exposing the full node catalog.

| No | Dock Menu | Purpose | Current Items |
|---|---|---|---|
| 1 | `Pointer` | Canvas interaction tools | `Click`, `Hand` |
| 2 | `Flow` | Entry, loop, and exit flow nodes | `Start`, `Loop`, `End` |
| 3 | `Logic` | Conditions and set-logic nodes | `If`, `Else`, `All Of`, `Any Of`, `Not`, `Only One`, `Portfolio Condition`, `Match All`, `Match Any`, `Exclude`, `Filter` |
| 4 | `Asset Type` | Asset source nodes | `Stock`, `Token`, `Asset Basket` |
| 5 | `Execution` | Actions, portfolio actions, risk, and timing nodes | `Buy`, `Sell`, `Rebalance`, `Allocate`, `Scale Out`, `Cash Reserve`, `Take Profit`, `Stop Loss`, `Position Limit`, `Exposure Limit`, `Cooldown`, `Wait`, `Pause Trading`, `Position Count Limit` |
| 6 | `Zoom` | Dock utility menu for view controls | `Zoom`, `Zoom In`, `Zoom Out`, `Zoom to 100%`, `Zoom to Fit` |

### Logic Dropdown Groups

The `Logic` menu is split so it stays readable and does not become crowded.

| Group | Items |
|---|---|
| `Conditions` | `If`, `Else`, `All Of`, `Any Of`, `Not`, `Only One`, `Portfolio Condition` |
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
| 11 | `Match All` (`intersect`) | Logic / Set Logic | Keeps only assets shared across incoming filtered sets |
| 12 | `Match Any` (`union`) | Logic / Set Logic | Merges incoming asset sets |
| 13 | `Exclude` | Logic / Set Logic | Removes one asset set from another |
| 14 | `Filter` | Logic / Set Logic | Ranks and narrows incoming assets or baskets before continuing |
| 15 | `Stock` | Asset | Equity asset source node |
| 16 | `Token` | Asset | Crypto or token asset source node |
| 17 | `Asset Basket` | Asset | Groups multiple connected assets into one basket target |
| 18 | `Buy` | Execution / Actions | Opens or increases a position |
| 19 | `Sell` | Execution / Actions | Reduces or exits a position |
| 20 | `Rebalance` | Execution / Actions | Re-aligns portfolio or branch allocation |
| 21 | `Allocate` | Execution / Portfolio | Routes a defined allocation amount into the next path |
| 22 | `Scale Out` | Execution / Portfolio | Reduces exposure in staged or gradual form |
| 23 | `Cash Reserve` | Execution / Portfolio | Preserves a configured cash buffer |
| 24 | `Take Profit` | Execution / Risk | Applies upside exit or partial-profit logic |
| 25 | `Stop Loss` | Execution / Risk | Applies downside protection logic |
| 26 | `Position Limit` | Execution / Risk | Caps exposure per position or branch asset |
| 27 | `Exposure Limit` | Execution / Risk | Caps exposure by portfolio, basket, or asset class |
| 28 | `Cooldown` | Execution / Timing & Limits | Pauses repeated action for a cooldown window |
| 29 | `Wait` | Execution / Timing & Limits | Inserts a time-based wait stage |
| 30 | `Pause Trading` | Execution / Timing & Limits | Temporarily suspends execution or trading flow |
| 31 | `Position Count Limit` | Execution / Timing & Limits | Caps how many positions may remain open |

---

## Nodes Breakdown

This section summarizes the actual sidebar configuration surface for the current canvas nodes. The goal is to reflect what can be configured from the UI today, not a future backend schema.

### Flow Breakdown

| Node | Sidebar Fields | Current Notes |
|---|---|---|
| `Start` | `Weighting Type`, `Start Style`, `Reserve Cash`, `Entry Limit`, per-asset percentage inputs when `Specific Percentage` is selected | Weighting modes: `Equal`, `Specific Percentage`, `Market Cap`. Styles include `Standard`, `Staged Entry`, `Risk First`. |
| `Loop` | `Loop Type`, `Interval Value`, `Time Unit`, `Drift Threshold`, `Deposit Timing`, `Deposit Delay Value`, `Deposit Delay Unit`, `Run Mode`, `Post Action`, `Post Action Value`, `Post Action Unit` | Loop types: `Time Interval`, `Drift Threshold`, `On New Deposit`. Post-actions include `None`, `Wait`, `Cooldown`. |
| `End` | `End Type`, `End Scope`, `Asset`, `Operator`, `Target Value`, `Time Value`, `Time Unit` | End types include `Price Reaches`, `Portfolio Value`, `Time Based`, `Max Drawdown`, `Daily Loss`, `Exposure Limit`, `Position Concentration`, `Volatility Limit`. |

### Logic Breakdown

| Node | Sidebar Fields | Current Notes |
|---|---|---|
| `If` | `Condition Source`, `Condition Type`, `Primary Metric`, `Primary Asset`, `Primary Period`, `Comparator`, `Comparison Target Type`, `Comparison Value`, `Secondary Metric`, `Secondary Asset`, `Secondary Period`, `Range Min`, `Range Max`, `Crossover Event` | Condition types: `Threshold`, `Relative`, `Crossover`, `Range`, `Advanced`. Sources: `Market`, `Portfolio`, `Position`. Metrics include price, market cap, volume, SMA, EMA, RSI, MACD variants, ATR. |
| `Else` | informational branch guidance only | `Else` is implemented as a fallback branch node, not a second full condition editor. |
| `Filter` | `Asset View`, `Primary Rule`, `Primary Period`, `Condition Operator`, `Secondary Rule`, `Secondary Period`, `Ordering`, `How Many`, `Result Mode` | Supports per-target config for `Stock`, `Token`, and `Asset Basket`. Result modes: `Top 1`, `Top N`, `All Matches`. |
| `Portfolio Condition` | `Portfolio Metric`, `Comparator`, `Target Value` | Metrics include `Cash %`, `Portfolio Exposure %`, `Open Positions`, `Unrealized PnL %`, `Drawdown %`, `Position Size %`. |
| `All Of` (`and`) | `Logic Role`, `Behavior` | Combines multiple condition outputs and continues only when every connected condition passes together. |
| `Any Of` (`or`) | `Logic Role`, `Behavior` | Combines multiple condition outputs and continues when any connected condition passes. |
| `Not` | `Logic Role`, `Behavior` | Inverts one connected condition result before the flow continues. |
| `Only One` (`xor`) | `Logic Role`, `Behavior` | Continues only when exactly one connected condition passes. |
| `Match All` (`intersect`) | `Logic Role`, `Behavior` | Keeps only assets shared across multiple incoming filtered sets. |
| `Match Any` (`union`) | `Logic Role`, `Behavior` | Merges assets from multiple incoming filtered sets. |
| `Exclude` | `Logic Role`, `Behavior` | Removes one incoming asset set from another before the next step. |

### Asset Breakdown

| Node | Sidebar Fields | Current Notes |
|---|---|---|
| `Stock` | asset picker / symbol selection | Used as an asset source for conditions, filters, actions, and risk nodes. |
| `Token` | asset picker / symbol selection | Used as an asset source for crypto-oriented strategy flows. |
| `Asset Basket` | `Basket Name` | Groups connected assets into one named basket that downstream nodes can filter or allocate against. |

### Actions Breakdown

| Node | Sidebar Fields | Current Notes |
|---|---|---|
| `Buy` | `Target Asset`, `Amount Mode`, `Amount Value`, `Buy Behavior` | Buy behaviors: `Open`, `Add`, `Rotate Into`. |
| `Sell` | `Target Asset`, `Amount Mode`, `Amount Value`, `Sell Behavior` | Sell behaviors: `Full Exit`, `Reduce`, `Take Partial`. |
| `Rebalance` | `Rebalance Mode`, `Threshold`, `Scope` | Modes include `Equal` and `Target`. Scope includes `This Branch`, `Selected Assets`, `Portfolio Set`. |
| `Allocate` | `Weighting Mode`, `Allocate Amount`, `Allocate Style` | Styles include `Target Weight` and `Add Exposure`. |

### Portfolio And Risk Breakdown

| Node | Sidebar Fields | Current Notes |
|---|---|---|
| `Scale Out` | `Scale Out Percent`, `Exit Style`, `Exit Steps` | Exit styles include `Standard Trim`, `Ladder Exit`, `Trim Only`. |
| `Take Profit` | `Target Asset`, `Comparator`, `Threshold Value`, `Take Profit Mode`, `ATR Period`, `ATR Multiplier` | Modes include `Single`, `Partial`, `Ladder`, `ATR-based`. ATR inputs appear when needed. |
| `Stop Loss` | `Target Asset`, `Comparator`, `Threshold Value`, `Stop Loss Mode`, `ATR Period`, `ATR Multiplier` | Modes include `Fixed`, `Trailing`, `Break-even`, `ATR-based`. |
| `Position Limit` | `Limit Mode`, `Apply To`, `Limit Value` | Modes: `Percentage`, `Value`. Apply targets: `Single Asset`, `Branch Assets`. |
| `Exposure Limit` | `Exposure Type`, `Comparator`, `Limit Value` | Exposure types: `Asset Class`, `Basket`, `Portfolio`. |
| `Position Count Limit` | `Scope`, `Comparator`, `Position Count` | Scope: `This Branch`, `Whole Portfolio`. |
| `Cash Reserve` | `Reserve Percentage`, `Reserve Label` | Used to preserve a cash buffer before further allocation or execution. |

### Timing And Suspension Breakdown

| Node | Sidebar Fields | Current Notes |
|---|---|---|
| `Cooldown` | `Cooldown Scope`, `Cooldown Duration`, `Cooldown Unit` | Scope: `This Branch`, `Whole Strategy`. |
| `Wait` | `Wait Duration`, `Wait Unit` | Simple timed delay node for pacing a branch. |
| `Pause Trading` | `Pause Mode`, `Pause Duration`, `Pause Unit`, `Release Condition` | Modes: `For Duration`, `Until Condition`. Duration or release condition field is shown depending on mode. |

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

Canvas connection behavior is now centralized under `src/config/canvas-connection/`.

Current rule system covers:

- allowed and blocked node-to-node connections
- connector-side rules for key branch nodes
- max incoming and outgoing limits for selected nodes
- per-side incoming and outgoing limits
- duplicate connection prevention
- shared invalid-connection messages
- shared drop-target threshold constants

This keeps graph rules out of scattered viewport logic and makes future connection changes easier to manage.

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

- token-driven theming across light and dark modes
- reusable node shell for visual consistency
- reusable sidebar header and section components
- dock-first interaction instead of large permanent side panels
- horizontal node summaries with badge-style configuration text
- config-first graph rules and connector labels
- frontend-first implementation before backend or contract execution
