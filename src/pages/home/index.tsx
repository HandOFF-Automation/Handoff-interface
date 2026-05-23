import { Wallet } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import brandImageLight from '../../assets/icon with text/icon-text-no-bg-dark-txt.png'
import brandImageDark from '../../assets/icon with text/icon-text-no-bg.png'
import { homeContent, homeStats } from './home-content'
import { navigateTo } from '../../state/location-store'

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

import { useCanvasTheme } from '../../state/theme-store'
import { Wormhole } from '../../components/Landing effect/Wormhole/wormhole'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import CryptoLogo from '../../components/icon/crypto-logo'

export default function HomePage() {
  const activeTheme = useCanvasTheme()

  // Wallet connection state (dummy)
  const [walletState, setWalletState] = useState<'idle' | 'connecting' | 'connected'>('idle')
  const hasNavigatedRef = useRef(false)
  
  // Animation progress — driven by wallet connection, NOT scroll
  const scrollProgress = useMotionValue(0)

  // Navigate to dashboard when the wormhole transition completes
  useEffect(() => {
    const unsubscribe = scrollProgress.on('change', (latest) => {
      if (latest > 0.97 && walletState === 'connected' && !hasNavigatedRef.current) {
        hasNavigatedRef.current = true
        // Small delay so the white flash fully covers before routing
        setTimeout(() => {
          navigateTo('/dashboard')
        }, 400)
      }
    })
    return () => unsubscribe()
  }, [scrollProgress, walletState])

  // Dynamic transforms based on progress
  const opacity = useTransform(scrollProgress, [0, 0.75, 1], [0.9, 0.75, 0], { clamp: true })
  const blurValue = useTransform(scrollProgress, [0, 0.45, 0.8, 1], [0, 1.5, 6, 12], { clamp: true })
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`)

  const navY = useTransform(scrollProgress, [0, 0.25], [0, -100], { clamp: true })
  const navOpacity = useTransform(scrollProgress, [0, 0.2], [1, 0], { clamp: true })

  const statsY = useTransform(scrollProgress, [0, 0.25], [0, 100], { clamp: true })
  const statsOpacity = useTransform(scrollProgress, [0, 0.2], [1, 0], { clamp: true })

  // White exit flash
  const exitFlashOpacity = useTransform(scrollProgress, [0.82, 0.96, 1], [0, 0.95, 1], { clamp: true })
  const solidWhiteOpacity = useTransform(scrollProgress, [0.96, 1], [0, 1], { clamp: true })

  // Center hero text animations
  const contentOpacity = useTransform(scrollProgress, [0, 0.18], [1, 0], { clamp: true })
  const contentY = useTransform(scrollProgress, [0, 0.22], [0, -70], { clamp: true })
  const contentScale = useTransform(scrollProgress, [0, 0.22], [1, 0.92], { clamp: true })

  // Connect wallet handler (dummy)
  const handleConnectWallet = () => {
    if (walletState !== 'idle') return

    setWalletState('connecting')

    // Simulate wallet popup delay, then trigger the dive
    setTimeout(() => {
      setWalletState('connected')
      // Drive the wormhole animation from 0 → 1 with custom duration and smooth easing
      animate(scrollProgress, 1, {
        duration: 2.2,
        ease: 'easeInOut'
      })
    }, 1200)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--canvas-bg)',
        color: 'var(--canvas-text-primary)',
        userSelect: 'none',
      }}
    >
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        {/* 1. Full-screen 3D WebGL Wormhole Background */}
        <motion.div
          style={{
            opacity,
            filter,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Ambient Glow Background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'var(--wormhole-ambient-glow)',
            }}
          />
          {/* Wormhole Animation Centerpiece */}
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wormhole progress={scrollProgress} theme={activeTheme} />
          </div>
        </motion.div>

        {/* 3. White Exit Radial Gradient Flash Overlay */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #ffffff 60%, rgba(255, 255, 255, 0) 100%)',
            opacity: exitFlashOpacity,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        {/* Solid white overlay at the very bottom */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#ffffff',
            opacity: solidWhiteOpacity,
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        {/* 4. Sticky Layout Content (Nav, Center, Stats) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 4,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              display: 'grid',
              gridTemplateRows: 'auto 1fr auto',
              padding: '18px 18px 28px',
              boxSizing: 'border-box',
              pointerEvents: 'none',
            }}
          >
            <motion.nav
              style={{
                y: navY,
                opacity: navOpacity,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                pointerEvents: 'auto',
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
                  src={activeTheme === 'light' ? brandImageLight : brandImageDark}
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
                onClick={handleConnectWallet}
                disabled={walletState !== 'idle'}
                style={{
                  height: 46,
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderRadius: 999,
                  border: '1px solid var(--canvas-accent)',
                  background: walletState === 'connecting'
                    ? 'var(--canvas-surface-strong)'
                    : 'var(--canvas-accent)',
                  boxShadow: '0 10px 22px var(--canvas-dock-shadow)',
                  color: walletState === 'connecting'
                    ? 'var(--canvas-text-secondary)'
                    : '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: walletState === 'idle' ? 'pointer' : 'default',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 13,
                  fontWeight: 700,
                  transition: 'all 300ms ease',
                  opacity: walletState === 'connected' ? 0.6 : 1,
                }}
              >
                <Wallet size={17} weight="duotone" />
                <span>
                  {walletState === 'idle' && homeContent.connectWalletLabel}
                  {walletState === 'connecting' && 'Connecting...'}
                  {walletState === 'connected' && 'Connected'}
                </span>
              </button>
            </motion.nav>

            <main
              style={{
                minHeight: 0,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '40px',
                pointerEvents: 'none',
              }}
            >
              <motion.div
                style={{
                  opacity: contentOpacity,
                  y: contentY,
                  scale: contentScale,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  pointerEvents: 'auto',
                  maxWidth: 680,
                  padding: '0 24px',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: '1px solid var(--canvas-dock-border)',
                    background: activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                    marginBottom: 18,
                  }}
                >
                  <CryptoLogo symbol="MNT" size={14} style={{ borderRadius: '999px' }} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--canvas-text-secondary)',
                      fontFamily: 'var(--canvas-font-mono, monospace)',
                    }}
                  >
                    Mantle Ecosystem
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: 'clamp(36px, 5.2vw, 68px)',
                    fontWeight: 200,
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    color: 'var(--canvas-text-primary)',
                    margin: '0 0 20px 0',
                    fontFamily: 'var(--canvas-font-sans, sans-serif)',
                    textShadow: activeTheme === 'dark' ? '0 0 45px rgba(128,204,255,0.18)' : 'none',
                  }}
                >
                  onchain strategy <span style={{ fontWeight: 600, color: 'var(--primary)' }}>orchestrator</span>
                </h1>

                <p
                  style={{
                    fontSize: 'clamp(14px, 1.6vw, 16px)',
                    lineHeight: 1.65,
                    color: 'var(--canvas-text-secondary)',
                    margin: 0,
                    fontWeight: 400,
                    fontFamily: 'var(--canvas-font-sans, sans-serif)',
                  }}
                >
                  A visual, frontend-first canvas for designing logic, configuring node behavior, and composing automated portfolio workflows.
                </p>
              </motion.div>
            </main>

            <motion.section
              aria-label="Statistics"
              style={{
                y: statsY,
                opacity: statsOpacity,
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: 56,
                pointerEvents: 'auto',
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

              <div
                style={{
                  color: 'var(--canvas-text-tertiary)',
                  fontFamily: 'var(--canvas-font-sans)',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Connect wallet to enter
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  )
}
