ya # Handoff Interface

<p>
  <img src="./src/assets/icon/icon%20handoff.png" alt="Handoff Interface" width="72" align="left">
</p>

Frontend workspace for Handoff's visual strategy builder.



Handoff Interface is a node-based canvas application for designing strategy flows across trading, portfolio management, and risk automation. The current product direction combines visual strategy composition, configurable node sidebars, collaboration comments, and a Figma-like editing experience that can later map into backend agents, exchange execution, or smart contract workflows.

## What This Project Is

Handoff Interface is the visual layer for building strategy logic before execution.

Core goals:

- build strategy flows visually on a canvas
- configure portfolio, logic, and risk behavior through node sidebars
- connect assets, conditions, and actions in a single graph
- support collaboration with inline comments and annotations
- prepare strategies that can later connect to agents, APIs, or contracts

Long-term workspace split:

- `handoff-interface`: frontend canvas, UX, comments, configuration, strategy editing
- `handoff-contract`: contract-side execution and deployment logic

## Current Highlights

- infinite-style strategy canvas
- light and dark themes using shared design tokens
- dock-based canvas controls
- keyboard-friendly dropdown menus
- node placement, dragging, selection, marquee selection, and edge creation
- orthogonal edge rendering with preview connections
- per-node configuration sidebars
- inline comment threads and collaboration markers
- editable canvas title
- grouped dock menus with consistent headings and typed logic conditions
- config-driven connector labels so node edge text can be extended from one place
- staging canvas can preload a complex template graph from config for previewing end-to-end strategy flows

## Tech Stack

- React
- TypeScript
- Vite
- Phosphor Icons

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

## Environment Notes

This project uses env-backed configuration for some external assets and integrations.

For example:

- `VITE_LOGO_DEV_PUBLISHABLE_KEY`

Do not place secret frontend keys in client-side env files.

## Main Routes

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

## Canvas Interaction Model

The canvas is designed to feel close to Figma-style interaction.

Supported behavior:

- pan and zoom
- click selection
- marquee selection
- drag nodes
- connect nodes from all four sides
- preview edges before placement
- keyboard shortcuts for undo and redo
- alignment guides while dragging
- sidebars for selected node configuration
- automatic connector labels rendered on edges for supported node types
- connector labels use config-driven defaults on canvas

## Dock Menus

The dock is the main control surface for editing on canvas.

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
    <tr><td>3</td><td><code>Logic</code></td><td><code>If</code>, <code>Else</code>, <code>Filter</code></td></tr>
    <tr><td>4</td><td><code>Asset Type</code></td><td><code>Stock</code>, <code>Token</code></td></tr>
    <tr><td>5</td><td><code>Execution</code></td><td><code>Buy</code>, <code>Sell</code>, <code>Rebalance</code>, <code>Allocate</code>, <code>Scale Out</code>, <code>Take Profit</code>, <code>Stop Loss</code></td></tr>
    <tr><td>6</td><td><code>Zoom</code></td><td>zoom controls</td></tr>
  </tbody>
</table>

### Execution Dropdown Groups

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

## Canvas Nodes

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
    <tr><td>1</td><td><code>Start</code></td><td>Flow</td><td>Defines the opening allocation that feeds downstream Filter, If, Else, and execution branches.</td></tr>
    <tr><td>2</td><td><code>Loop</code></td><td>Flow</td><td>Defines when the strategy should re-enter evaluation after the current branch continues.</td></tr>
    <tr><td>3</td><td><code>End</code></td><td>Flow</td><td>Defines completion, exit, or branch-closing conditions for the current strategy path.</td></tr>
    <tr><td>4</td><td><code>If</code></td><td>Logic</td><td>Evaluates typed strategy conditions such as threshold, relative, crossover, range, or advanced comparisons.</td></tr>
    <tr><td>5</td><td><code>Else</code></td><td>Logic</td><td>Defines the fallback branch that runs when the paired If condition does not pass.</td></tr>
    <tr><td>6</td><td><code>Filter</code></td><td>Logic</td><td>Sorts and narrows connected assets before continuing the flow, using both ranking metrics and strategy indicators.</td></tr>
    <tr><td>7</td><td><code>Stock</code></td><td>Asset</td><td>Represents a stock asset node used by other nodes.</td></tr>
    <tr><td>8</td><td><code>Token</code></td><td>Asset</td><td>Represents a token or crypto asset node used by other nodes.</td></tr>
    <tr><td>9</td><td><code>Buy</code></td><td>Execution / Actions</td><td>Buys a selected connected asset by percentage or value when a branch should enter a position.</td></tr>
    <tr><td>10</td><td><code>Sell</code></td><td>Execution / Actions</td><td>Sells a selected connected asset by percentage or value when a branch should reduce or exit exposure.</td></tr>
    <tr><td>11</td><td><code>Rebalance</code></td><td>Execution / Actions</td><td>Rebalances the portfolio toward a mode when a branch-level threshold is reached.</td></tr>
    <tr><td>12</td><td><code>Allocate</code></td><td>Execution / Portfolio</td><td>Applies an allocation amount using percentage or value mode for the current branch.</td></tr>
    <tr><td>13</td><td><code>Scale Out</code></td><td>Execution / Portfolio</td><td>Reduces branch exposure gradually by percentage.</td></tr>
    <tr><td>14</td><td><code>Take Profit</code></td><td>Execution / Risk</td><td>Triggers profit-taking when a branch reaches its watched threshold.</td></tr>
    <tr><td>15</td><td><code>Stop Loss</code></td><td>Execution / Risk</td><td>Triggers protection when a branch reaches its watched loss threshold.</td></tr>
  </tbody>
