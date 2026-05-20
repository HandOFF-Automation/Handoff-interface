# Handoff Interface

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./src/assets/icon%20with%20text/icon-text-bg-dark.png">
    <img src="./src/assets/icon%20with%20text/icon-text-no-bg.png" alt="Handoff Interface" width="260">
  </picture>
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

| Route | Purpose |
|---|---|
| `/` | Main app entry |
| `/canvas/staging` | Strategy canvas staging workspace |
| `/canvas/:id` | Reserved canvas route pattern |
| `/strategies/staging` | Strategy staging page |
| `/strategies/:id` | Reserved strategy detail route pattern |
| `/dashboard/...` | Dashboard workspace routes |

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

| Dock Menu | Items |
|---|---|
| `Tool` | `Click`, `Hand` |
| `Nodes` | `Start`, `Loop`, `End` |
| `Logic` | `If`, `Else`, `Filter` |
| `Asset Type` | `Stock`, `Token` |
| `Execution` | `Buy`, `Sell`, `Rebalance`, `Allocate`, `Scale Out`, `Take Profit`, `Stop Loss` |
| `Zoom` | zoom controls |

### Execution Dropdown Groups

| Group | Items |
|---|---|
| `Actions` | `Buy`, `Sell`, `Rebalance` |
| `Portfolio` | `Allocate`, `Scale Out` |
| `Risk` | `Take Profit`, `Stop Loss` |

## Canvas Nodes

| Node Name | Group | Function |
|---|---|---|
| `Start` | Flow | Defines how the strategy begins allocating into connected assets. |
| `Loop` | Flow | Defines repeated strategy behavior over time or by trigger. |
| `End` | Flow | Defines completion, exit, or risk-stop conditions for the strategy. |
| `If` | Logic | Compares a metric against a value or another metric. |
| `Else` | Logic | Defines the fallback conditional branch. |
| `Filter` | Logic | Sorts and narrows connected assets before continuing the flow. |
| `Stock` | Asset | Represents a stock asset node used by other nodes. |
| `Token` | Asset | Represents a token or crypto asset node used by other nodes. |
| `Buy` | Execution / Actions | Buys a selected connected asset by percentage or value. |
| `Sell` | Execution / Actions | Sells a selected connected asset by percentage or value. |
| `Rebalance` | Execution / Actions | Rebalances the portfolio toward a mode when a threshold is reached. |
| `Allocate` | Execution / Portfolio | Applies an allocation amount using percentage or value mode. |
| `Scale Out` | Execution / Portfolio | Reduces exposure gradually by percentage. |
| `Take Profit` | Execution / Risk | Triggers profit-taking when an asset crosses a threshold. |
| `Stop Loss` | Execution / Risk | Triggers protection when an asset crosses a loss threshold. |

## Detailed Node Documentation

### 1. Start

| Field | Details |
|---|---|
| Purpose | Defines the initial allocation logic for the strategy. |
| `Equal` | Splits starting allocation equally across connected assets. |
| `Specific Percentage` | Allows manual percentages per connected asset. |
| `Market Cap` | Weights based on market capitalization logic. |
| Typical Use | Begin a strategy with portfolio construction rules. |

### 2. Loop

| Field | Details |
|---|---|
| Purpose | Defines when the strategy should repeat or rebalance again. |
| `Time Interval` | Rebalance every selected interval. |
| `Drift Threshold` | Rebalance when allocation drift reaches a chosen percentage. |
| `On New Deposit` | React when new capital enters the strategy. |
| Sub-options | Interval value and time unit, drift threshold value, deposit timing behavior. |

### 3. End

| Field | Details |
|---|---|
| Purpose | Defines when the flow should stop, exit, or close out. |
| Asset Support | Can monitor connected asset nodes or portfolio-level conditions, depending on mode. |
| `Price Reaches` | Stop when a watched asset reaches a target price. |
| `Portfolio Value` | Stop when total portfolio value reaches a threshold. |
| `Time Based` | Stop after a duration. |
| `Max Drawdown` | Stop when drawdown reaches a threshold. |
| `Daily Loss` | Stop when daily loss reaches a threshold. |
| `Exposure Limit` | Stop when exposure breaches a limit. |
| `Position Concentration` | Stop when a position becomes too concentrated. |
| `Volatility Limit` | Stop when volatility exceeds a threshold. |

### 4. If

| Field | Details |
|---|---|
| Purpose | Adds a conditional decision node to the flow. |
| Metric Options | `Current Price`, `Current Market Cap`, `Volume`, `Simple Moving Average`, `Exponential Moving Average` |
| Comparator Options | `>`, `<`, `>=`, `<=`, `=` |
| Compare Against | `Value`, `Metric` |

### 5. Else

