# Handoff Interface

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
- grouped logic and execution menus in the dock

## Tech Stack

- React
- TypeScript
- Vite
- Phosphor Icons

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

## Environment Notes

This project uses env-backed configuration for some external assets and integrations.

For example:

- `VITE_LOGO_DEV_PUBLISHABLE_KEY`

Do not place secret frontend keys in client-side env files.

## Main Routes

| No | Route | Purpose |
|---|---|---|
| 1 | `/` | Main app entry |
| 2 | `/canvas/staging` | Strategy canvas staging workspace |
| 3 | `/canvas/:id` | Reserved canvas route pattern |
| 4 | `/strategies/staging` | Strategy staging page |
| 5 | `/strategies/:id` | Reserved strategy detail route pattern |
| 6 | `/dashboard/...` | Dashboard workspace routes |

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

## Dock Menus

The dock is the main control surface for editing on canvas.

| No | Dock Menu | Items |
|---|---|---|
| 1 | `Tool` | `Click`, `Hand` |
| 2 | `Nodes` | `Start`, `Loop`, `End` |
| 3 | `Logic` | `If`, `Else`, `Filter` |
| 4 | `Asset Type` | `Stock`, `Token` |
| 5 | `Execution` | `Buy`, `Sell`, `Rebalance`, `Allocate`, `Scale Out`, `Take Profit`, `Stop Loss` |
| 6 | `Zoom` | zoom controls |

### Execution Dropdown Groups

| No | Group | Items |
|---|---|---|
| 1 | `Actions` | `Buy`, `Sell`, `Rebalance` |
| 2 | `Portfolio` | `Allocate`, `Scale Out` |
| 3 | `Risk` | `Take Profit`, `Stop Loss` |

## Canvas Nodes

| No | Node Name | Group | Function |
|---|---|---|---|
| 1 | `Start` | Flow | Defines how the strategy begins allocating into connected assets. |
| 2 | `Loop` | Flow | Defines repeated strategy behavior over time or by trigger. |
| 3 | `End` | Flow | Defines completion, exit, or risk-stop conditions for the strategy. |
| 4 | `If` | Logic | Compares a metric against a value or another metric. |
| 5 | `Else` | Logic | Defines the fallback conditional branch. |
| 6 | `Filter` | Logic | Sorts and narrows connected assets before continuing the flow. |
| 7 | `Stock` | Asset | Represents a stock asset node used by other nodes. |
| 8 | `Token` | Asset | Represents a token or crypto asset node used by other nodes. |
| 9 | `Buy` | Execution / Actions | Buys a selected connected asset by percentage or value. |
| 10 | `Sell` | Execution / Actions | Sells a selected connected asset by percentage or value. |
| 11 | `Rebalance` | Execution / Actions | Rebalances the portfolio toward a mode when a threshold is reached. |
| 12 | `Allocate` | Execution / Portfolio | Applies an allocation amount using percentage or value mode. |
| 13 | `Scale Out` | Execution / Portfolio | Reduces exposure gradually by percentage. |
| 14 | `Take Profit` | Execution / Risk | Triggers profit-taking when an asset crosses a threshold. |
| 15 | `Stop Loss` | Execution / Risk | Triggers protection when an asset crosses a loss threshold. |

## Detailed Node Documentation

### 1. Start

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Defines the initial allocation logic for the strategy. |
| 2 | Input Flow | Usually sits near the beginning of the graph and connects to one or more asset nodes. |
| 3 | `Equal` | Splits starting allocation equally across connected assets. |
| 4 | `Specific Percentage` | Allows manual percentages per connected asset. |
| 5 | `Market Cap` | Weights based on market capitalization logic. |
| 6 | Output Behavior | Passes the selected starting allocation logic into the next connected step in the strategy. |
| 7 | Typical Use | Begin a strategy with portfolio construction rules. |
| 8 | Example | Start with `Specific Percentage` across BTC 50%, ETH 30%, SOL 20%. |

### 2. Loop

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Defines when the strategy should repeat or rebalance again. |
| 2 | Input Flow | Usually appears after `Start` or after execution logic that needs to run again over time. |
| 3 | `Time Interval` | Rebalance every selected interval. |
| 4 | `Drift Threshold` | Rebalance when allocation drift reaches a chosen percentage. |
| 5 | `On New Deposit` | React when new capital enters the strategy. |
| 6 | Sub-options | Interval value and time unit, drift threshold value, deposit timing behavior. |
| 7 | Output Behavior | Re-runs or continues the strategy path when the chosen trigger condition is met. |
| 8 | Example | Rebalance every 7 days or when portfolio drift reaches 5%. |

