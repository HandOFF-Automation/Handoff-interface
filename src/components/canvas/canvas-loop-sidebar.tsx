import { ArrowsClockwise, CaretDown, ClockCountdown, FunnelSimple, Wallet } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { CanvasLoopDepositTiming, CanvasLoopPostAction, CanvasLoopRunMode, CanvasLoopType, CanvasNodeRecord, CanvasTimeUnit } from '../../state/canvas-node-store'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import DropdownMenu, { type DropdownMenuItem } from '../dropdown/dropdown-menu'

const loopOptions: Array<{ value: CanvasLoopType; label: string }> = [
  { value: 'timeInterval', label: 'Time Interval' },
  { value: 'driftThreshold', label: 'Drift Threshold' },
  { value: 'onNewDeposit', label: 'On New Deposit' },
]

const loopIconByValue = {
  timeInterval: <ClockCountdown size={16} weight="fill" />,
  driftThreshold: <FunnelSimple size={16} weight="fill" />,
  onNewDeposit: <Wallet size={16} weight="fill" />,
} satisfies Record<CanvasLoopType, React.ReactNode>

const timeUnitOptions: Array<{ value: CanvasTimeUnit; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const depositTimingOptions: Array<{ value: CanvasLoopDepositTiming; label: string }> = [
  { value: 'directly', label: 'Directly' },
  { value: 'onTime', label: 'On Time' },
]

const runModeOptions: Array<{ value: CanvasLoopRunMode; label: string }> = [
  { value: 'always', label: 'Always' },
  { value: 'oncePerPeriod', label: 'Once Per Period' },
]

const postActionOptions: Array<{ value: CanvasLoopPostAction; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'wait', label: 'Wait' },
  { value: 'cooldown', label: 'Cooldown' },
]

type CanvasLoopSidebarProps = {
  active: boolean
  node: CanvasNodeRecord | null
  onClose: () => void
  onLoopTypeChange: (value: CanvasLoopType) => void
  onLoopIntervalValueChange: (value: string) => void
  onLoopTimeUnitChange: (value: CanvasTimeUnit) => void
  onLoopDriftThresholdChange: (value: string) => void
  onLoopDepositTimingChange: (value: CanvasLoopDepositTiming) => void
  onLoopDepositTimeValueChange: (value: string) => void
  onLoopDepositTimeUnitChange: (value: CanvasTimeUnit) => void
  onLoopRunModeChange: (value: CanvasLoopRunMode) => void
  onLoopPostActionChange: (value: CanvasLoopPostAction) => void
  onLoopPostActionValueChange: (value: string) => void
  onLoopPostActionUnitChange: (value: CanvasTimeUnit) => void
}

