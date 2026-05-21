import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowCircleDownRight, ArrowCircleUpRight, ArrowsClockwise, ArrowsSplit, CaretDown, ChartPieSlice, ChatCircleDots, ClockCountdown, Coin, Cursor, FlagCheckered, FunnelSimple, Hand, Moon, Path, Percent, Play, ShieldWarning, Sun, TrendDown, TrendUp, Wallet } from '@phosphor-icons/react'
import { executeCanvasZoomAction, setCanvasNodeType, useCanvasNodeType, useCanvasScale, type CanvasTool } from '../../state/canvas-tool-store'
import { toggleCanvasTheme, useCanvasTheme } from '../../state/theme-store'
import * as canvasKeybindings from '../../config/keybinding/canvas-keybindings'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

type CanvasDockProps = {
  activeTool: CanvasTool
  onToolChange: (tool: CanvasTool) => void
}

export default function CanvasDock({ activeTool, onToolChange }: CanvasDockProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasScale = useCanvasScale()
  const activeTheme = useCanvasTheme()
  const activeNodeType = useCanvasNodeType()
  const scaleLabel = useMemo(() => `${Math.round(canvasScale * 100)}%`, [canvasScale])
  const isPointerToolActive = activeTool === 'click' || activeTool === 'hand'
  const activeToolIcon = activeTool === 'hand' ? <Hand size={16} weight="fill" /> : <Cursor size={16} weight="fill" />
  const isNodeToolActive = activeTool === 'node'
  const isFlowNodeType = activeNodeType === 'start' || activeNodeType === 'loop' || activeNodeType === 'end'
  const isLogicNodeType = activeNodeType === 'if' || activeNodeType === 'else' || activeNodeType === 'and' || activeNodeType === 'or' || activeNodeType === 'not' || activeNodeType === 'xor' || activeNodeType === 'intersect' || activeNodeType === 'union' || activeNodeType === 'exclude' || activeNodeType === 'filter' || activeNodeType === 'portfolioCondition'
  const isAssetNodeType = activeNodeType === 'stock' || activeNodeType === 'token' || activeNodeType === 'assetBasket'
  const activeNodeIcon = activeNodeType === 'end' ? <FlagCheckered size={16} weight="fill" /> : activeNodeType === 'loop' ? <ArrowsClockwise size={16} weight="bold" /> : <Play size={16} weight="fill" />
  const logicGlyph = (kind: 'and' | 'or' | 'not' | 'xor' | 'intersect' | 'union' | 'exclude') => (
    <span style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {kind === 'and' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="5" cy="8" r="2" fill="currentColor" />
          <circle cx="11" cy="8" r="2" fill="currentColor" />
          <path d="M7 8H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : kind === 'or' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="5" cy="8" r="2" fill="currentColor" />
          <circle cx="11" cy="8" r="2" fill="currentColor" opacity="0.45" />
        </svg>
      ) : kind === 'not' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5.2 10.8L10.8 5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : kind === 'xor' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="5" cy="8" r="2" fill="currentColor" />
          <circle cx="11" cy="8" r="2" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      ) : kind === 'intersect' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.25" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9.75" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4.9C8.9 5.5 9.5 6.6 9.5 8C9.5 9.4 8.9 10.5 8 11.1C7.1 10.5 6.5 9.4 6.5 8C6.5 6.6 7.1 5.5 8 4.9Z" fill="currentColor" />
        </svg>
      ) : kind === 'union' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.25" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9.75" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5.2 10.8L10.8 5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="11.5" cy="4.5" r="2" fill="var(--canvas-dock-bg)" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      )}
    </span>
  )
  const activeLogicNodeIcon = activeNodeType === 'if' ? <ArrowsSplit size={16} weight="fill" /> : activeNodeType === 'else' ? <Path size={16} weight="fill" /> : activeNodeType === 'and' ? logicGlyph('and') : activeNodeType === 'or' ? logicGlyph('or') : activeNodeType === 'not' ? logicGlyph('not') : activeNodeType === 'xor' ? logicGlyph('xor') : activeNodeType === 'intersect' ? logicGlyph('intersect') : activeNodeType === 'union' ? logicGlyph('union') : activeNodeType === 'exclude' ? logicGlyph('exclude') : activeNodeType === 'portfolioCondition' ? <Wallet size={16} weight="fill" /> : <FunnelSimple size={16} weight="fill" />
  const activeAssetTypeIcon = activeNodeType === 'stock' ? <TrendUp size={16} weight="bold" /> : activeNodeType === 'assetBasket' ? <ChartPieSlice size={16} weight="fill" /> : <Coin size={16} weight="fill" />
  const toolMenuShortcut = canvasKeybindings.canvasDockMenuShortcuts.find((item) => item.menu === 'tool')?.shortcut ?? 'P'
  const nodeMenuShortcut = canvasKeybindings.canvasDockMenuShortcuts.find((item) => item.menu === 'node')?.shortcut ?? 'N'
  const logicMenuShortcut = canvasKeybindings.canvasDockMenuShortcuts.find((item) => item.menu === 'logic')?.shortcut ?? 'G'
  const assetTypeMenuShortcut = canvasKeybindings.canvasDockMenuShortcuts.find((item) => item.menu === 'assetType')?.shortcut ?? 'A'
  const executionMenuShortcut = canvasKeybindings.canvasDockMenuShortcuts.find((item) => item.menu === 'execution')?.shortcut ?? 'E'
  const zoomMenuShortcut = canvasKeybindings.canvasDockMenuShortcuts.find((item) => item.menu === 'zoom')?.shortcut ?? 'Z'
  const isExecutionNodeType = activeNodeType === 'buy' || activeNodeType === 'sell' || activeNodeType === 'rebalance' || activeNodeType === 'allocate' || activeNodeType === 'scaleOut' || activeNodeType === 'takeProfit' || activeNodeType === 'stopLoss' || activeNodeType === 'cooldown' || activeNodeType === 'wait' || activeNodeType === 'pauseTrading' || activeNodeType === 'positionLimit' || activeNodeType === 'positionCountLimit' || activeNodeType === 'exposureLimit' || activeNodeType === 'cashReserve'
  const toolMenuGroups = useMemo(
    () => [
      {
        heading: 'Pointer',
        items: canvasKeybindings.canvasToolMenuItems.map<DropdownMenuItem>((item) => ({
          ...item,
          icon: item.value === 'hand' ? <Hand size={16} weight="fill" /> : <Cursor size={16} weight="fill" />,
          active: activeTool === item.value,
          trailingIcon: activeTool === item.value ? '✓' : undefined,
        })),
      },
    ],
    [activeTool],
  )
  const nodeMenuGroups = useMemo(
    () => [
      {
        heading: 'Flow',
        items: canvasKeybindings.canvasNodeMenuItems.map<DropdownMenuItem>((item) => ({
          ...item,
          icon: item.value === 'loop'
            ? <ArrowsClockwise size={16} weight="bold" />
            : item.value === 'end'
              ? <FlagCheckered size={16} weight="fill" />
              : <Play size={16} weight="fill" />,
          active: activeNodeType === item.value,
          trailingIcon: activeNodeType === item.value ? '✓' : undefined,
        })),
      },
    ],
    [activeNodeType],
  )
  const logicMenuGroups = useMemo(
    () => [
      {
        heading: 'Conditions',
        items: canvasKeybindings.canvasLogicMenuItems.filter((item) => item.value === 'if' || item.value === 'else' || item.value === 'and' || item.value === 'or' || item.value === 'not' || item.value === 'xor' || item.value === 'portfolioCondition').map<DropdownMenuItem>((item) => ({
          ...item,
          icon: item.value === 'if'
            ? <ArrowsSplit size={16} weight="fill" />
            : item.value === 'else'
              ? <Path size={16} weight="fill" />
              : item.value === 'and'
                ? logicGlyph('and')
                  : item.value === 'or'
                  ? logicGlyph('or')
                  : item.value === 'not'
                    ? logicGlyph('not')
                    : item.value === 'xor'
                      ? logicGlyph('xor')
                      : item.value === 'intersect'
                        ? logicGlyph('intersect')
                        : item.value === 'union'
                          ? logicGlyph('union')
                  : item.value === 'exclude'
                            ? logicGlyph('exclude')
                            : item.value === 'portfolioCondition'
                              ? <Wallet size={16} weight="fill" />
                              : <FunnelSimple size={16} weight="fill" />,
          active: activeNodeType === item.value,
          trailingIcon: activeNodeType === item.value ? '✓' : undefined,
        })),
      },
      {
        heading: 'Set Logic',
        items: canvasKeybindings.canvasLogicMenuItems.filter((item) => item.value === 'intersect' || item.value === 'union' || item.value === 'exclude' || item.value === 'filter').map<DropdownMenuItem>((item) => ({
          ...item,
          icon: item.value === 'intersect'
            ? logicGlyph('intersect')
            : item.value === 'union'
              ? logicGlyph('union')
              : item.value === 'exclude'
                ? logicGlyph('exclude')
                : <FunnelSimple size={16} weight="fill" />,
          active: activeNodeType === item.value,
          trailingIcon: activeNodeType === item.value ? '✓' : undefined,
        })),
      },
    ],
    [activeNodeType],
  )
  const executionMenuGroups = useMemo(
    () => [
      {
        heading: 'Actions',
        items: canvasKeybindings.canvasActionMenuItems.map<DropdownMenuItem>((item) => ({
          ...item,
          icon: item.value === 'buy'
            ? <ArrowCircleDownRight size={16} weight="fill" />
            : item.value === 'sell'
              ? <ArrowCircleUpRight size={16} weight="fill" />
              : <ArrowsClockwise size={16} weight="bold" />,
          active: activeNodeType === item.value,
        })),
      },
      {
        heading: 'Portfolio',
        items: canvasKeybindings.canvasPortfolioMenuItems.map<DropdownMenuItem>((item) => ({
          ...item,
          icon: item.value === 'allocate' ? <ChartPieSlice size={16} weight="fill" /> : item.value === 'cashReserve' ? <Wallet size={16} weight="fill" /> : <Percent size={16} weight="bold" />,
          active: activeNodeType === item.value,
        })),
      },
      {
        heading: 'Risk',
        items: canvasKeybindings.canvasRiskMenuItems.filter((item) => item.value === 'takeProfit' || item.value === 'stopLoss' || item.value === 'positionLimit' || item.value === 'exposureLimit').map<DropdownMenuItem>((item) => ({
          ...item,
            icon: item.value === 'takeProfit' ? <TrendUp size={16} weight="bold" /> : item.value === 'stopLoss' ? <TrendDown size={16} weight="bold" /> : item.value === 'cooldown' ? <ArrowsClockwise size={16} weight="bold" /> : item.value === 'wait' ? <ClockCountdown size={16} weight="fill" /> : item.value === 'pauseTrading' ? <ShieldWarning size={16} weight="fill" /> : item.value === 'positionLimit' ? <ShieldWarning size={16} weight="fill" /> : item.value === 'positionCountLimit' ? <Percent size={16} weight="bold" /> : <Percent size={16} weight="bold" />,
            active: activeNodeType === item.value,
          })),
      },
      {
        heading: 'Timing & Limits',
        items: canvasKeybindings.canvasRiskMenuItems.filter((item) => item.value === 'cooldown' || item.value === 'wait' || item.value === 'pauseTrading' || item.value === 'positionCountLimit').map<DropdownMenuItem>((item) => ({
          ...item,
            icon: item.value === 'cooldown' ? <ArrowsClockwise size={16} weight="bold" /> : item.value === 'wait' ? <ClockCountdown size={16} weight="fill" /> : item.value === 'pauseTrading' ? <ShieldWarning size={16} weight="fill" /> : <Percent size={16} weight="bold" />,
            active: activeNodeType === item.value,
          })),
      },
    ],
    [activeNodeType],
  )
  const assetTypeMenuGroups = useMemo(
    () => [
      {
        heading: 'Asset Type',
        items: canvasKeybindings.canvasAssetTypeMenuItems.map<DropdownMenuItem>((item) => ({
          ...item,
          icon: item.value === 'stock' ? <TrendUp size={16} weight="bold" /> : item.value === 'assetBasket' ? <ChartPieSlice size={16} weight="fill" /> : <Coin size={16} weight="fill" />,
          active: activeNodeType === item.value,
        })),
      },
    ],
    [activeNodeType],
  )
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false)
  const [isNodeMenuOpen, setIsNodeMenuOpen] = useState(false)
  const [isLogicMenuOpen, setIsLogicMenuOpen] = useState(false)
  const [isAssetTypeMenuOpen, setIsAssetTypeMenuOpen] = useState(false)
  const [isExecutionMenuOpen, setIsExecutionMenuOpen] = useState(false)
  const [isZoomMenuOpen, setIsZoomMenuOpen] = useState(false)

  const closeAllMenus = () => {
    setIsToolMenuOpen(false)
    setIsNodeMenuOpen(false)
    setIsLogicMenuOpen(false)
    setIsAssetTypeMenuOpen(false)
    setIsExecutionMenuOpen(false)
    setIsZoomMenuOpen(false)
  }

  const toggleMenuByKey = (menu: canvasKeybindings.CanvasDockMenuKey) => {
    const nextOpenState = {
      tool: menu === 'tool' ? !isToolMenuOpen : false,
      node: menu === 'node' ? !isNodeMenuOpen : false,
      logic: menu === 'logic' ? !isLogicMenuOpen : false,
      assetType: menu === 'assetType' ? !isAssetTypeMenuOpen : false,
      execution: menu === 'execution' ? !isExecutionMenuOpen : false,
      zoom: menu === 'zoom' ? !isZoomMenuOpen : false,
    }

    setIsToolMenuOpen(nextOpenState.tool)
    setIsNodeMenuOpen(nextOpenState.node)
    setIsLogicMenuOpen(nextOpenState.logic)
    setIsAssetTypeMenuOpen(nextOpenState.assetType)
    setIsExecutionMenuOpen(nextOpenState.execution)
    setIsZoomMenuOpen(nextOpenState.zoom)
  }

  const handleToolItemClick = (item: DropdownMenuItem) => {
    const nextTool = item.value as CanvasTool | undefined

    if (nextTool === 'click' || nextTool === 'hand') {
      onToolChange(nextTool)
    }

    setIsToolMenuOpen(false)
  }

  const handleZoomItemClick = (item: DropdownMenuItem) => {
    if (item.action) {
      executeCanvasZoomAction(item.action)
    }

    setIsZoomMenuOpen(false)
  }

  const handleNodeItemClick = (item: DropdownMenuItem) => {
    if (item.value === 'start' || item.value === 'loop' || item.value === 'end') {
      setCanvasNodeType(item.value)
      onToolChange('node')
    }

    setIsNodeMenuOpen(false)
  }

  const handleLogicItemClick = (item: DropdownMenuItem) => {
    if (item.value === 'if' || item.value === 'else' || item.value === 'and' || item.value === 'or' || item.value === 'not' || item.value === 'xor' || item.value === 'intersect' || item.value === 'union' || item.value === 'exclude' || item.value === 'filter' || item.value === 'portfolioCondition') {
      setCanvasNodeType(item.value)
      onToolChange('node')
    }

    setIsLogicMenuOpen(false)
  }

  const handleExecutionItemClick = (item: DropdownMenuItem) => {
    if (item.value === 'buy' || item.value === 'sell' || item.value === 'rebalance' || item.value === 'allocate' || item.value === 'scaleOut' || item.value === 'takeProfit' || item.value === 'stopLoss' || item.value === 'cooldown' || item.value === 'wait' || item.value === 'pauseTrading' || item.value === 'positionLimit' || item.value === 'positionCountLimit' || item.value === 'exposureLimit' || item.value === 'cashReserve') {
      setCanvasNodeType(item.value)
      onToolChange('node')
    }

    setIsExecutionMenuOpen(false)
  }

  const handleAssetTypeItemClick = (item: DropdownMenuItem) => {
    if (item.value === 'stock' || item.value === 'token' || item.value === 'assetBasket') {
      setCanvasNodeType(item.value)
      onToolChange('node')
    }

    setIsAssetTypeMenuOpen(false)
  }

  const toggleToolMenu = () => {
    toggleMenuByKey('tool')
  }

  const toggleNodeMenu = () => {
    toggleMenuByKey('node')
  }

  const toggleLogicMenu = () => {
    toggleMenuByKey('logic')
  }

  const toggleAssetTypeMenu = () => {
    toggleMenuByKey('assetType')
  }

  const toggleExecutionMenu = () => {
    toggleMenuByKey('execution')
  }

  const toggleZoomMenu = () => {
    toggleMenuByKey('zoom')
  }

  useEffect(() => {
    if (!isToolMenuOpen && !isNodeMenuOpen && !isLogicMenuOpen && !isAssetTypeMenuOpen && !isExecutionMenuOpen && !isZoomMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      closeAllMenus()
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isAssetTypeMenuOpen, isExecutionMenuOpen, isLogicMenuOpen, isNodeMenuOpen, isToolMenuOpen, isZoomMenuOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const eventTarget = event.target as HTMLElement | null
      const isTypingField =
        eventTarget?.tagName === 'INPUT' ||
        eventTarget?.tagName === 'TEXTAREA' ||
        eventTarget?.isContentEditable === true

      if (isTypingField) {
        return
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return
      }

      const pressedKey = event.key.toUpperCase()

      if (pressedKey === toolMenuShortcut.toUpperCase()) {
        event.preventDefault()
        toggleMenuByKey('tool')
        return
      }

      if (pressedKey === nodeMenuShortcut.toUpperCase()) {
        event.preventDefault()
        toggleMenuByKey('node')
        return
      }

      if (pressedKey === logicMenuShortcut.toUpperCase()) {
        event.preventDefault()
        toggleMenuByKey('logic')
        return
      }

      if (pressedKey === assetTypeMenuShortcut.toUpperCase()) {
        event.preventDefault()
        toggleMenuByKey('assetType')
        return
      }

      if (pressedKey === executionMenuShortcut.toUpperCase()) {
        event.preventDefault()
        toggleMenuByKey('execution')
        return
      }

      if (pressedKey === zoomMenuShortcut.toUpperCase()) {
        event.preventDefault()
        toggleMenuByKey('zoom')
        return
      }

      if (event.key === 'Escape') {
        closeAllMenus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [assetTypeMenuShortcut, executionMenuShortcut, isAssetTypeMenuOpen, isExecutionMenuOpen, isLogicMenuOpen, isNodeMenuOpen, isToolMenuOpen, isZoomMenuOpen, logicMenuShortcut, nodeMenuShortcut, toolMenuShortcut, zoomMenuShortcut])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 18,
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        borderRadius: 14,
        background: 'var(--canvas-dock-bg)',
        border: '1px solid var(--canvas-dock-border)',
        boxShadow: '0 8px 18px var(--canvas-dock-shadow)',
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'relative', zIndex: isToolMenuOpen ? 2 : 1 }}>
        <button
          type="button"
          aria-label="Pointer"
          title={`Pointer (${toolMenuShortcut})`}
          onClick={toggleToolMenu}
          style={{
            minWidth: 52,
            height: 34,
            border: 'none',
            borderRadius: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            background: isPointerToolActive ? 'var(--canvas-dock-active-bg)' : 'transparent',
            color: isPointerToolActive ? 'var(--canvas-dock-active-icon)' : 'var(--canvas-dock-inactive-icon)',
            cursor: 'pointer',
            boxShadow: isPointerToolActive ? '0 3px 10px var(--canvas-dock-shadow)' : 'none',
            transition: 'background-color 140ms ease, color 140ms ease, box-shadow 140ms ease',
            pointerEvents: 'auto',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{activeToolIcon}</span>
            <CaretDown
              size={12}
              weight="regular"
              style={{
                transform: `rotate(${isToolMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
                flex: 'none',
              }}
            />
          </span>
        </button>

        {isToolMenuOpen ? <DropdownMenu open={isToolMenuOpen} groups={toolMenuGroups} position="top" onItemClick={handleToolItemClick} onClose={closeAllMenus} /> : null}
      </div>

      <div style={{ position: 'relative', zIndex: isNodeMenuOpen ? 2 : 1 }}>
        <button
          type="button"
          aria-label="Flow"
          title={`Flow (${nodeMenuShortcut})`}
          onClick={toggleNodeMenu}
          style={{
            minWidth: 52,
            height: 34,
            border: 'none',
            borderRadius: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            background: isNodeToolActive && isFlowNodeType ? 'var(--canvas-dock-active-bg)' : 'transparent',
            color: isNodeToolActive && isFlowNodeType ? 'var(--canvas-dock-active-icon)' : 'var(--canvas-dock-inactive-icon)',
            cursor: 'pointer',
            boxShadow: isNodeToolActive && isFlowNodeType ? '0 3px 10px var(--canvas-dock-shadow)' : 'none',
            transition: 'background-color 140ms ease, color 140ms ease, box-shadow 140ms ease',
            pointerEvents: 'auto',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeNodeIcon}
            </span>
            <CaretDown
              size={12}
              weight="regular"
              style={{
                transform: `rotate(${isNodeMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
                flex: 'none',
              }}
            />
          </span>
        </button>

        {isNodeMenuOpen ? <DropdownMenu open={isNodeMenuOpen} groups={nodeMenuGroups} position="top" onItemClick={handleNodeItemClick} onClose={closeAllMenus} /> : null}
      </div>

      <div style={{ position: 'relative', zIndex: isLogicMenuOpen ? 2 : 1 }}>
        <button
          type="button"
          aria-label="Logic"
          title={`Logic (${logicMenuShortcut})`}
          onClick={toggleLogicMenu}
          style={{
            minWidth: 52,
            height: 34,
            border: 'none',
            borderRadius: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            background: isNodeToolActive && isLogicNodeType ? 'var(--canvas-dock-active-bg)' : 'transparent',
            color: isNodeToolActive && isLogicNodeType ? 'var(--canvas-dock-active-icon)' : 'var(--canvas-dock-inactive-icon)',
            cursor: 'pointer',
            boxShadow: isNodeToolActive && isLogicNodeType ? '0 3px 10px var(--canvas-dock-shadow)' : 'none',
            transition: 'background-color 140ms ease, color 140ms ease, box-shadow 140ms ease',
            pointerEvents: 'auto',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeLogicNodeIcon}
            </span>
            <CaretDown
              size={12}
              weight="regular"
              style={{
                transform: `rotate(${isLogicMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
                flex: 'none',
              }}
            />
          </span>
        </button>

        {isLogicMenuOpen ? <DropdownMenu open={isLogicMenuOpen} groups={logicMenuGroups} position="top" onItemClick={handleLogicItemClick} onClose={closeAllMenus} /> : null}
      </div>

      <div style={{ position: 'relative', zIndex: isAssetTypeMenuOpen ? 2 : 1 }}>
        <button
          type="button"
          aria-label="Asset Type"
          title={`Asset Type (${assetTypeMenuShortcut})`}
          onClick={toggleAssetTypeMenu}
          style={{
            minWidth: 52,
            height: 34,
            border: 'none',
            borderRadius: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            background: isNodeToolActive && isAssetNodeType ? 'var(--canvas-dock-active-bg)' : 'transparent',
            color: isNodeToolActive && isAssetNodeType ? 'var(--canvas-dock-active-icon)' : 'var(--canvas-dock-inactive-icon)',
            cursor: 'pointer',
            boxShadow: isNodeToolActive && isAssetNodeType ? '0 3px 10px var(--canvas-dock-shadow)' : 'none',
            transition: 'background-color 140ms ease, color 140ms ease, box-shadow 140ms ease',
            pointerEvents: 'auto',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeAssetTypeIcon}
            </span>
            <CaretDown
              size={12}
              weight="regular"
              style={{
                transform: `rotate(${isAssetTypeMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
                flex: 'none',
              }}
            />
          </span>
        </button>

        {isAssetTypeMenuOpen ? <DropdownMenu open={isAssetTypeMenuOpen} groups={assetTypeMenuGroups} position="top" onItemClick={handleAssetTypeItemClick} onClose={closeAllMenus} /> : null}
      </div>

      <div style={{ position: 'relative', zIndex: isExecutionMenuOpen ? 2 : 1 }}>
        <button
          type="button"
          aria-label="Execution"
          title={`Execution (${executionMenuShortcut})`}
          onClick={toggleExecutionMenu}
          style={{
            minWidth: 52,
            height: 34,
            border: 'none',
            borderRadius: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            background: isNodeToolActive && isExecutionNodeType ? 'var(--canvas-dock-active-bg)' : 'transparent',
            color: isNodeToolActive && isExecutionNodeType ? 'var(--canvas-dock-active-icon)' : 'var(--canvas-dock-inactive-icon)',
            cursor: 'pointer',
            boxShadow: isNodeToolActive && isExecutionNodeType ? '0 3px 10px var(--canvas-dock-shadow)' : 'none',
            transition: 'background-color 140ms ease, color 140ms ease, box-shadow 140ms ease',
            pointerEvents: 'auto',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeNodeType === 'sell'
                ? <ArrowCircleUpRight size={16} weight="fill" />
                : activeNodeType === 'rebalance'
                  ? <ArrowsClockwise size={16} weight="bold" />
                  : activeNodeType === 'allocate'
                    ? <ChartPieSlice size={16} weight="fill" />
                : activeNodeType === 'scaleOut'
                      ? <Percent size={16} weight="bold" />
                : activeNodeType === 'takeProfit'
                        ? <TrendUp size={16} weight="bold" />
                        : activeNodeType === 'stopLoss'
                          ? <TrendDown size={16} weight="bold" />
                          : activeNodeType === 'cooldown'
                            ? <ArrowsClockwise size={16} weight="bold" />
                            : activeNodeType === 'positionLimit'
                              ? <ShieldWarning size={16} weight="fill" />
                              : activeNodeType === 'exposureLimit'
                                ? <Percent size={16} weight="bold" />
                           : <ArrowCircleDownRight size={16} weight="fill" />}
            </span>
            <CaretDown
              size={12}
              weight="regular"
              style={{
                transform: `rotate(${isExecutionMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
                flex: 'none',
              }}
            />
          </span>
        </button>

        {isExecutionMenuOpen ? <DropdownMenu open={isExecutionMenuOpen} groups={executionMenuGroups} position="top" onItemClick={handleExecutionItemClick} onClose={closeAllMenus} /> : null}
      </div>

      <button
        type="button"
        aria-label="Comment"
        title="Comment (M)"
        onClick={() => onToolChange('comment')}
        style={{
          width: 34,
          height: 34,
          border: 'none',
          borderRadius: 11,
          display: 'grid',
          placeItems: 'center',
          background: activeTool === 'comment' ? 'var(--canvas-dock-active-bg)' : 'transparent',
          color: activeTool === 'comment' ? 'var(--canvas-dock-active-icon)' : 'var(--canvas-dock-inactive-icon)',
          cursor: 'pointer',
          boxShadow: activeTool === 'comment' ? '0 3px 10px var(--canvas-dock-shadow)' : 'none',
          transition: 'background-color 140ms ease, color 140ms ease, box-shadow 140ms ease',
          pointerEvents: 'auto',
        }}
      >
        <ChatCircleDots size={18} weight="fill" />
      </button>

      <div style={{ position: 'relative', zIndex: isZoomMenuOpen ? 2 : 1 }}>
        <button
          type="button"
          aria-label="Zoom"
          title={`Zoom (${zoomMenuShortcut})`}
          onClick={toggleZoomMenu}
          style={{
            minWidth: 60,
            height: 34,
            border: 'none',
            borderRadius: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            background: 'var(--canvas-dock-active-bg)',
            color: 'var(--canvas-dock-active-icon)',
            cursor: 'pointer',
            boxShadow: '0 3px 10px var(--canvas-dock-shadow)',
            transition: 'background-color 140ms ease, color 140ms ease, box-shadow 140ms ease',
            pointerEvents: 'auto',
          }}
          >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {scaleLabel}
            </span>
            <CaretDown
              size={12}
              weight="regular"
              style={{
                transform: `rotate(${isZoomMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
                flex: 'none',
              }}
            />
          </span>
        </button>

        {isZoomMenuOpen ? <DropdownMenu open={isZoomMenuOpen} groups={canvasKeybindings.canvasZoomMenuGroups} position="top" onItemClick={handleZoomItemClick} onClose={closeAllMenus} /> : null}
      </div>

      <button
        type="button"
        aria-label="Theme"
        title={`Toggle Theme (${activeTheme === 'dark' ? 'Dark' : 'Light'}) (T)`}
        onClick={toggleCanvasTheme}
        style={{
          width: 34,
          height: 34,
          border: 'none',
          borderRadius: 11,
          display: 'grid',
          placeItems: 'center',
          background: 'var(--canvas-dock-active-bg)',
          color: 'var(--canvas-dock-active-icon)',
          cursor: 'pointer',
          boxShadow: '0 3px 10px var(--canvas-dock-shadow)',
          transition: 'background-color 140ms ease, color 140ms ease, box-shadow 140ms ease',
          pointerEvents: 'auto',
        }}
      >
        {activeTheme === 'dark' ? <Sun size={18} weight="duotone" /> : <Moon size={18} weight="duotone" />}
      </button>
    </div>
  )
}
