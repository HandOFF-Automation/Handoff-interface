<p>
  <img src="./src/assets/icon/icon%20handoff.png" alt="Handoff Interface" width="72" align="left">
</p>

# Handoff Interface
## Node based risk management

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
- Grouped logic and execution menus in the dock

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
git clone <your-repo-url>
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

The app exposes a set of routes for the canvas workspace, strategy management, and dashboard. The `/canvas/staging` and `/strategies/staging` routes serve as the primary working environments during development.

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

The canvas is designed to feel close to a Figma-style interaction model — spatial, direct, and keyboard-accessible. Users can freely navigate the canvas, place and connect nodes, and configure behavior through sidebars without leaving the main editing surface.

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
    <tr><td>1</td><td><code>Tool</code></td><td><code>Click</code>, <code>Hand</code></td></tr>
    <tr><td>2</td><td><code>Nodes</code></td><td><code>Start</code>, <code>Loop</code>, <code>End</code></td></tr>
    <tr><td>3</td><td><code>Logic</code></td><td><code>If</code>, <code>Else</code>, <code>Filter</code></td></tr>
    <tr><td>4</td><td><code>Asset Type</code></td><td><code>Stock</code>, <code>Token</code></td></tr>
    <tr><td>5</td><td><code>Execution</code></td><td><code>Buy</code>, <code>Sell</code>, <code>Rebalance</code>, <code>Allocate</code>, <code>Scale Out</code>, <code>Take Profit</code>, <code>Stop Loss</code></td></tr>
    <tr><td>6</td><td><code>Zoom</code></td><td>Zoom controls</td></tr>
  </tbody>
</table>

### Execution Dropdown Groups

The Execution menu is further organized into three groups — Actions, Portfolio, and Risk — to separate trade-level actions from portfolio management and risk control behaviors.

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
    <tr><td>3</td><td><code>Risk</code></td><td><code>Take Profit</code>, <code>Stop Loss</code></td></tr>
  </tbody>
</table>

---

## Canvas Nodes

Nodes are the core building blocks of every strategy. Each node belongs to a group — Flow, Logic, Asset, or Execution — and carries a specific role in how capital is allocated, conditions are evaluated, and actions are triggered across the graph.

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
    <tr><td>1</td><td><code>Start</code></td><td>Flow</td><td>Defines how the strategy begins allocating into connected assets.</td></tr>
    <tr><td>2</td><td><code>Loop</code></td><td>Flow</td><td>Defines repeated strategy behavior over time or by trigger.</td></tr>
    <tr><td>3</td><td><code>End</code></td><td>Flow</td><td>Defines completion, exit, or risk-stop conditions for the strategy.</td></tr>
    <tr><td>4</td><td><code>If</code></td><td>Logic</td><td>Compares a metric against a value or another metric.</td></tr>
    <tr><td>5</td><td><code>Else</code></td><td>Logic</td><td>Defines the fallback conditional branch.</td></tr>
    <tr><td>6</td><td><code>Filter</code></td><td>Logic</td><td>Sorts and narrows connected assets before continuing the flow.</td></tr>
    <tr><td>7</td><td><code>Stock</code></td><td>Asset</td><td>Represents a stock asset node used by other nodes.</td></tr>
    <tr><td>8</td><td><code>Token</code></td><td>Asset</td><td>Represents a token or crypto asset node used by other nodes.</td></tr>
    <tr><td>9</td><td><code>Buy</code></td><td>Execution / Actions</td><td>Buys a selected connected asset by percentage or value.</td></tr>
    <tr><td>10</td><td><code>Sell</code></td><td>Execution / Actions</td><td>Sells a selected connected asset by percentage or value.</td></tr>
    <tr><td>11</td><td><code>Rebalance</code></td><td>Execution / Actions</td><td>Rebalances the portfolio toward a mode when a threshold is reached.</td></tr>
    <tr><td>12</td><td><code>Allocate</code></td><td>Execution / Portfolio</td><td>Applies an allocation amount using percentage or value mode.</td></tr>
    <tr><td>13</td><td><code>Scale Out</code></td><td>Execution / Portfolio</td><td>Reduces exposure gradually by percentage.</td></tr>
    <tr><td>14</td><td><code>Take Profit</code></td><td>Execution / Risk</td><td>Triggers profit-taking when an asset crosses a threshold.</td></tr>
    <tr><td>15</td><td><code>Stop Loss</code></td><td>Execution / Risk</td><td>Triggers protection when an asset crosses a loss threshold.</td></tr>
  </tbody>