### 3. End

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Defines when the flow should stop, exit, or close out. |
| 2 | Asset Support | Can monitor connected asset nodes or portfolio-level conditions, depending on mode. |
| 3 | `Price Reaches` | Stop when a watched asset reaches a target price. |
| 4 | `Portfolio Value` | Stop when total portfolio value reaches a threshold. |
| 5 | `Time Based` | Stop after a duration. |
| 6 | `Max Drawdown` | Stop when drawdown reaches a threshold. |
| 7 | `Daily Loss` | Stop when daily loss reaches a threshold. |
| 8 | `Exposure Limit` | Stop when exposure breaches a limit. |
| 9 | `Position Concentration` | Stop when a position becomes too concentrated. |
| 10 | `Volatility Limit` | Stop when volatility exceeds a threshold. |
| 11 | Output Behavior | Terminates the current strategy path when the selected exit condition is satisfied. |
| 12 | Example | End when BTC reaches $80,000 or when max drawdown exceeds 12%. |

### 4. If

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Adds a conditional decision node to the flow. |
| 2 | Input Flow | Usually receives a connected asset and passes the graph into different branches depending on the result. |
| 3 | Metric Options | `Current Price`, `Current Market Cap`, `Volume`, `Simple Moving Average`, `Exponential Moving Average` |
| 4 | Comparator Options | `>`, `<`, `>=`, `<=`, `=` |
| 5 | Compare Against | `Value`, `Metric` |
| 6 | Output Behavior | Routes the strategy into a condition-based path when the comparison returns true. |
| 7 | Example | If `Current Price of BTC >= 70000`, continue into a `Take Profit` branch. |

### 5. Else

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Defines the alternate branch after a condition fails or needs fallback handling. |
| 2 | Input Flow | Usually pairs with a prior condition-driven branch. |
| 3 | Current Behavior | Mirrors the configurable compare structure used by `If`. |
| 4 | Comparison Support | Supports metric vs value and metric vs metric comparison. |
| 5 | Output Behavior | Continues the fallback route when the primary branch does not satisfy its intended condition. |
| 6 | Example | Else send the flow into `Scale Out` or `Stop Loss` handling. |

### 6. Filter

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Narrows a set of connected assets before the next step in the flow. |
| 2 | Input Flow | Usually receives one or more connected assets that need to be ranked or filtered. |
| 3 | Sort Functions | `Current Price`, `Current Market Cap`, `Volume`, `Percent Gain` |
| 4 | Ordering | `Top`, `Bottom` |
| 5 | Other Inputs | Target asset source and result limit. |
| 6 | Output Behavior | Passes only the filtered subset into the next node in the flow. |
| 7 | Example | Filter the top 3 assets by `Percent Gain` before triggering `Buy`. |

### 7. Stock

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Represents a stock asset in the graph. |
| 2 | Current Examples | `AAPL`, `NVDA`, `MSFT`, `TSLA` |
| 3 | Strategy Role | Works as a connected asset source for allocation, filtering, comparisons, and execution nodes. |
| 4 | Data Usage | Can supply symbol-specific context for logic, execution, and risk nodes. |
| 5 | Typical Use | Feed market data into `Start`, `If`, `Filter`, `Buy`, `Sell`, `Take Profit`, or `Stop Loss`. |
| 6 | Example | Use `AAPL` as the watched asset for a momentum or breakout rule. |

### 8. Token

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Represents a token or crypto asset in the graph. |
| 2 | Current Examples | `BTC`, `ETH`, `SOL`, `USDC` |
| 3 | Strategy Role | Works as a connected asset source for allocation, filtering, comparisons, and execution nodes. |
| 4 | Data Usage | Can supply symbol-specific context for logic, execution, and risk nodes. |
| 5 | Typical Use | Feed market data into `Start`, `If`, `Filter`, `Buy`, `Sell`, `Take Profit`, or `Stop Loss`. |
| 6 | Example | Use `BTC` or `ETH` as the base asset in a rebalancing or breakout strategy. |

### 9. Buy

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Buys a chosen connected asset. |
| 2 | Target Asset | Select a connected asset node. |
| 3 | Amount Mode | `Percentage`, `Value` |
| 4 | Amount Value | Manual amount entry based on the selected mode. |
| 5 | How It Works | Uses the selected asset and amount configuration to represent a buy action in the flow. |
| 6 | Input Flow | Typically follows a selection or decision node such as `Filter` or `If`. |
| 7 | Output Behavior | Represents entering or increasing a position in the chosen asset. |
| 8 | Typical Use | Enter a position after a filter or condition node decides the asset should be bought. |
| 9 | Example | Buy BTC by `Value` using `$1000`, or buy SOL by `Percentage` using `20%`. |

