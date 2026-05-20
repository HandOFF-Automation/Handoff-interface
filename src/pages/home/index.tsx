import { Wallet } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import brandImage from '../../assets/icon with text/icon-text-no-bg-dark-txt.png'
import { homeContent, homeStats } from './home-content'

type AnimatedCurrencyValueProps = {
  baseValue: number
  speed: number
  decimals?: number
}

function AnimatedCurrencyValue({ baseValue, speed, decimals = 0 }: AnimatedCurrencyValueProps) {
  const [value, setValue] = useState(baseValue)

  useEffect(() => {
    let frameId = 0
    let startTime = performance.now()

    const tick = (now: number) => {
      const elapsedSeconds = (now - startTime) / 1000
      const drift = Math.sin(elapsedSeconds * 0.9) * baseValue * 0.012
      const nextValue = baseValue + elapsedSeconds * speed + drift

      setValue(nextValue)
      frameId = window.requestAnimationFrame(tick)
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [baseValue, speed])

  const formattedValue = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value),
    [decimals, value],
  )

  return (
    <span>
      <span style={{ color: 'var(--canvas-text-tertiary)', fontWeight: 100 }}>$</span>
      <span>{formattedValue}</span>
    </span>
  )
}

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--canvas-bg)',
        color: 'var(--canvas-text-primary)',
      }}
    >
      <div
        style={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          padding: '18px 18px 28px',
          boxSizing: 'border-box',
        }}
      >
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div
            style={{
              height: 48,
              paddingLeft: 18,
              paddingRight: 20,
              borderRadius: 999,
              border: '1px solid var(--canvas-dock-border)',
              background: 'var(--canvas-surface-strong)',
              boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={brandImage}
              alt="Handoff"
              style={{
                display: 'block',
                height: 32,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>

          <button
            type="button"
            aria-label="Connect wallet"
            title="Connect wallet"
            style={{
              height: 46,
              paddingLeft: 16,
              paddingRight: 16,
              borderRadius: 999,
              border: '1px solid var(--canvas-accent)',
              background: 'var(--canvas-accent)',
              boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              fontFamily: 'var(--canvas-font-sans)',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <Wallet size={17} weight="duotone" />
            <span>{homeContent.connectWalletLabel}</span>
          </button>
        </nav>

        <main
          style={{
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />

        <section
          aria-label="Statistics"
          style={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: 56,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'end', gap: 56 }}>
            {homeStats.map((item) => (
              <div key={item.label} style={{ display: 'grid', gap: 8, minWidth: 180 }}>
                <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.label}</div>
                <div style={{ color: 'var(--canvas-text-primary)', fontSize: 30, fontWeight: 100, lineHeight: 1 }}>
                  <AnimatedCurrencyValue baseValue={item.baseValue} speed={item.speed} decimals={item.decimals ?? 0} />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--canvas-text-tertiary)',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'var(--canvas-font-sans)',
              fontSize: 18,
              fontWeight: 500,
              transition: 'color 160ms ease',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = 'var(--canvas-text-primary)'
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = 'var(--canvas-text-tertiary)'
            }}
          >
            {homeContent.scrollCtaLabel}
          </button>
        </section>
      </div>
    </div>
  )
}
