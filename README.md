<p>
  <img src="./src/assets/icon/icon%20handoff.png" alt="Handoff Interface" width="72" align="left">
</p>

# Handoff Interface

Frontend workspace for Handoff's visual strategy builder.

<br/>

Handoff Interface is a node-based canvas application for designing strategy flows across trading, portfolio management, and risk automation. The current product direction combines visual strategy composition, configurable node sidebars, collaboration comments, and a Figma-like editing experience that can later map into backend agents, exchange execution, or smart contract workflows.

---

## What This Project Is

Handoff Interface is the visual layer for building strategy logic before execution.

**Core goals:**

- Build strategy flows visually on a canvas
- Configure portfolio, logic, and risk behavior through node sidebars
- Connect assets, conditions, and actions in a single graph
- Support collaboration with inline comments and annotations
- Prepare strategies that can later connect to agents, APIs, or contracts

**Long-term workspace split:**

| Workspace | Responsibility |
|---|---|
| `handoff-interface` | Frontend canvas, UX, comments, configuration, strategy editing |
| `handoff-contract` | Contract-side execution and deployment logic |

---

## Current Highlights

- Infinite-style strategy canvas
- Light and dark themes using shared design tokens
- Dock-based canvas controls
- Keyboard-friendly dropdown menus
- Node placement, dragging, selection, marquee selection, and edge creation
- Orthogonal edge rendering with preview connections
- Per-node configuration sidebars
- Inline comment threads and collaboration markers
- Editable canvas title
- Grouped dock menus with consistent headings
- Config-driven connector labels so node edge text can be extended from one place
- Complex staging template graph for previewing end-to-end strategy flows
- Phase 1 logic and policy nodes, including richer execution, portfolio, and cooldown flows

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

---

## Environment Notes

This project uses env-backed configuration for some external assets and integrations.

For example:

- `VITE_LOGO_DEV_PUBLISHABLE_KEY`

Do not place secret frontend keys in client-side env files.

---

## Main Routes

The app exposes routes for the canvas workspace, strategy management, and dashboard. The `/canvas/staging` and `/strategies/staging` routes serve as the main working environments during development.

<table width="100%">
  <thead>
    <tr>
      <th>No</th>
      <th>Route</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td><code>/</code></td><td>Main app entry</td></tr>
    <tr><td>2</td><td><code>/canvas/staging</code></td><td>Strategy canvas staging workspace</td></tr>
    <tr><td>3</td><td><code>/canvas/:id</code></td><td>Reserved canvas route pattern</td></tr>
    <tr><td>4</td><td><code>/strategies/staging</code></td><td>Strategy staging page</td></tr>
    <tr><td>5</td><td><code>/strategies/:id</code></td><td>Reserved strategy detail route pattern</td></tr>
    <tr><td>6</td><td><code>/dashboard/...</code></td><td>Dashboard workspace routes</td></tr>
  </tbody>
</table>

---

## Canvas Interaction Model

The canvas is designed to feel close to a Figma-style interaction model: spatial, direct, and keyboard-accessible. Users can freely navigate the canvas, place and connect nodes, and configure behavior through sidebars without leaving the main editing surface.

**Supported behavior:**

- Pan and zoom
- Click selection
- Marquee selection
- Drag nodes
- Connect nodes from all four sides
- Preview edges before placement
- Keyboard shortcuts for undo and redo
- Alignment guides while dragging
- Sidebars for selected node configuration
- Automatic connector labels rendered on edges for supported node types
- Connector labels use config-driven defaults on canvas

---

## Dock Menus

The dock is the primary control surface for editing on the canvas. It groups all node types and tools into focused menus, keeping the canvas surface clean while keeping every action accessible from one place.