</table>

---

## Detailed Node Documentation

Each node exposes a configurable sidebar when selected on the canvas. The sections below document the available fields, behavior modes, and example configurations for every node type.

---

### 1. Start

The `Start` node is the entry point of any strategy. It defines the initial allocation logic applied to connected assets before any downstream execution or decision nodes are evaluated.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Defines the initial allocation logic for the strategy.</td></tr>
    <tr><td>2</td><td>Input Flow</td><td>Usually sits near the beginning of the graph and connects to one or more asset nodes.</td></tr>
    <tr><td>3</td><td><code>Equal</code></td><td>Splits starting allocation equally across connected assets.</td></tr>
    <tr><td>4</td><td><code>Specific Percentage</code></td><td>Allows manual percentages per connected asset.</td></tr>
    <tr><td>5</td><td><code>Market Cap</code></td><td>Weights based on market capitalization logic.</td></tr>
    <tr><td>6</td><td>Output Behavior</td><td>Passes the selected starting allocation logic into the next connected step in the strategy.</td></tr>
    <tr><td>7</td><td>Typical Use</td><td>Begin a strategy with portfolio construction rules.</td></tr>
    <tr><td>8</td><td>Example</td><td>Start with <code>Specific Percentage</code> across BTC 50%, ETH 30%, SOL 20%.</td></tr>
  </tbody>
</table>

---

### 2. Loop

The `Loop` node controls when a strategy repeats or checks conditions again. It supports time-based intervals, drift-triggered rebalancing, and deposit-driven re-evaluation — making it the primary mechanism for recurring strategy behavior.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Defines when the strategy should repeat or rebalance again.</td></tr>
    <tr><td>2</td><td>Input Flow</td><td>Usually appears after <code>Start</code> or after execution logic that needs to run again over time.</td></tr>
    <tr><td>3</td><td><code>Time Interval</code></td><td>Rebalance every selected interval.</td></tr>
    <tr><td>4</td><td><code>Drift Threshold</code></td><td>Rebalance when allocation drift reaches a chosen percentage.</td></tr>
    <tr><td>5</td><td><code>On New Deposit</code></td><td>React when new capital enters the strategy.</td></tr>
    <tr><td>6</td><td>Sub-options</td><td>Interval value and time unit, drift threshold value, deposit timing behavior.</td></tr>
    <tr><td>7</td><td>Output Behavior</td><td>Re-runs or continues the strategy path when the chosen trigger condition is met.</td></tr>
    <tr><td>8</td><td>Example</td><td>Rebalance every 7 days or when portfolio drift reaches 5%.</td></tr>
  </tbody>
</table>

---

### 3. End

The `End` node defines exit conditions for a strategy. It supports a wide range of termination triggers — from price targets to drawdown limits — allowing precise control over when the strategy should stop running.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Defines when the flow should stop, exit, or close out.</td></tr>
    <tr><td>2</td><td>Asset Support</td><td>Can monitor connected asset nodes or portfolio-level conditions, depending on mode.</td></tr>
    <tr><td>3</td><td><code>Price Reaches</code></td><td>Stop when a watched asset reaches a target price.</td></tr>
    <tr><td>4</td><td><code>Portfolio Value</code></td><td>Stop when total portfolio value reaches a threshold.</td></tr>
    <tr><td>5</td><td><code>Time Based</code></td><td>Stop after a duration.</td></tr>
    <tr><td>6</td><td><code>Max Drawdown</code></td><td>Stop when drawdown reaches a threshold.</td></tr>
    <tr><td>7</td><td><code>Daily Loss</code></td><td>Stop when daily loss reaches a threshold.</td></tr>
    <tr><td>8</td><td><code>Exposure Limit</code></td><td>Stop when exposure breaches a limit.</td></tr>
    <tr><td>9</td><td><code>Position Concentration</code></td><td>Stop when a position becomes too concentrated.</td></tr>
    <tr><td>10</td><td><code>Volatility Limit</code></td><td>Stop when volatility exceeds a threshold.</td></tr>
    <tr><td>11</td><td>Output Behavior</td><td>Terminates the current strategy path when the selected exit condition is satisfied.</td></tr>
    <tr><td>12</td><td>Example</td><td>End when BTC reaches $80,000 or when max drawdown exceeds 12%.</td></tr>
  </tbody>