| Field | Details |
|---|---|
| Purpose | Defines the alternate branch after a condition fails or needs fallback handling. |
| Current Behavior | Mirrors the configurable compare structure used by `If`. |
| Comparison Support | Supports metric vs value and metric vs metric comparison. |

### 6. Filter

| Field | Details |
|---|---|
| Purpose | Narrows a set of connected assets before the next step in the flow. |
| Sort Functions | `Current Price`, `Current Market Cap`, `Volume`, `Percent Gain` |
| Ordering | `Top`, `Bottom` |
| Other Inputs | Target asset source and result limit. |

### 7. Stock

| Field | Details |
|---|---|
| Purpose | Represents a stock asset in the graph. |
| Current Examples | `AAPL`, `NVDA`, `MSFT`, `TSLA` |
| Strategy Role | Works as a connected asset source for allocation, filtering, comparisons, and execution nodes. |
| Typical Use | Feed market data into `Start`, `If`, `Filter`, `Buy`, `Sell`, `Take Profit`, or `Stop Loss`. |

### 8. Token

| Field | Details |
|---|---|
| Purpose | Represents a token or crypto asset in the graph. |
| Current Examples | `BTC`, `ETH`, `SOL`, `USDC` |
| Strategy Role | Works as a connected asset source for allocation, filtering, comparisons, and execution nodes. |
| Typical Use | Feed market data into `Start`, `If`, `Filter`, `Buy`, `Sell`, `Take Profit`, or `Stop Loss`. |

### 9. Buy

| Field | Details |
|---|---|
| Purpose | Buys a chosen connected asset. |
| Target Asset | Select a connected asset node. |
| Amount Mode | `Percentage`, `Value` |
| Amount Value | Manual amount entry based on the selected mode. |
| How It Works | Uses the selected asset and amount configuration to represent a buy action in the flow. |
| Typical Use | Enter a position after a filter or condition node decides the asset should be bought. |

### 10. Sell

| Field | Details |
|---|---|
| Purpose | Sells a chosen connected asset. |
| Target Asset | Select a connected asset node. |
| Amount Mode | `Percentage`, `Value` |
| Amount Value | Manual amount entry based on the selected mode. |
| How It Works | Uses the selected asset and amount configuration to represent a sell action in the flow. |
| Typical Use | Reduce or close a position after a logic branch, execution rule, or risk trigger. |

### 11. Rebalance

| Field | Details |
|---|---|
| Purpose | Rebalances the current portfolio state. |
| Mode | `Equal`, `Target` |
| Trigger Threshold | Percentage value that triggers rebalance. |
| How It Works | Waits for portfolio drift or rule conditions, then re-aligns allocation according to the chosen mode. |
| Difference From `Start` | `Start` defines initial allocation, while `Rebalance` adjusts the portfolio after the strategy is already running. |
| Typical Use | Maintain allocation discipline after price changes, deposits, or portfolio drift. |

### 12. Allocate

| Field | Details |
|---|---|
| Purpose | Applies a portfolio allocation amount. |
| Weighting Mode | `Percentage`, `Value` |
| Amount Value | Manual allocation entry based on the selected mode. |
| How It Works | Represents a deliberate allocation step using either a percent-based or value-based amount. |
| Typical Use | Add capital to a portfolio branch or route a defined amount into a chosen strategy path. |

### 13. Scale Out

| Field | Details |
|---|---|
| Purpose | Gradually reduces exposure instead of exiting all at once. |
| Reduce By | Percentage amount used to reduce the position. |
| How It Works | Reduces the active position in smaller staged amounts rather than performing a full exit. |
| Typical Use | Lock in gains or reduce risk progressively while keeping part of the position active. |

### 14. Take Profit

| Field | Details |
|---|---|
| Purpose | Triggers a profit-taking condition. |
| Target Asset | Select a connected asset node. |
| Comparator | `>`, `<`, `>=`, `<=` |
| Threshold Value | Manual threshold value for the trigger. |
| How It Works | Watches the selected asset and triggers a profit-oriented execution decision when the comparator rule is satisfied. |
| Typical Use | Lock in gains after price appreciation or when a target level has been reached. |
| Example | `Take Profit when BTC >= 75000` or `Take Profit when AAPL > 220`. |

### 15. Stop Loss

| Field | Details |
|---|---|
| Purpose | Triggers a downside protection condition. |
| Target Asset | Select a connected asset node. |
| Comparator | `>`, `<`, `>=`, `<=` |
| Threshold Value | Manual threshold value for the trigger. |
| How It Works | Watches the selected asset and triggers a protective execution decision when the comparator rule is satisfied. |
| Typical Use | Limit losses or reduce downside exposure when price moves against the strategy. |
| Example | `Stop Loss when ETH <= 2800` or `Stop Loss when NVDA < 1000`. |

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