<table width="100%">
  <thead>
    <tr>
      <th>No</th>
      <th>Dock Menu</th>
      <th>Items</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td><code>Pointer</code></td><td><code>Click</code>, <code>Hand</code></td></tr>
    <tr><td>2</td><td><code>Flow</code></td><td><code>Start</code>, <code>Loop</code>, <code>End</code></td></tr>
    <tr><td>3</td><td><code>Logic</code></td><td><code>If</code>, <code>Else</code>, <code>All Of</code>, <code>Any Of</code>, <code>Not</code>, <code>Only One</code>, <code>Match All</code>, <code>Match Any</code>, <code>Exclude</code>, <code>Filter</code>, <code>Portfolio Condition</code></td></tr>
    <tr><td>4</td><td><code>Asset Type</code></td><td><code>Stock</code>, <code>Token</code></td></tr>
    <tr><td>5</td><td><code>Execution</code></td><td><code>Buy</code>, <code>Sell</code>, <code>Rebalance</code>, <code>Allocate</code>, <code>Scale Out</code>, <code>Take Profit</code>, <code>Stop Loss</code>, <code>Cooldown</code>, <code>Position Limit</code>, <code>Exposure Limit</code></td></tr>
    <tr><td>6</td><td><code>Zoom</code></td><td>Zoom controls</td></tr>
  </tbody>
</table>

### Execution Dropdown Groups

The Execution menu is organized into three groups so trade actions, portfolio actions, and risk controls stay readable.

<table width="100%">
  <thead>
    <tr>
      <th>No</th>
      <th>Group</th>
      <th>Items</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td><code>Actions</code></td><td><code>Buy</code>, <code>Sell</code>, <code>Rebalance</code></td></tr>
    <tr><td>2</td><td><code>Portfolio</code></td><td><code>Allocate</code>, <code>Scale Out</code></td></tr>
    <tr><td>3</td><td><code>Risk</code></td><td><code>Take Profit</code>, <code>Stop Loss</code>, <code>Cooldown</code>, <code>Position Limit</code>, <code>Exposure Limit</code></td></tr>
  </tbody>
</table>

---

## Canvas Nodes

Nodes are the core building blocks of every strategy. Each node belongs to a group and carries a specific role in how capital is allocated, conditions are evaluated, and actions are triggered across the graph.

<table width="100%">
  <thead>
    <tr>
      <th>No</th>
      <th>Node Name</th>
      <th>Group</th>
      <th>Function</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td><code>Start</code></td><td>Flow</td><td>Defines the opening allocation that feeds downstream logic and execution steps.</td></tr>
    <tr><td>2</td><td><code>Loop</code></td><td>Flow</td><td>Defines when the strategy should re-check or re-enter evaluation.</td></tr>
    <tr><td>3</td><td><code>End</code></td><td>Flow</td><td>Defines completion, exit, or branch-closing conditions for the current path.</td></tr>
    <tr><td>4</td><td><code>If</code></td><td>Logic</td><td>Evaluates typed decision rules using market, portfolio, or position context.</td></tr>
    <tr><td>5</td><td><code>Else</code></td><td>Logic</td><td>Defines the fallback route when the paired condition does not pass.</td></tr>
    <tr><td>6</td><td><code>All Of</code></td><td>Logic</td><td>Requires all connected conditions to pass.</td></tr>
    <tr><td>7</td><td><code>Any Of</code></td><td>Logic</td><td>Requires at least one connected condition to pass.</td></tr>
    <tr><td>8</td><td><code>Not</code></td><td>Logic</td><td>Inverts a connected condition result.</td></tr>
    <tr><td>9</td><td><code>Only One</code></td><td>Logic</td><td>Allows exactly one connected condition to pass.</td></tr>
    <tr><td>10</td><td><code>Match All</code></td><td>Logic / Set</td><td>Keeps only assets shared across multiple result sets.</td></tr>
    <tr><td>11</td><td><code>Match Any</code></td><td>Logic / Set</td><td>Combines assets from multiple result sets.</td></tr>
    <tr><td>12</td><td><code>Exclude</code></td><td>Logic / Set</td><td>Removes matching assets from a result set.</td></tr>
    <tr><td>13</td><td><code>Filter</code></td><td>Logic</td><td>Ranks and narrows connected assets before continuing the flow.</td></tr>
    <tr><td>14</td><td><code>Portfolio Condition</code></td><td>Logic</td><td>Branches using portfolio state such as cash, exposure, open positions, or drawdown.</td></tr>
    <tr><td>15</td><td><code>Stock</code></td><td>Asset</td><td>Represents a stock asset node used by other nodes.</td></tr>
    <tr><td>16</td><td><code>Token</code></td><td>Asset</td><td>Represents a token or crypto asset node used by other nodes.</td></tr>
    <tr><td>17</td><td><code>Buy</code></td><td>Execution / Actions</td><td>Represents an entry, add, or rotate-into action for a selected connected asset.</td></tr>
    <tr><td>18</td><td><code>Sell</code></td><td>Execution / Actions</td><td>Represents a full exit, reduction, or partial take-down action.</td></tr>
    <tr><td>19</td><td><code>Rebalance</code></td><td>Execution / Actions</td><td>Represents a rebalance step across a branch, selected assets, or a broader set.</td></tr>
    <tr><td>20</td><td><code>Allocate</code></td><td>Execution / Portfolio</td><td>Represents a target-weight or add-exposure allocation step.</td></tr>
    <tr><td>21</td><td><code>Scale Out</code></td><td>Execution / Portfolio</td><td>Reduces exposure gradually by percentage.</td></tr>
    <tr><td>22</td><td><code>Take Profit</code></td><td>Execution / Risk</td><td>Represents a single, partial, or ladder profit-taking step.</td></tr>
    <tr><td>23</td><td><code>Stop Loss</code></td><td>Execution / Risk</td><td>Represents a fixed, trailing, or break-even protective step.</td></tr>
    <tr><td>24</td><td><code>Cooldown</code></td><td>Execution / Risk</td><td>Adds a pause before the flow can continue.</td></tr>
    <tr><td>25</td><td><code>Position Limit</code></td><td>Execution / Risk</td><td>Represents a max position size rule in the flow.</td></tr>
    <tr><td>26</td><td><code>Exposure Limit</code></td><td>Execution / Risk</td><td>Represents a max exposure rule in the flow.</td></tr>
  </tbody>