</table>

---

### 4. If

The `If` node introduces conditional branching into the strategy graph. It evaluates a market metric against a chosen value or another metric and routes the flow based on the result.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Adds a conditional decision node to the flow.</td></tr>
    <tr><td>2</td><td>Input Flow</td><td>Usually receives a connected asset and passes the graph into different branches depending on the result.</td></tr>
    <tr><td>3</td><td>Metric Options</td><td><code>Current Price</code>, <code>Current Market Cap</code>, <code>Volume</code>, <code>Simple Moving Average</code>, <code>Exponential Moving Average</code></td></tr>
    <tr><td>4</td><td>Comparator Options</td><td><code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>, <code>=</code></td></tr>
    <tr><td>5</td><td>Compare Against</td><td><code>Value</code>, <code>Metric</code></td></tr>
    <tr><td>6</td><td>Output Behavior</td><td>Routes the strategy into a condition-based path when the comparison returns true.</td></tr>
    <tr><td>7</td><td>Example</td><td>If <code>Current Price of BTC &gt;= 70000</code>, continue into a <code>Take Profit</code> branch.</td></tr>
  </tbody>
</table>

---

### 5. Else

The `Else` node defines what happens when the preceding condition is not met. It mirrors the `If` node's comparison structure and provides a consistent way to handle fallback paths in the strategy graph.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Defines the alternate branch after a condition fails or needs fallback handling.</td></tr>
    <tr><td>2</td><td>Input Flow</td><td>Usually pairs with a prior condition-driven branch.</td></tr>
    <tr><td>3</td><td>Current Behavior</td><td>Mirrors the configurable compare structure used by <code>If</code>.</td></tr>
    <tr><td>4</td><td>Comparison Support</td><td>Supports metric vs value and metric vs metric comparison.</td></tr>
    <tr><td>5</td><td>Output Behavior</td><td>Continues the fallback route when the primary branch does not satisfy its intended condition.</td></tr>
    <tr><td>6</td><td>Example</td><td>Else send the flow into <code>Scale Out</code> or <code>Stop Loss</code> handling.</td></tr>
  </tbody>
</table>

---

### 6. Filter

The `Filter` node narrows a group of connected assets down to a ranked subset before passing them to the next step. It is particularly useful for strategies that select top performers dynamically rather than targeting fixed assets.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Narrows a set of connected assets before the next step in the flow.</td></tr>
    <tr><td>2</td><td>Input Flow</td><td>Usually receives one or more connected assets that need to be ranked or filtered.</td></tr>
    <tr><td>3</td><td>Sort Functions</td><td><code>Current Price</code>, <code>Current Market Cap</code>, <code>Volume</code>, <code>Percent Gain</code></td></tr>
    <tr><td>4</td><td>Ordering</td><td><code>Top</code>, <code>Bottom</code></td></tr>
    <tr><td>5</td><td>Other Inputs</td><td>Target asset source and result limit.</td></tr>
    <tr><td>6</td><td>Output Behavior</td><td>Passes only the filtered subset into the next node in the flow.</td></tr>
    <tr><td>7</td><td>Example</td><td>Filter the top 3 assets by <code>Percent Gain</code> before triggering <code>Buy</code>.</td></tr>
  </tbody>
</table>

