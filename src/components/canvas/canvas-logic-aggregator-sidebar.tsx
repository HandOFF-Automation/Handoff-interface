import type { CanvasNodeRecord } from '../../state/canvas-node-store'
import CanvasNodeSidebarHeader from './canvas-node-sidebar-header'
import CanvasSidebarFieldSection from './canvas-sidebar-field-section'

type CanvasLogicAggregatorSidebarProps = {
  active: boolean
  node: CanvasNodeRecord | null
  onClose: () => void
}

export default function CanvasLogicAggregatorSidebar({ active, node, onClose }: CanvasLogicAggregatorSidebarProps) {
  const title = node?.type === 'and'
    ? 'All Of Node'
    : node?.type === 'or'
      ? 'Any Of Node'
      : node?.type === 'not'
        ? 'Not Node'
        : node?.type === 'xor'
          ? 'Only One Node'
          : node?.type === 'intersect'
            ? 'Match All Node'
            : node?.type === 'union'
              ? 'Match Any Node'
              : 'Exclude Node'
  const description = node?.type === 'and'
    ? 'Continue only when every connected condition path passes together.'
    : node?.type === 'or'
      ? 'Continue when any connected condition path passes.'
      : node?.type === 'not'
        ? 'Invert one condition result before the flow continues.'
        : node?.type === 'xor'
          ? 'Continue only when exactly one connected condition passes.'
          : node?.type === 'intersect'
            ? 'Keep only assets that appear in every connected filter result.'
            : node?.type === 'union'
              ? 'Keep assets that appear in any connected filter result.'
              : 'Remove assets found in the connected result from the primary set.'
  const badgeLabel = node?.type === 'and'
    ? 'All conditions'
    : node?.type === 'or'
      ? 'Any condition'
      : node?.type === 'not'
        ? 'Invert result'
        : node?.type === 'xor'
          ? 'Exactly one'
          : node?.type === 'intersect'
            ? 'Shared assets'
            : node?.type === 'union'
              ? 'Combined assets'
              : 'Subtract assets'
  const behaviorLines = node?.type === 'and'
    ? [
        'Use All Of after separate If nodes when every signal must agree.',
        'Connect condition outputs into this node, then route one combined result forward.',
        'This is best for confirmation logic such as oversold plus breakout alignment.',
      ]
    : node?.type === 'or'
      ? [
          'Use Any Of after separate If nodes when one signal is enough to continue.',
          'Connect alternative condition outputs into this node, then route one combined result forward.',
          'This is best for fallback entry or defensive exits triggered by multiple signals.',
        ]
      : node?.type === 'not'
        ? [
            'Use Not to flip a condition result before routing downstream.',
            'This is useful when a flow should continue only when a signal does not happen.',
            'Keep Not close to the condition it inverts so the logic stays readable.',
          ]
        : node?.type === 'xor'
          ? [
              'Use Only One when exactly one connected condition should pass.',
              'This helps when multiple signals are mutually exclusive and should not overlap.',
              'Avoid using this for broad confirmations because it is intentionally strict.',
            ]
          : node?.type === 'intersect'
            ? [
                'Use Match All after multiple Filter nodes to keep only shared assets.',
                'This node works on asset sets, not boolean condition results.',
                'It is useful for narrowing a universe with multiple screening stages.',
              ]
            : node?.type === 'union'
              ? [
                  'Use Match Any after multiple Filter nodes to combine matching assets.',
                  'This node works on asset sets, not boolean condition results.',
                  'It is useful when several filter paths may produce acceptable candidates.',
                ]
              : [
                  'Use Exclude to remove one filtered asset set from another.',
                  'This node works on asset sets, not boolean condition results.',
                  'It is useful for blacklist-style or remove-overlap screening flows.',
                ]

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
        title={title}
        description={description}
        helpTitle={title}
        helpBody={description}
        closeLabel={`Close ${title.toLowerCase()} sidebar`}
        onClose={onClose}
      />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CanvasSidebarFieldSection title="Logic Role" description={node?.type === 'intersect' || node?.type === 'union' || node?.type === 'exclude' ? 'This node combines or subtracts asset sets before the next screening or evaluation step.' : 'This node combines condition outputs into one downstream decision path.'}>
          <div
            style={{
              borderRadius: 16,
              border: '1px solid var(--canvas-panel-divider)',
              background: 'var(--canvas-surface-soft)',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <span
              style={{
                minHeight: 24,
                padding: '0 8px',
                borderRadius: 999,
                border: '1px solid var(--canvas-panel-divider)',
                background: 'var(--canvas-surface)',
                color: 'var(--canvas-text-secondary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 11,
                fontWeight: 700,
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                flex: 'none',
              }}
            >
              {badgeLabel}
            </span>
            <span
              style={{
                color: 'var(--canvas-text-primary)',
                fontFamily: 'var(--canvas-font-sans)',
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.5,
                display: 'block',
                maxWidth: '100%',
              }}
            >
              {description}
            </span>
          </div>
        </CanvasSidebarFieldSection>

        <CanvasSidebarFieldSection title="Behavior" description={node?.type === 'intersect' || node?.type === 'union' || node?.type === 'exclude' ? 'Use this node to shape asset universes between filter stages.' : 'Use this node to bridge multiple condition outputs into one cleaner execution path.'} showDivider={false}>
          <div
            style={{
              borderRadius: 16,
              border: '1px solid var(--canvas-panel-divider)',
              background: 'var(--canvas-surface-soft)',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {behaviorLines.map((item) => (
              <span
                key={item}
                style={{
                  color: 'var(--canvas-text-secondary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 11,
                  lineHeight: 1.5,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </CanvasSidebarFieldSection>
      </div>
    </aside>
  )
}