</table>

---

## Detailed Node Documentation

Each node exposes a configurable sidebar when selected on the canvas. The sections below document the available fields, behavior modes, and example configurations for the main node groups.

### Flow Nodes

<table width="100%">
  <thead><tr><th>Node</th><th>Key Fields</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><code>Start</code></td><td><code>Equal</code>, <code>Specific Percentage</code>, <code>Market Cap</code></td><td>Defines the opening allocation across connected assets.</td></tr>
    <tr><td><code>Loop</code></td><td><code>Time Interval</code>, <code>Drift Threshold</code>, <code>On New Deposit</code>, <code>Run Mode</code>, <code>After Branch Action</code></td><td>Controls recurring evaluation and optional wait/cooldown behavior.</td></tr>
    <tr><td><code>End</code></td><td><code>Price Reaches</code>, <code>Portfolio Value</code>, <code>Time Based</code>, <code>Max Drawdown</code>, <code>Daily Loss</code>, <code>Exposure Limit</code>, <code>Position Concentration</code>, <code>Volatility Limit</code></td><td>Closes the current path when an end condition is reached.</td></tr>
  </tbody>
</table>

### Logic Nodes

<table width="100%">
  <thead><tr><th>Node</th><th>Key Fields</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><code>If</code></td><td><code>Condition Source</code>, <code>Condition Type</code>, indicators, comparators, periods, values</td><td>Supports <code>Market</code>, <code>Portfolio</code>, and <code>Position</code> sources plus typed conditions.</td></tr>
    <tr><td><code>Else</code></td><td>Fallback path only</td><td>Acts as the alternate route when the paired condition does not pass.</td></tr>
    <tr><td><code>Filter</code></td><td><code>Asset View</code>, <code>Primary Rule</code>, <code>Secondary Rule</code>, <code>Ordering</code>, <code>Result Mode</code>, <code>How Many</code></td><td>Supports per-asset filter views and multiple result modes.</td></tr>
    <tr><td><code>Portfolio Condition</code></td><td><code>Portfolio Metric</code>, comparator, target value</td><td>Useful for cash, exposure, open position count, unrealized PnL, and drawdown checks.</td></tr>
  </tbody>
</table>

### Asset Nodes

