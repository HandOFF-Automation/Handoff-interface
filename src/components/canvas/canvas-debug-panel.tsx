import { Bug, CaretDown, WarningCircle, X } from '@phosphor-icons/react'
import { useMemo, useRef, useState } from 'react'

import DropdownMenu from '../dropdown/dropdown-menu'
import { getCanvasConnectionValidation } from '../../config/canvas-connection'
import { useCanvasEdges } from '../../state/canvas-edge-store'
import { useCanvasNodes } from '../../state/canvas-node-store'

type DebugView = 'errors' | 'warnings'

type DebugRow = {
  id: string
  level: DebugView
  title: string
  detail: string
  nodeLabel?: string
}

function getNodeLabel(node: { type: string; assetSymbol?: string; assetName?: string; assetBasketName?: string }) {
  return node.assetSymbol ?? node.assetName ?? node.assetBasketName ?? node.type
}

function getDebugToggleButtonStyle(active: boolean, tone: 'danger' | 'warning'): React.CSSProperties {
  const activeColor = tone === 'danger' ? 'var(--canvas-danger)' : 'var(--canvas-warning)'

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 34,
    padding: '0 12px',
    borderRadius: 999,
    border: `1px solid ${active ? activeColor : 'var(--canvas-panel-divider)'}`,
    background: active ? `color-mix(in srgb, ${activeColor} 14%, var(--canvas-surface-soft))` : 'var(--canvas-surface-soft)',
    color: active ? activeColor : 'var(--canvas-text-secondary)',
    boxShadow: active ? `inset 0 0 0 1px color-mix(in srgb, ${activeColor} 18%, transparent)` : 'none',
    fontFamily: 'var(--canvas-font-sans)',
    fontSize: 11,
    fontWeight: 800,
    cursor: 'pointer',
  }
}