---

### 7. Stock

The `Stock` node represents a traditional equity asset in the strategy graph. It acts as a data source and connection point for allocation, logic, filtering, and execution nodes throughout the flow.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Represents a stock asset in the graph.</td></tr>
    <tr><td>2</td><td>Current Examples</td><td><code>AAPL</code>, <code>NVDA</code>, <code>MSFT</code>, <code>TSLA</code></td></tr>
    <tr><td>3</td><td>Strategy Role</td><td>Works as a connected asset source for allocation, filtering, comparisons, and execution nodes.</td></tr>
    <tr><td>4</td><td>Data Usage</td><td>Can supply symbol-specific context for logic, execution, and risk nodes.</td></tr>
    <tr><td>5</td><td>Typical Use</td><td>Feed market data into <code>Start</code>, <code>If</code>, <code>Filter</code>, <code>Buy</code>, <code>Sell</code>, <code>Take Profit</code>, or <code>Stop Loss</code>.</td></tr>
    <tr><td>6</td><td>Example</td><td>Use <code>AAPL</code> as the watched asset for a momentum or breakout rule.</td></tr>
  </tbody>
</table>

---

### 8. Token

The `Token` node represents a crypto or on-chain asset in the strategy graph. It functions the same way as the `Stock` node but is intended for digital assets and can be used in both centralized and decentralized strategy workflows.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Represents a token or crypto asset in the graph.</td></tr>
    <tr><td>2</td><td>Current Examples</td><td><code>BTC</code>, <code>ETH</code>, <code>SOL</code>, <code>USDC</code></td></tr>
    <tr><td>3</td><td>Strategy Role</td><td>Works as a connected asset source for allocation, filtering, comparisons, and execution nodes.</td></tr>
    <tr><td>4</td><td>Data Usage</td><td>Can supply symbol-specific context for logic, execution, and risk nodes.</td></tr>
    <tr><td>5</td><td>Typical Use</td><td>Feed market data into <code>Start</code>, <code>If</code>, <code>Filter</code>, <code>Buy</code>, <code>Sell</code>, <code>Take Profit</code>, or <code>Stop Loss</code>.</td></tr>
    <tr><td>6</td><td>Example</td><td>Use <code>BTC</code> or <code>ETH</code> as the base asset in a rebalancing or breakout strategy.</td></tr>
  </tbody>
</table>

---

### 9. Buy

The `Buy` node represents an entry or position-increase action in the strategy flow. It targets a specific connected asset and supports both percentage-based and value-based amount configuration.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Buys a chosen connected asset.</td></tr>
    <tr><td>2</td><td>Target Asset</td><td>Select a connected asset node.</td></tr>
    <tr><td>3</td><td>Amount Mode</td><td><code>Percentage</code>, <code>Value</code></td></tr>
    <tr><td>4</td><td>Amount Value</td><td>Manual amount entry based on the selected mode.</td></tr>
    <tr><td>5</td><td>How It Works</td><td>Uses the selected asset and amount configuration to represent a buy action in the flow.</td></tr>
    <tr><td>6</td><td>Input Flow</td><td>Typically follows a selection or decision node such as <code>Filter</code> or <code>If</code>.</td></tr>
    <tr><td>7</td><td>Output Behavior</td><td>Represents entering or increasing a position in the chosen asset.</td></tr>
    <tr><td>8</td><td>Typical Use</td><td>Enter a position after a filter or condition node decides the asset should be bought.</td></tr>
    <tr><td>9</td><td>Example</td><td>Buy BTC by <code>Value</code> using $1000, or buy SOL by <code>Percentage</code> using 20%.</td></tr>
  </tbody>
</table>

---

### 10. Sell