<table width="100%">
  <thead><tr><th>Node</th><th>Examples</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><code>Stock</code></td><td><code>AAPL</code>, <code>NVDA</code>, <code>MSFT</code>, <code>TSLA</code></td><td>Acts as a stock data source for logic, filter, execution, and risk nodes.</td></tr>
    <tr><td><code>Token</code></td><td><code>BTC</code>, <code>ETH</code>, <code>SOL</code>, <code>USDC</code></td><td>Acts as a crypto asset source for logic, filter, execution, and risk nodes.</td></tr>
  </tbody>
</table>

### Execution And Risk Nodes

<table width="100%">
  <thead><tr><th>Node</th><th>Key Fields</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><code>Buy</code></td><td><code>Target Asset</code>, <code>Amount Mode</code>, <code>Buy Type</code>, amount</td><td>Supports <code>Open</code>, <code>Add</code>, and <code>Rotate Into</code>.</td></tr>
    <tr><td><code>Sell</code></td><td><code>Target Asset</code>, <code>Amount Mode</code>, <code>Sell Type</code>, amount</td><td>Supports <code>Full Exit</code>, <code>Reduce</code>, and <code>Take Partial</code>.</td></tr>
    <tr><td><code>Rebalance</code></td><td><code>Rebalance Mode</code>, <code>Rebalance Scope</code>, threshold</td><td>Supports <code>Equal</code> vs <code>Target</code> plus multiple scopes.</td></tr>
    <tr><td><code>Allocate</code></td><td><code>Weighting Mode</code>, <code>Allocation Style</code>, amount</td><td>Supports <code>Target Weight</code> and <code>Add Exposure</code>.</td></tr>
    <tr><td><code>Scale Out</code></td><td><code>Reduce By</code></td><td>Represents a staged reduction instead of a full exit.</td></tr>
    <tr><td><code>Take Profit</code></td><td><code>Target Asset</code>, comparator, threshold, <code>Mode</code></td><td>Supports <code>Single</code>, <code>Partial</code>, and <code>Ladder</code>.</td></tr>
    <tr><td><code>Stop Loss</code></td><td><code>Target Asset</code>, comparator, threshold, <code>Mode</code></td><td>Supports <code>Fixed</code>, <code>Trailing</code>, and <code>Break-even</code>.</td></tr>
    <tr><td><code>Cooldown</code></td><td><code>Cooldown Scope</code>, duration, unit</td><td>Adds a pause before the flow can continue.</td></tr>
    <tr><td><code>Position Limit</code></td><td><code>Limit Mode</code>, <code>Apply To</code>, limit value</td><td>Represents a position size cap in the strategy flow.</td></tr>
    <tr><td><code>Exposure Limit</code></td><td><code>Exposure Type</code>, comparator, limit value</td><td>Represents an exposure cap in the strategy flow.</td></tr>
  </tbody>
</table>

---

## Templates

The staging canvas can preload a complex graph so the product feels alive as soon as it opens.

Current template direction:

- Multi-asset strategy preview
- `Filter` with per-asset views
- Typed `If` rules
- Portfolio-aware branching with `Portfolio Condition`
- Execution and risk examples using `Buy`, `Allocate`, `Take Profit`, `Stop Loss`, `Cooldown`, `Position Limit`, and `Exposure Limit`
- Logic and set operations such as `All Of`, `Any Of`, `Not`, `Only One`, `Match All`, `Match Any`, and `Exclude`

---

## Keyboard Shortcuts

The canvas supports keyboard-driven interaction for common editing actions.

| Action | Shortcut |
|---|---|
| Undo | `Ctrl+Z` |
| Redo | `Ctrl+Y` |
| Navigate dropdown | `Arrow Keys` |
| Select menu item | `Enter` |
| Close menu | `Esc` |

---

## Development Notes

Design principles guiding the current implementation:

- **Token-driven theming**: light and dark modes share a single set of design tokens
- **Reusable node shell**: all nodes use a consistent visual container for uniform appearance
- **Reusable sidebar components**: sidebar headers and field sections are shared across all node types
- **Dock-first interaction**: grouped menus in the dock replace large permanent tool panels
- **Horizontal node summaries**: nodes display badge-style summaries of their configuration inline on the canvas
- **Config-driven labels**: connector labels and node naming are centralized for easier extension