export default function CanvasDebugPanel() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const { nodes } = useCanvasNodes()
  const { edges } = useCanvasEdges()
  const [open, setOpen] = useState(false)
  const [activeView, setActiveView] = useState<DebugView>('errors')

  const debugRows = useMemo<DebugRow[]>(() => {
    const rows: DebugRow[] = [
      {
        id: 'dummy-error-1',
        level: 'errors',
        title: 'If branch exceeds connector limit',
        detail: 'The selected If node is trying to open more than one connection from the right branch connector.',
      },
      {
        id: 'dummy-error-2',
        level: 'errors',
        title: 'Start connected to invalid target',
        detail: 'Start should connect into an asset, asset basket, filter, or portfolio condition stage first.',
      },
      {
        id: 'dummy-warning-1',
        level: 'warnings',
        title: 'Else branch has no forward path',
        detail: 'This fallback branch is placed on the canvas but does not continue into execution or evaluation yet.',
      },
      {
        id: 'dummy-warning-2',
        level: 'warnings',
        title: 'End node is isolated',
        detail: 'An End node exists on the canvas without any incoming branch attached to it yet.',
      },
    ]

    edges.forEach((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.fromNodeId)
      const targetNode = nodes.find((node) => node.id === edge.toNodeId)
      const validation = getCanvasConnectionValidation(sourceNode, targetNode, {
        sourceSide: edge.fromSide,
        targetSide: edge.toSide,
        edges: edges.filter((candidate) => candidate.id !== edge.id),
      })

      if (!validation.valid) {
        rows.push({
          id: `edge-error-${edge.id}`,
          level: 'errors',
          title: `${sourceNode ? getNodeLabel(sourceNode) : 'Missing source'} -> ${targetNode ? getNodeLabel(targetNode) : 'Missing target'}`,
          detail: validation.reason ?? 'Connection failed validation.',
        })
      }
    })

    nodes.forEach((node) => {
      const connectedIncoming = edges.filter((edge) => edge.toNodeId === node.id).length
      const connectedOutgoing = edges.filter((edge) => edge.fromNodeId === node.id).length

      if ((node.type === 'start' || node.type === 'if' || node.type === 'else') && connectedOutgoing === 0) {
        rows.push({
          id: `warning-outgoing-${node.id}`,
          level: 'warnings',
          title: `${getNodeLabel(node)} has no outgoing path`,
          detail: 'This branch node is not connected forward yet.',
          nodeLabel: getNodeLabel(node),
        })
      }

      if ((node.type === 'if' || node.type === 'else' || node.type === 'end') && connectedIncoming === 0) {
        rows.push({
          id: `warning-incoming-${node.id}`,
          level: 'warnings',
          title: `${getNodeLabel(node)} has no incoming path`,
          detail: 'This node is configured on the canvas but not reached by any branch yet.',
          nodeLabel: getNodeLabel(node),
        })
      }
    })

    return rows
  }, [edges, nodes])

  const errorCount = debugRows.filter((row) => row.level === 'errors').length
  const warningCount = debugRows.filter((row) => row.level === 'warnings').length

  const filteredRows = useMemo(() => {
    return debugRows.filter((row) => {
      return row.level === activeView
    })
  }, [activeView, debugRows])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: 18,
        bottom: 18,
        pointerEvents: 'auto',
        zIndex: 12,
      }}
    >
      <div style={{ position: 'relative' }}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((current) => !current)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            minHeight: 42,
            padding: '0 14px',
            borderRadius: 999,
            border: '1px solid var(--canvas-dock-border)',
            background: 'var(--canvas-surface-strong)',
            boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
            color: 'var(--canvas-text-primary)',
            fontFamily: 'var(--canvas-font-sans)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Bug size={16} weight="duotone" /></span>
          <span>Debug</span>
          {errorCount > 0 ? (
            <span
              style={{
                minWidth: 18,
                height: 18,
                padding: '0 5px',
                borderRadius: 999,
                background: 'var(--canvas-danger)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {errorCount}
            </span>
          ) : null}
          <CaretDown size={14} weight="bold" />
        </button>

        <DropdownMenu
          open={open}
          groups={[]}
          position="top"
          anchorRef={triggerRef}
          boundaryRef={containerRef}
          portalToBody
          onClose={() => setOpen(false)}
          header={(
            <div style={{ display: 'grid', gap: 10, minWidth: 380, maxWidth: 420 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ color: 'var(--canvas-text-primary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 13, fontWeight: 800 }}>Debug Panel</div>
                  <div style={{ color: 'var(--canvas-text-secondary)', fontFamily: 'var(--canvas-font-sans)', fontSize: 11, fontWeight: 500 }}>Inspect current canvas validation issues and warnings.</div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--canvas-text-secondary)', fontSize: 11, fontWeight: 700 }}><Bug size={12} weight="duotone" />{errorCount}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--canvas-text-secondary)', fontSize: 11, fontWeight: 700 }}><WarningCircle size={12} weight="duotone" />{warningCount}</span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close debug panel"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      border: '1px solid var(--canvas-panel-divider)',
                      background: 'var(--canvas-surface-soft)',
                      color: 'var(--canvas-text-secondary)',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setActiveView('errors')}
                  style={getDebugToggleButtonStyle(activeView === 'errors', 'danger')}
                >
                  <Bug size={13} weight="duotone" />
                  <span>{`Errors (${errorCount})`}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('warnings')}
                  style={getDebugToggleButtonStyle(activeView === 'warnings', 'warning')}
                >
                  <WarningCircle size={13} weight="duotone" />
                  <span>{`Warnings (${warningCount})`}</span>
                </button>
              </div>

              <div style={{ borderRadius: 14, border: '1px solid var(--canvas-panel-divider)', overflow: 'hidden', background: 'var(--canvas-surface-soft-strong)', boxShadow: 'var(--canvas-shadow-inset-soft)', maxHeight: 'min(420px, calc(100vh - 160px))' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.9fr)', gap: 0, padding: '10px 12px', borderBottom: '1px solid var(--canvas-panel-divider)', color: 'var(--canvas-text-secondary)', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <span>Heading</span>
                  <span>Detail</span>
                </div>

                <div style={{ display: 'grid', maxHeight: 'min(340px, calc(100vh - 230px))', overflowY: 'auto' }}>
                  {filteredRows.length > 0 ? filteredRows.map((row) => (
                    <div key={row.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.9fr)', gap: 12, padding: '12px 12px', borderBottom: '1px solid var(--canvas-panel-divider)', alignItems: 'start', background: 'transparent' }}>
                      <div style={{ minWidth: 0, display: 'grid', gap: 4 }}>
                        <span style={{ color: row.level === 'errors' ? 'var(--canvas-danger)' : 'var(--canvas-warning)', fontSize: 11, fontWeight: 800, lineHeight: 1.25 }}>{row.title}</span>
                      </div>
                      <div style={{ minWidth: 0, color: 'var(--canvas-text-secondary)', fontSize: 11, fontWeight: 600, lineHeight: 1.4 }}>{row.detail}</div>
                    </div>
                  )) : (
                    <div style={{ padding: '18px 12px', color: 'var(--canvas-text-secondary)', fontSize: 11, fontWeight: 600 }}>
                      No {activeView} found for the current canvas.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          style={{ minWidth: 420, maxWidth: 'min(420px, calc(100vw - 24px))', maxHeight: 'min(520px, calc(100vh - 80px))', overflow: 'hidden' }}
        />
      </div>
    </div>
  )
}