### 10. Sell

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Sells a chosen connected asset. |
| 2 | Target Asset | Select a connected asset node. |
| 3 | Amount Mode | `Percentage`, `Value` |
| 4 | Amount Value | Manual amount entry based on the selected mode. |
| 5 | How It Works | Uses the selected asset and amount configuration to represent a sell action in the flow. |
| 6 | Input Flow | Typically follows a branch, rebalance decision, or risk-management condition. |
| 7 | Output Behavior | Represents reducing or closing a position in the chosen asset. |
| 8 | Typical Use | Reduce or close a position after a logic branch, execution rule, or risk trigger. |
| 9 | Example | Sell ETH by `Percentage` using `50%`, or sell NVDA by `Value` using `$500`. |

### 11. Rebalance

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Rebalances the current portfolio state. |
| 2 | Mode | `Equal`, `Target` |
| 3 | Trigger Threshold | Percentage value that triggers rebalance. |
| 4 | How It Works | Waits for portfolio drift or rule conditions, then re-aligns allocation according to the chosen mode. |
| 5 | Difference From `Start` | `Start` defines initial allocation, while `Rebalance` adjusts the portfolio after the strategy is already running. |
| 6 | Input Flow | Usually appears after initial allocation and before later execution or monitoring steps. |
| 7 | Output Behavior | Applies maintenance logic to bring positions back toward the intended portfolio shape. |
| 8 | Typical Use | Maintain allocation discipline after price changes, deposits, or portfolio drift. |
| 9 | Example | Rebalance to `Equal` when drift reaches `5%`. |

### 12. Allocate

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Applies a portfolio allocation amount. |
| 2 | Weighting Mode | `Percentage`, `Value` |
| 3 | Amount Value | Manual allocation entry based on the selected mode. |
| 4 | How It Works | Represents a deliberate allocation step using either a percent-based or value-based amount. |
| 5 | Input Flow | Usually follows a branch that decides where capital should be routed. |
| 6 | Output Behavior | Pushes a defined allocation amount into the next connected portfolio path. |
| 7 | Typical Use | Add capital to a portfolio branch or route a defined amount into a chosen strategy path. |
| 8 | Example | Allocate `25%` of the portfolio or allocate `$2000` to a selected branch. |

### 13. Scale Out

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Gradually reduces exposure instead of exiting all at once. |
| 2 | Reduce By | Percentage amount used to reduce the position. |
| 3 | How It Works | Reduces the active position in smaller staged amounts rather than performing a full exit. |
| 4 | Input Flow | Usually appears after a bullish branch, target hit, or staged de-risking plan. |
| 5 | Output Behavior | Cuts position size partially while leaving the strategy active for the remaining balance. |
| 6 | Typical Use | Lock in gains or reduce risk progressively while keeping part of the position active. |
| 7 | Example | Scale out by `20%` after the asset reaches an intermediate target. |

### 14. Take Profit

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Triggers a profit-taking condition. |
| 2 | Target Asset | Select a connected asset node. |
| 3 | Comparator | `>`, `<`, `>=`, `<=` |
| 4 | Threshold Value | Manual threshold value for the trigger. |
| 5 | How It Works | Watches the selected asset and triggers a profit-oriented execution decision when the comparator rule is satisfied. |
| 6 | Input Flow | Usually follows a position-entry path and sits in the risk or exit branch of the graph. |
| 7 | Output Behavior | Signals that the strategy should capture gains once the defined upside condition is reached. |
| 8 | Typical Use | Lock in gains after price appreciation or when a target level has been reached. |
| 9 | Example | `Take Profit when BTC >= 75000` or `Take Profit when AAPL > 220`. |

### 15. Stop Loss

| No | Field | Details |
|---|---|---|
| 1 | Purpose | Triggers a downside protection condition. |
| 2 | Target Asset | Select a connected asset node. |
| 3 | Comparator | `>`, `<`, `>=`, `<=` |
| 4 | Threshold Value | Manual threshold value for the trigger. |
| 5 | How It Works | Watches the selected asset and triggers a protective execution decision when the comparator rule is satisfied. |
| 6 | Input Flow | Usually follows a position-entry path and sits in the protection or defensive branch of the graph. |
| 7 | Output Behavior | Signals that the strategy should reduce or close exposure when downside conditions are met. |
| 8 | Typical Use | Limit losses or reduce downside exposure when price moves against the strategy. |
| 9 | Example | `Stop Loss when ETH <= 2800` or `Stop Loss when NVDA < 1000`. |

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