The `Sell` node represents a position reduction or exit action in the strategy flow. Like `Buy`, it targets a connected asset and supports both percentage and value modes for defining the amount to sell.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Sells a chosen connected asset.</td></tr>
    <tr><td>2</td><td>Target Asset</td><td>Select a connected asset node.</td></tr>
    <tr><td>3</td><td>Amount Mode</td><td><code>Percentage</code>, <code>Value</code></td></tr>
    <tr><td>4</td><td>Amount Value</td><td>Manual amount entry based on the selected mode.</td></tr>
    <tr><td>5</td><td>How It Works</td><td>Uses the selected asset and amount configuration to represent a sell action in the flow.</td></tr>
    <tr><td>6</td><td>Input Flow</td><td>Typically follows a branch, rebalance decision, or risk-management condition.</td></tr>
    <tr><td>7</td><td>Output Behavior</td><td>Represents reducing or closing a position in the chosen asset.</td></tr>
    <tr><td>8</td><td>Typical Use</td><td>Reduce or close a position after a logic branch, execution rule, or risk trigger.</td></tr>
    <tr><td>9</td><td>Example</td><td>Sell ETH by <code>Percentage</code> using 50%, or sell NVDA by <code>Value</code> using $500.</td></tr>
  </tbody>
</table>

---

### 11. Rebalance

The `Rebalance` node restores the portfolio to a target allocation after it has drifted due to price changes or new activity. Unlike the `Start` node which sets the initial allocation, `Rebalance` is a maintenance step that runs while the strategy is already active.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Rebalances the current portfolio state.</td></tr>
    <tr><td>2</td><td>Mode</td><td><code>Equal</code>, <code>Target</code></td></tr>
    <tr><td>3</td><td>Trigger Threshold</td><td>Percentage value that triggers rebalance.</td></tr>
    <tr><td>4</td><td>How It Works</td><td>Waits for portfolio drift or rule conditions, then re-aligns allocation according to the chosen mode.</td></tr>
    <tr><td>5</td><td>Difference From <code>Start</code></td><td><code>Start</code> defines initial allocation, while <code>Rebalance</code> adjusts the portfolio after the strategy is already running.</td></tr>
    <tr><td>6</td><td>Input Flow</td><td>Usually appears after initial allocation and before later execution or monitoring steps.</td></tr>
    <tr><td>7</td><td>Output Behavior</td><td>Applies maintenance logic to bring positions back toward the intended portfolio shape.</td></tr>
    <tr><td>8</td><td>Typical Use</td><td>Maintain allocation discipline after price changes, deposits, or portfolio drift.</td></tr>
    <tr><td>9</td><td>Example</td><td>Rebalance to <code>Equal</code> when drift reaches <code>5%</code>.</td></tr>
  </tbody>
</table>

---

### 12. Allocate

The `Allocate` node applies a deliberate capital allocation to a branch of the strategy. It is used when a specific amount — either as a percentage of the portfolio or a fixed value — needs to be directed into a chosen path.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Applies a portfolio allocation amount.</td></tr>
    <tr><td>2</td><td>Weighting Mode</td><td><code>Percentage</code>, <code>Value</code></td></tr>
    <tr><td>3</td><td>Amount Value</td><td>Manual allocation entry based on the selected mode.</td></tr>
    <tr><td>4</td><td>How It Works</td><td>Represents a deliberate allocation step using either a percent-based or value-based amount.</td></tr>
    <tr><td>5</td><td>Input Flow</td><td>Usually follows a branch that decides where capital should be routed.</td></tr>
    <tr><td>6</td><td>Output Behavior</td><td>Pushes a defined allocation amount into the next connected portfolio path.</td></tr>
    <tr><td>7</td><td>Typical Use</td><td>Add capital to a portfolio branch or route a defined amount into a chosen strategy path.</td></tr>
    <tr><td>8</td><td>Example</td><td>Allocate <code>25%</code> of the portfolio or allocate <code>$2000</code> to a selected branch.</td></tr>
  </tbody>
</table>

---

### 13. Scale Out