</table>

## Detailed Node Documentation

### 1. Start

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Defines the initial allocation logic for the strategy before the graph moves into Filter, If, Else, or execution logic.</td></tr>
    <tr><td>2</td><td>Input Flow</td><td>Usually sits near the beginning of the graph and connects to one or more asset nodes that feed downstream decision branches.</td></tr>
    <tr><td>3</td><td><code>Equal</code></td><td>Splits starting allocation equally across connected assets.</td></tr>
    <tr><td>4</td><td><code>Specific Percentage</code></td><td>Allows manual percentages per connected asset.</td></tr>
    <tr><td>5</td><td><code>Market Cap</code></td><td>Weights based on market capitalization logic.</td></tr>
    <tr><td>6</td><td>Output Behavior</td><td>Passes the selected starting allocation logic into the next connected step in the strategy.</td></tr>
    <tr><td>7</td><td>Typical Use</td><td>Begin a strategy with portfolio construction rules.</td></tr>
    <tr><td>8</td><td>Example</td><td>Start with <code>Specific Percentage</code> across BTC 50%, ETH 30%, SOL 20%.</td></tr>
  </tbody>
</table>

### 2. Loop

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Defines when the strategy should repeat, re-evaluate, or revisit the next branch cycle.</td></tr>
    <tr><td>2</td><td>Input Flow</td><td>Usually appears after <code>Start</code>, <code>If</code>, <code>Else</code>, or execution logic that should eventually send the flow through another evaluation pass.</td></tr>
    <tr><td>3</td><td><code>Time Interval</code></td><td>Rebalance every selected interval.</td></tr>
    <tr><td>4</td><td><code>Drift Threshold</code></td><td>Rebalance when allocation drift reaches a chosen percentage.</td></tr>
    <tr><td>5</td><td><code>On New Deposit</code></td><td>React when new capital enters the strategy.</td></tr>
    <tr><td>6</td><td>Sub-options</td><td>Interval value and time unit, drift threshold value, deposit timing behavior.</td></tr>
    <tr><td>7</td><td>Output Behavior</td><td>Re-runs or continues the strategy path when the chosen trigger condition is met, making it useful after branch-specific actions.</td></tr>
    <tr><td>8</td><td>Example</td><td>Re-check the flow every 7 days or when portfolio drift reaches 5% after a branch completes.</td></tr>
  </tbody>
</table>

### 3. End

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Defines when the current flow or branch should stop, exit, or close out.</td></tr>
    <tr><td>2</td><td>Asset Support</td><td>Can monitor connected asset nodes or portfolio-level conditions, depending on mode.</td></tr>
    <tr><td>3</td><td><code>Price Reaches</code></td><td>Stop when a watched asset reaches a target price.</td></tr>
    <tr><td>4</td><td><code>Portfolio Value</code></td><td>Stop when total portfolio value reaches a threshold.</td></tr>
    <tr><td>5</td><td><code>Time Based</code></td><td>Stop after a duration.</td></tr>
    <tr><td>6</td><td><code>Max Drawdown</code></td><td>Stop when drawdown reaches a threshold.</td></tr>
    <tr><td>7</td><td><code>Daily Loss</code></td><td>Stop when daily loss reaches a threshold.</td></tr>
    <tr><td>8</td><td><code>Exposure Limit</code></td><td>Stop when exposure breaches a limit.</td></tr>
    <tr><td>9</td><td><code>Position Concentration</code></td><td>Stop when a position becomes too concentrated.</td></tr>
    <tr><td>10</td><td><code>Volatility Limit</code></td><td>Stop when volatility exceeds a threshold.</td></tr>
    <tr><td>11</td><td>Output Behavior</td><td>Terminates the current strategy path when the selected exit condition is satisfied, which makes it suitable for true branches, fallback branches, or risk-stop branches.</td></tr>
    <tr><td>12</td><td>Example</td><td>End the branch when BTC reaches $80,000 or when max drawdown exceeds 12%.</td></tr>
  </tbody>
</table>