export default function CanvasLoopSidebar({
  active,
  node,
  onClose,
  onLoopTypeChange,
  onLoopIntervalValueChange,
  onLoopTimeUnitChange,
  onLoopDriftThresholdChange,
  onLoopDepositTimingChange,
  onLoopDepositTimeValueChange,
  onLoopDepositTimeUnitChange,
  onLoopRunModeChange,
  onLoopPostActionChange,
  onLoopPostActionValueChange,
  onLoopPostActionUnitChange,
}: CanvasLoopSidebarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const loopTypeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const timeUnitTriggerRef = useRef<HTMLButtonElement | null>(null)
  const depositTimingTriggerRef = useRef<HTMLButtonElement | null>(null)
  const depositTimeUnitTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isLoopMenuOpen, setIsLoopMenuOpen] = useState(false)
  const [isTimeUnitMenuOpen, setIsTimeUnitMenuOpen] = useState(false)
  const [isDepositTimingMenuOpen, setIsDepositTimingMenuOpen] = useState(false)
  const [isDepositTimeUnitMenuOpen, setIsDepositTimeUnitMenuOpen] = useState(false)
  const [isRunModeOpen, setIsRunModeOpen] = useState(false)
  const [isPostActionOpen, setIsPostActionOpen] = useState(false)
  const [focusedDriftThreshold, setFocusedDriftThreshold] = useState(false)
  const selectedLoopType = loopOptions.find((option) => option.value === node?.loopType) ?? null
  const selectedLoopIcon = selectedLoopType ? loopIconByValue[selectedLoopType.value] : <ArrowsClockwise size={16} weight="bold" />
  const selectedTimeUnit = timeUnitOptions.find((option) => option.value === node?.loopTimeUnit) ?? null
  const selectedDepositTiming = depositTimingOptions.find((option) => option.value === node?.loopDepositTiming) ?? null
  const selectedDepositTimeUnit = timeUnitOptions.find((option) => option.value === node?.loopDepositTimeUnit) ?? null
  const selectedRunMode = runModeOptions.find((option) => option.value === node?.loopRunMode) ?? runModeOptions[0]
  const selectedPostAction = postActionOptions.find((option) => option.value === node?.loopPostAction) ?? postActionOptions[0]
  const loopMenuGroups = useMemo(
    () => [
        {
          items: loopOptions.map<DropdownMenuItem>((option) => ({
            label: option.label,
            value: option.value,
            active: option.value === selectedLoopType?.value,
            trailingIcon: option.value === selectedLoopType?.value ? '✓' : undefined,
          })),
        },
    ],
    [selectedLoopType?.value],
  )
  const timeUnitMenuGroups = useMemo(
    () => [
        {
          items: timeUnitOptions.map<DropdownMenuItem>((option) => ({
            label: option.label,
            value: option.value,
            active: option.value === selectedTimeUnit?.value,
            trailingIcon: option.value === selectedTimeUnit?.value ? '✓' : undefined,
          })),
        },
    ],
    [selectedTimeUnit?.value],
  )
  const depositTimingMenuGroups = useMemo(
    () => [
        {
          items: depositTimingOptions.map<DropdownMenuItem>((option) => ({
            label: option.label,
            value: option.value,
            active: option.value === selectedDepositTiming?.value,
            trailingIcon: option.value === selectedDepositTiming?.value ? '✓' : undefined,
          })),
        },
    ],
    [selectedDepositTiming?.value],
  )
  const depositTimeUnitMenuGroups = useMemo(
    () => [
        {
          items: timeUnitOptions.map<DropdownMenuItem>((option) => ({
            label: option.label,
            value: option.value,
            active: option.value === selectedDepositTimeUnit?.value,
            trailingIcon: option.value === selectedDepositTimeUnit?.value ? '✓' : undefined,
          })),
        },
    ],
    [selectedDepositTimeUnit?.value],
  )
  const runModeMenuGroups = useMemo(
    () => [{ items: runModeOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedRunMode.value, trailingIcon: option.value === selectedRunMode.value ? '✓' : undefined })) }],
    [selectedRunMode.value],
  )
  const postActionMenuGroups = useMemo(
    () => [{ items: postActionOptions.map<DropdownMenuItem>((option) => ({ label: option.label, value: option.value, active: option.value === selectedPostAction.value, trailingIcon: option.value === selectedPostAction.value ? '✓' : undefined })) }],
    [selectedPostAction.value],
  )
  const closeAllMenus = () => {
    setIsLoopMenuOpen(false)
    setIsTimeUnitMenuOpen(false)
    setIsDepositTimingMenuOpen(false)
    setIsDepositTimeUnitMenuOpen(false)
    setIsRunModeOpen(false)
    setIsPostActionOpen(false)
  }

  const toggleExclusiveMenu = (target: 'loopType' | 'postActionUnit' | 'depositTiming' | 'depositTimeUnit' | 'runMode' | 'postAction' | 'loopTimeUnit') => {
    const nextOpen = target === 'loopType'
      ? !isLoopMenuOpen
      : target === 'postActionUnit' || target === 'loopTimeUnit'
        ? !isTimeUnitMenuOpen
        : target === 'depositTiming'
          ? !isDepositTimingMenuOpen
          : target === 'depositTimeUnit'
            ? !isDepositTimeUnitMenuOpen
            : target === 'runMode'
              ? !isRunModeOpen
              : !isPostActionOpen
    closeAllMenus()

    if (!nextOpen) {
      return
    }

    if (target === 'loopType') {
      setIsLoopMenuOpen(true)
      return
    }

    if (target === 'postActionUnit' || target === 'loopTimeUnit') {
      setIsTimeUnitMenuOpen(true)
      return
    }

    if (target === 'depositTiming') {
      setIsDepositTimingMenuOpen(true)
      return
    }

    if (target === 'depositTimeUnit') {
      setIsDepositTimeUnitMenuOpen(true)
      return
    }

    if (target === 'runMode') {
      setIsRunModeOpen(true)
      return
    }

    setIsPostActionOpen(true)
  }

  useEffect(() => {
    if (!active) {
      setIsLoopMenuOpen(false)
      setIsTimeUnitMenuOpen(false)
      setIsDepositTimingMenuOpen(false)
      setIsDepositTimeUnitMenuOpen(false)
      setIsRunModeOpen(false)
      setIsPostActionOpen(false)
      setFocusedDriftThreshold(false)
    }
  }, [active])

  useEffect(() => {
    if (!isLoopMenuOpen && !isTimeUnitMenuOpen && !isDepositTimingMenuOpen && !isDepositTimeUnitMenuOpen && !isRunModeOpen && !isPostActionOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return
      }

      setIsLoopMenuOpen(false)
      setIsTimeUnitMenuOpen(false)
      setIsDepositTimingMenuOpen(false)
      setIsDepositTimeUnitMenuOpen(false)
      setIsRunModeOpen(false)
      setIsPostActionOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isDepositTimeUnitMenuOpen, isDepositTimingMenuOpen, isLoopMenuOpen, isTimeUnitMenuOpen, isRunModeOpen, isPostActionOpen])

  return (
    <aside
      aria-hidden={!active}
      style={{
        position: 'absolute',
        top: 72,
        left: 18,
        width: 280,
        minHeight: 188,
        maxHeight: 'calc(100vh - 164px)',
        borderRadius: 20,
        border: '1px solid var(--canvas-panel-divider)',
        background: 'color-mix(in srgb, var(--canvas-surface) 92%, transparent)',
        boxShadow: '0 16px 40px var(--canvas-shadow-soft)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: active ? 'auto' : 'none',
        opacity: active ? 1 : 0,
        transform: active ? 'translateX(0)' : 'translateX(-16px)',
        transition: 'opacity 180ms ease, transform 180ms ease',
        zIndex: 3,
      }}
    >
      <CanvasNodeSidebarHeader
        title="Loop Node"
        description="Defines how and when the strategy should re-evaluate after the current branch continues."
        helpTitle="Loop Node"
        helpBody="The Loop node controls when the strategy should revisit the next cycle after the current path continues. Use it for time-based re-evaluation, drift-based rebalancing, or reacting to new deposits that should restart the flow."
        closeLabel="Close loop sidebar"
        onClose={onClose}
      />

      <div ref={containerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Set Loop Type" description="Choose how the strategy should re-enter evaluation after a branch finishes its current step.">
        <div style={{ position: 'relative' }}>
          <button
            ref={loopTypeTriggerRef}
            type="button"
            onClick={() => toggleExclusiveMenu('loopType')}
            style={{
              width: '100%',
              minHeight: 54,
              borderRadius: 16,
              border: '1px solid var(--canvas-panel-divider)',
              background: 'var(--canvas-surface-soft)',
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '999px',
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'var(--canvas-dashboard-card-bg)',
                  color: 'var(--canvas-accent)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                {selectedLoopIcon}
              </span>

              <span
                style={{
                  color: 'var(--canvas-text-primary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 170,
                }}
              >
                {selectedLoopType?.label ?? 'Set Loop Type'}
              </span>
            </span>

            <CaretDown
              size={14}
              weight="bold"
              style={{
                color: 'var(--canvas-text-secondary)',
                flex: 'none',
                transform: `rotate(${isLoopMenuOpen ? '180deg' : '0deg'})`,
                transition: 'transform 160ms ease',
              }}
            />
          </button>

          {isLoopMenuOpen ? (
            <DropdownMenu
              open={isLoopMenuOpen}
              anchorRef={loopTypeTriggerRef}
              boundaryRef={containerRef}
              groups={loopMenuGroups}
              position="bottom"
              portalToBody
              onItemClick={(item) => {
                if (item.value === 'timeInterval' || item.value === 'driftThreshold' || item.value === 'onNewDeposit') {
                  onLoopTypeChange(item.value)
                }

                setIsLoopMenuOpen(false)
              }}
            />
          ) : null}
        </div>
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Run mode" description="Choose whether this loop should run every time or only once per period.">
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => toggleExclusiveMenu('runMode')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}>
              <span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{selectedRunMode.label}</span>
              <CaretDown size={14} weight="bold" style={{ color: 'var(--canvas-text-secondary)', flex: 'none', transform: `rotate(${isRunModeOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
            </button>
            {isRunModeOpen ? <DropdownMenu open={isRunModeOpen} boundaryRef={containerRef} groups={runModeMenuGroups} position="bottom" portalToBody onItemClick={(item) => { if (item.value === 'always' || item.value === 'oncePerPeriod') { onLoopRunModeChange(item.value) } setIsRunModeOpen(false) }} /> : null}
          </div>
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="After branch action" description="Choose whether the loop should wait or cool down before the next re-check.">
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => toggleExclusiveMenu('postAction')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}>
              <span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{selectedPostAction.label}</span>
              <CaretDown size={14} weight="bold" style={{ color: 'var(--canvas-text-secondary)', flex: 'none', transform: `rotate(${isPostActionOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
            </button>
            {isPostActionOpen ? <DropdownMenu open={isPostActionOpen} boundaryRef={containerRef} groups={postActionMenuGroups} position="bottom" portalToBody onItemClick={(item) => { if (item.value === 'none' || item.value === 'wait' || item.value === 'cooldown') { onLoopPostActionChange(item.value) } setIsPostActionOpen(false) }} /> : null}
          </div>
        </CanvasSidebarFieldSection>

        {selectedPostAction.value !== 'none' ? (
          <CanvasSidebarFieldSection title="Delay or cooldown" description="Enter how long this branch should wait before re-checking again.">
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center' }}>
                <input type="text" inputMode="numeric" value={node?.loopPostActionValue ?? ''} onChange={(event) => onLoopPostActionValueChange(event.target.value.replace(/[^0-9]/g, ''))} placeholder="1" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700, padding: 0 }} />
              </div>
              <div style={{ position: 'relative', width: 110 }}>
                <button type="button" onClick={() => toggleExclusiveMenu('postActionUnit')} style={{ width: '100%', minHeight: 54, borderRadius: 16, border: '1px solid var(--canvas-panel-divider)', background: 'var(--canvas-surface-soft)', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}>
                  <span style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{node?.loopPostActionUnit ? node.loopPostActionUnit.charAt(0).toUpperCase() + node.loopPostActionUnit.slice(1) : 'Day'}</span>
                  <CaretDown size={14} weight="bold" style={{ color: 'var(--canvas-text-secondary)', flex: 'none', transform: `rotate(${isTimeUnitMenuOpen ? '180deg' : '0deg'})`, transition: 'transform 160ms ease' }} />
                </button>
                {isTimeUnitMenuOpen ? <DropdownMenu open={isTimeUnitMenuOpen} anchorRef={timeUnitTriggerRef} boundaryRef={containerRef} groups={timeUnitMenuGroups} position="bottom" portalToBody onItemClick={(item) => { if (item.value === 'day' || item.value === 'week' || item.value === 'month') { onLoopPostActionUnitChange(item.value) } setIsTimeUnitMenuOpen(false) }} /> : null}
              </div>
            </div>
          </CanvasSidebarFieldSection>
        ) : null}

        {selectedLoopType?.value === 'timeInterval' ? (
          <CanvasSidebarFieldSection title="Interval" description="Set how often the strategy should revisit the flow on a repeating schedule." showDivider={false}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div
                style={{
                  flex: 1,
                  minHeight: 54,
                  borderRadius: 16,
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'var(--canvas-surface-soft)',
                  padding: '0 14px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={node?.loopIntervalValue ?? ''}
                  onChange={(event) => {
                    const sanitizedValue = event.target.value.replace(/[^0-9]/g, '')
                    onLoopIntervalValueChange(sanitizedValue)
                  }}
                  placeholder="0"
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'var(--canvas-text-primary)',
                    fontFamily: 'var(--canvas-font-sans)',
                    fontSize: 13,
                    fontWeight: 700,
                    padding: 0,
                  }}
                />
              </div>

              <div style={{ position: 'relative', width: 110 }}>
                  <button
                    ref={timeUnitTriggerRef}
                    type="button"
                    onClick={() => toggleExclusiveMenu('loopTimeUnit')}
                  style={{
                    width: '100%',
                    minHeight: 54,
                    borderRadius: 16,
                    border: '1px solid var(--canvas-panel-divider)',
                    background: 'var(--canvas-surface-soft)',
                    padding: '0 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--canvas-text-primary)',
                      fontFamily: 'var(--canvas-font-sans)',
                      fontSize: 13,
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {selectedTimeUnit?.label ?? 'Unit'}
                  </span>

                  <CaretDown
                    size={14}
                    weight="bold"
                    style={{
                      color: 'var(--canvas-text-secondary)',
                      flex: 'none',
                      transform: `rotate(${isTimeUnitMenuOpen ? '180deg' : '0deg'})`,
                      transition: 'transform 160ms ease',
                    }}
                  />
                </button>

                {isTimeUnitMenuOpen ? (
                  <DropdownMenu
                    open={isTimeUnitMenuOpen}
                    anchorRef={timeUnitTriggerRef}
                    boundaryRef={containerRef}
                    groups={timeUnitMenuGroups}
                    position="bottom"
                    portalToBody
                    onItemClick={(item) => {
                      if (item.value === 'day' || item.value === 'week' || item.value === 'month') {
                        onLoopTimeUnitChange(item.value)
                      }

                      setIsTimeUnitMenuOpen(false)
                    }}
                  />
                ) : null}
              </div>
            </div>
          </CanvasSidebarFieldSection>
        ) : null}

        {selectedLoopType?.value === 'driftThreshold' ? (
          <CanvasSidebarFieldSection
            title="Drift Threshold"
            description="Enter the percentage drift that should trigger a fresh evaluation of the allocation branch."
            showDivider={false}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span
                style={{
                  color: 'var(--canvas-text-secondary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                Threshold
              </span>

              <label
                style={{
                  minHeight: 34,
                  padding: '10px 10px',
                  borderRadius: 999,
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'var(--canvas-surface-soft)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  width: 'fit-content',
                  cursor: focusedDriftThreshold ? 'text' : 'pointer',
                }}
              >
                <input
                  type="text"
                  inputMode="decimal"
                  value={node?.loopDriftThreshold ?? ''}
                  onFocus={() => setFocusedDriftThreshold(true)}
                  onBlur={() => setFocusedDriftThreshold(false)}
                  onChange={(event) => {
                    const sanitizedValue = event.target.value.replace(/[^0-9.]/g, '')
                    onLoopDriftThresholdChange(sanitizedValue)
                  }}
                  placeholder="0"
                  style={{
                    width: 44,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'var(--canvas-text-primary)',
                    fontFamily: 'var(--canvas-font-sans)',
                    fontSize: 13,
                    fontWeight: 700,
                    textAlign: 'right',
                    padding: 0,
                    cursor: focusedDriftThreshold ? 'text' : 'pointer',
                  }}
                />
                <span
                  style={{
                    color: 'var(--canvas-text-secondary)',
                    fontFamily: 'var(--canvas-font-sans)',
                    fontSize: 13,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  %
                </span>
              </label>
            </div>
          </CanvasSidebarFieldSection>
        ) : null}

        {selectedLoopType?.value === 'onNewDeposit' ? (
          <CanvasSidebarFieldSection title="Deposit Timing" description="Choose when the strategy should restart its next branch evaluation after a new deposit enters the flow." showDivider={selectedDepositTiming?.value !== 'onTime'}>
            <div style={{ position: 'relative' }}>
              <button
                ref={depositTimingTriggerRef}
                type="button"
                onClick={() => toggleExclusiveMenu('depositTiming')}
                style={{
                  width: '100%',
                  minHeight: 54,
                  borderRadius: 16,
                  border: '1px solid var(--canvas-panel-divider)',
                  background: 'var(--canvas-surface-soft)',
                  padding: '0 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    color: 'var(--canvas-text-primary)',
                    fontFamily: 'var(--canvas-font-sans)',
                    fontSize: 13,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {selectedDepositTiming?.label ?? 'Select timing'}
                </span>

                <CaretDown
                  size={14}
                  weight="bold"
                  style={{
                    color: 'var(--canvas-text-secondary)',
                    flex: 'none',
                    transform: `rotate(${isDepositTimingMenuOpen ? '180deg' : '0deg'})`,
                    transition: 'transform 160ms ease',
                  }}
                />
              </button>

              {isDepositTimingMenuOpen ? (
                <DropdownMenu
                  open={isDepositTimingMenuOpen}
                  anchorRef={depositTimingTriggerRef}
                  boundaryRef={containerRef}
                  groups={depositTimingMenuGroups}
                  position="bottom"
                  portalToBody
                  onItemClick={(item) => {
                    if (item.value === 'directly' || item.value === 'onTime') {
                      onLoopDepositTimingChange(item.value)
                    }

                    setIsDepositTimingMenuOpen(false)
                  }}
                />
              ) : null}
            </div>

            {selectedDepositTiming?.value === 'onTime' ? (
              <CanvasSidebarFieldSection
                title="Delay"
                description="Choose how long the strategy should wait after a new deposit before re-entering the flow."
                showDivider={false}
              >
                <div style={{ display: 'flex', gap: 10 }}>
                  <div
                    style={{
                      flex: 1,
                      minHeight: 54,
                      borderRadius: 16,
                      border: '1px solid var(--canvas-panel-divider)',
                      background: 'var(--canvas-surface-soft)',
                      padding: '0 14px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      value={node?.loopDepositTimeValue ?? ''}
                      onChange={(event) => {
                        const sanitizedValue = event.target.value.replace(/[^0-9]/g, '')
                        onLoopDepositTimeValueChange(sanitizedValue)
                      }}
                      placeholder="0"
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        color: 'var(--canvas-text-primary)',
                        fontFamily: 'var(--canvas-font-sans)',
                        fontSize: 13,
                        fontWeight: 700,
                        padding: 0,
                      }}
                    />
                  </div>

                  <div style={{ position: 'relative', width: 110 }}>
                    <button
                      ref={depositTimeUnitTriggerRef}
                      type="button"
                      onClick={() => toggleExclusiveMenu('depositTimeUnit')}
                      style={{
                        width: '100%',
                        minHeight: 54,
                        borderRadius: 16,
                        border: '1px solid var(--canvas-panel-divider)',
                        background: 'var(--canvas-surface-soft)',
                        padding: '0 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--canvas-text-primary)',
                          fontFamily: 'var(--canvas-font-sans)',
                          fontSize: 13,
                          fontWeight: 700,
                          lineHeight: 1.2,
                        }}
                      >
                        {selectedDepositTimeUnit?.label ?? 'Unit'}
                      </span>

                      <CaretDown
                        size={14}
                        weight="bold"
                        style={{
                          color: 'var(--canvas-text-secondary)',
                          flex: 'none',
                          transform: `rotate(${isDepositTimeUnitMenuOpen ? '180deg' : '0deg'})`,
                          transition: 'transform 160ms ease',
                        }}
                      />
                    </button>

                    {isDepositTimeUnitMenuOpen ? (
                      <DropdownMenu
                        open={isDepositTimeUnitMenuOpen}
                        anchorRef={depositTimeUnitTriggerRef}
                        boundaryRef={containerRef}
                        groups={depositTimeUnitMenuGroups}
                        position="bottom"
                        portalToBody
                        onItemClick={(item) => {
                          if (item.value === 'day' || item.value === 'week' || item.value === 'month') {
                            onLoopDepositTimeUnitChange(item.value)
                          }

                          setIsDepositTimeUnitMenuOpen(false)
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </CanvasSidebarFieldSection>
            ) : null}
          </CanvasSidebarFieldSection>
        ) : null}
      </div>

    </aside>
  )
}