The `Scale Out` node reduces an active position in stages rather than all at once. It is intended for de-risking strategies that benefit from gradual exits — locking in partial gains or reducing exposure while keeping part of the position active.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Gradually reduces exposure instead of exiting all at once.</td></tr>
    <tr><td>2</td><td>Reduce By</td><td>Percentage amount used to reduce the position.</td></tr>
    <tr><td>3</td><td>How It Works</td><td>Reduces the active position in smaller staged amounts rather than performing a full exit.</td></tr>
    <tr><td>4</td><td>Input Flow</td><td>Usually appears after a bullish branch, target hit, or staged de-risking plan.</td></tr>
    <tr><td>5</td><td>Output Behavior</td><td>Cuts position size partially while leaving the strategy active for the remaining balance.</td></tr>
    <tr><td>6</td><td>Typical Use</td><td>Lock in gains or reduce risk progressively while keeping part of the position active.</td></tr>
    <tr><td>7</td><td>Example</td><td>Scale out by <code>20%</code> after the asset reaches an intermediate target.</td></tr>
  </tbody>
</table>

---

### 14. Take Profit

The `Take Profit` node monitors a connected asset and signals a profit-taking action when a defined upside threshold is crossed. It sits in the gain-capture or exit branch of the strategy graph and is typically positioned after a position-entry path.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Triggers a profit-taking condition.</td></tr>
    <tr><td>2</td><td>Target Asset</td><td>Select a connected asset node.</td></tr>
    <tr><td>3</td><td>Comparator</td><td><code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code></td></tr>
    <tr><td>4</td><td>Threshold Value</td><td>Manual threshold value for the trigger.</td></tr>
    <tr><td>5</td><td>How It Works</td><td>Watches the selected asset and triggers a profit-oriented execution decision when the comparator rule is satisfied.</td></tr>
    <tr><td>6</td><td>Input Flow</td><td>Usually follows a position-entry path and sits in the risk or exit branch of the graph.</td></tr>
    <tr><td>7</td><td>Output Behavior</td><td>Signals that the strategy should capture gains once the defined upside condition is reached.</td></tr>
    <tr><td>8</td><td>Typical Use</td><td>Lock in gains after price appreciation or when a target level has been reached.</td></tr>
    <tr><td>9</td><td>Example</td><td><code>Take Profit when BTC &gt;= 75000</code> or <code>Take Profit when AAPL &gt; 220</code>.</td></tr>
  </tbody>
</table>

---

### 15. Stop Loss

The `Stop Loss` node monitors a connected asset and triggers a protective action when a downside threshold is breached. It is typically placed in the defensive branch of the graph to limit exposure when the market moves against the strategy.

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Triggers a downside protection condition.</td></tr>
    <tr><td>2</td><td>Target Asset</td><td>Select a connected asset node.</td></tr>
    <tr><td>3</td><td>Comparator</td><td><code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code></td></tr>
    <tr><td>4</td><td>Threshold Value</td><td>Manual threshold value for the trigger.</td></tr>
    <tr><td>5</td><td>How It Works</td><td>Watches the selected asset and triggers a protective execution decision when the comparator rule is satisfied.</td></tr>
    <tr><td>6</td><td>Input Flow</td><td>Usually follows a position-entry path and sits in the protection or defensive branch of the graph.</td></tr>
    <tr><td>7</td><td>Output Behavior</td><td>Signals that the strategy should reduce or close exposure when downside conditions are met.</td></tr>
    <tr><td>8</td><td>Typical Use</td><td>Limit losses or reduce downside exposure when price moves against the strategy.</td></tr>
    <tr><td>9</td><td>Example</td><td><code>Stop Loss when ETH &lt;= 2800</code> or <code>Stop Loss when NVDA &lt; 1000</code>.</td></tr>
  </tbody>
</table>

---

## Keyboard Shortcuts

The canvas supports keyboard-driven interaction for common editing actions, keeping the workflow fast without reaching for the mouse.

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

- **Token-driven theming** — light and dark modes share a single set of design tokens
- **Reusable node shell** — all nodes use a consistent visual container for uniform appearance
- **Reusable sidebar components** — sidebar headers and field sections are shared across all node types
- **Dock-first interaction** — grouped menus in the dock replace large permanent tool panels
- **Horizontal node summaries** — nodes display badge-style summaries of their configuration inline on the canvas