### 4. If

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Adds a conditional decision node to the flow.</td></tr>
    <tr><td>2</td><td>Input Flow</td><td>Usually receives a connected asset and passes the graph into different branches depending on the result.</td></tr>
    <tr><td>3</td><td>Condition Types</td><td><code>Threshold</code>, <code>Relative</code>, <code>Crossover</code>, <code>Range</code>, <code>Advanced</code></td></tr>
    <tr><td>4</td><td>Indicator Options</td><td><code>Current Price</code>, <code>Current Market Cap</code>, <code>Volume</code>, <code>SMA</code>, <code>EMA</code>, <code>RSI</code>, <code>MACD Line</code>, <code>MACD Signal</code>, <code>MACD Histogram</code>, <code>ATR</code></td></tr>
    <tr><td>5</td><td>Dynamic Inputs</td><td>Supports periods for indicators, threshold values, range bounds, crossover events, and advanced metric-vs-metric fallback comparisons.</td></tr>
    <tr><td>6</td><td>Output Behavior</td><td>Routes the strategy into the primary branch when the selected decision rule evaluates to true.</td></tr>
    <tr><td>7</td><td>Example</td><td>If <code>RSI 14 of BTC &lt; 30</code>, continue into a <code>Buy</code> or <code>Allocate</code> branch.</td></tr>
  </tbody>
</table>

### 5. Else

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Defines the alternate branch after a condition fails or needs fallback handling.</td></tr>
    <tr><td>2</td><td>Input Flow</td><td>Usually pairs with a prior condition-driven branch.</td></tr>
    <tr><td>3</td><td>Current Behavior</td><td>Acts as a fallback branch rather than mirroring the full If condition editor.</td></tr>
    <tr><td>4</td><td>Configuration Style</td><td>Provides branch guidance in the sidebar and keeps the actual decision rule inside the paired <code>If</code> node.</td></tr>
    <tr><td>5</td><td>Output Behavior</td><td>Continues the alternate route when the primary branch condition does not pass.</td></tr>
    <tr><td>6</td><td>Example</td><td>Else send the flow into <code>Scale Out</code>, <code>Stop Loss</code>, or another fallback handling path.</td></tr>
  </tbody>
</table>

### 6. Filter

<table width="100%">
  <thead><tr><th>No</th><th>Field</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Purpose</td><td>Narrows a set of connected assets before the next step in the flow.</td></tr>
    <tr><td>2</td><td>Input Flow</td><td>Usually receives one or more connected assets that need to be ranked or filtered.</td></tr>
    <tr><td>3</td><td>Sort Functions</td><td><code>Current Price</code>, <code>Current Market Cap</code>, <code>Volume</code>, <code>Percent Gain</code>, <code>SMA</code>, <code>EMA</code>, <code>RSI</code>, <code>MACD Histogram</code>, <code>ATR</code></td></tr>
    <tr><td>4</td><td>Ordering</td><td><code>Top</code>, <code>Bottom</code></td></tr>
    <tr><td>5</td><td>Indicator Period</td><td>Supports a lookback period for <code>SMA</code>, <code>EMA</code>, <code>RSI</code>, and <code>ATR</code> so Filter can stay aligned with the richer If node language.</td></tr>
    <tr><td>6</td><td>Other Inputs</td><td>Target asset source and result limit.</td></tr>
    <tr><td>7</td><td>Output Behavior</td><td>Passes only the filtered subset into the next node in the flow.</td></tr>
    <tr><td>8</td><td>Example</td><td>Filter the top 3 assets by <code>RSI 14</code> before sending them into an <code>If</code> or <code>Buy</code> branch.</td></tr>
  </tbody>
</table>

### 7. Stock

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

### 8. Token

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

### 9. Buy

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

### 10. Sell

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

### 11. Rebalance

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

### 12. Allocate

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

### 13. Scale Out

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

### 14. Take Profit

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

### 15. Stop Loss

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

## Keyboard Notes

Canvas supports keyboard-based interaction for several actions.

Examples:

- `Ctrl+Z` for undo
- `Ctrl+Y` for redo
- dropdown navigation with arrow keys
- `Enter` to select menu items
- `Esc` to close menus

## Project Structure

Important directories:

- `src/components/canvas/`
  - canvas viewport, dock, sidebars, shared canvas UI
- `src/components/nodes/`
  - individual node components
- `src/components/dropdown/`
  - shared dropdown menu logic
- `src/pages/canvas/staging/`
  - canvas staging page and sidebar routing
- `src/pages/dashboard/`
  - dashboard layout and route content
- `src/state/`
  - canvas graph, node, edge, theme, and UI state

## Development Notes

Design principles in the current app:

- token-driven light and dark theme
- reusable node shell for consistent visuals
- reusable sidebar header and field sections
- dock-first interaction instead of large permanent tool panels
- horizontal node summaries with badge segments

## Build Status

The canvas feature set is functional, but the repository may still contain unrelated TypeScript issues in other dashboard or support areas. If `npm run build` fails, those failures may be outside the canvas strategy builder scope.

## Next Ideas

Potential next improvements:

1. add persistence for canvas strategies and comments
2. refine execution nodes with richer configuration per asset set
3. connect strategies to backend runners or smart-contract execution
4. add testing around node configuration and summary rendering
5. expand portfolio and risk logic beyond MVP fields
