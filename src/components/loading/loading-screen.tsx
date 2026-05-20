import { useEffect, useState } from 'react'
import handoffIcon from '../../assets/icon/icon handoff.png'
import { useAppLoading } from '../../state/app-loading-store'

export default function LoadingScreen() {
  const { isLoading, progress, stage } = useAppLoading()
  const [isVisible, setIsVisible] = useState(isLoading)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true)
      setIsFadingOut(false)
      return
    }

    setIsFadingOut(true)

    const timeoutId = window.setTimeout(() => {
      setIsVisible(false)
      setIsFadingOut(false)
    }, 420)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isLoading])

  if (!isVisible) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--canvas-bg)',
        transition: 'opacity 420ms ease',
      }}
    >
      <div
        style={{
          width: 'min(420px, calc(100vw - 48px))',
          display: 'grid',
          justifyItems: 'center',
          gap: 18,
          opacity: isFadingOut ? 0 : 1,
          transition: 'opacity 420ms ease',
        }}
      >
        <img
          src={handoffIcon}
          alt="Handoff"
          style={{
            width: 84,
            height: 84,
            objectFit: 'contain',
            display: 'block',
            animation: 'loadingLogoDrift 4.8s ease-in-out infinite',
            transformOrigin: 'center center',
          }}
        />

        <div
          style={{
            width: '100%',
            height: 10,
            borderRadius: 999,
            background: 'var(--canvas-surface-muted)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              borderRadius: 999,
              background: 'var(--canvas-accent)',
              transition: 'width 320ms ease',
            }}
          />
        </div>

        <div
          style={{
            color: 'var(--canvas-text-secondary)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          {stage}
        </div>
      </div>
    </div>
  )
}
