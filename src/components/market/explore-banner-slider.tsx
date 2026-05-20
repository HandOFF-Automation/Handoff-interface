import { useEffect, useState } from 'react'

import DotsPattern from '../background/dots/dots-pattern'
import GridPattern from '../background/grid/grid-pattern'

type ExploreBannerSlide = {
  id: string
  eyebrow: string
  title: string
  description: string
}

type ExploreBannerSliderProps = {
  slides: ExploreBannerSlide[]
}

export function ExploreBannerSlider({ slides }: ExploreBannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => {
        setPreviousIndex(current)
        return (current + 1) % slides.length
      })
    }, 4200)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [slides.length])

  return (
    <div
      style={{
        display: 'grid',
        gap: 12,
      }}
    >
      <div
        style={{
          position: 'relative',
          minHeight: 220,
          borderRadius: 28,
          border: '1px solid var(--canvas-panel-divider)',
          overflow: 'hidden',
          background: 'var(--canvas-dashboard-card-bg)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.95 }}>
          <GridPattern opacity={0.24} offsetX={18} offsetY={12} scale={0.9} />
          <DotsPattern opacity={0.22} offsetX={10} offsetY={16} scale={0.9} />
        </div>

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 18% 22%, rgba(0, 164, 255, 0.16), transparent 26%), radial-gradient(circle at 78% 74%, rgba(0, 164, 255, 0.10), transparent 28%), radial-gradient(circle at center, rgba(0,0,0,0) 40%, var(--canvas-vignette-color) 100%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'grid',
            alignContent: 'center',
            padding: '28px 30px',
            boxSizing: 'border-box',
          }}
        >
          {slides.map((slide, index) => {
            const active = index === activeIndex
            const exiting = index === previousIndex && previousIndex !== activeIndex
            const movingForward = activeIndex >= previousIndex || (previousIndex === slides.length - 1 && activeIndex === 0)

            return (
              <div
                key={slide.id}
                style={{
                  gridArea: '1 / 1',
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateX(0)' : exiting ? `translateX(${movingForward ? '-32px' : '32px'})` : `translateX(${movingForward ? '32px' : '-32px'})`,
                  transition: 'opacity 340ms ease, transform 340ms ease',
                  pointerEvents: active ? 'auto' : 'none',
                  display: 'grid',
                  gap: 14,
                  alignContent: 'center',
                }}
              >
                <div style={{ color: 'var(--canvas-accent)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{slide.eyebrow}</div>
                <div style={{ color: 'var(--canvas-text-primary)', fontSize: 34, fontWeight: 700, lineHeight: 1.05, maxWidth: 640 }}>{slide.title}</div>
                <div style={{ color: 'var(--canvas-text-secondary)', fontSize: 13, fontWeight: 500, lineHeight: 1.7, maxWidth: 620 }}>{slide.description}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {slides.map((slide, index) => {
          const active = index === activeIndex

          return (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to banner ${index + 1}`}
              onClick={() => {
                setPreviousIndex(activeIndex)
                setActiveIndex(index)
              }}
              style={{
                width: active ? 28 : 8,
                height: 8,
                borderRadius: 999,
                border: 'none',
                background: active ? 'var(--canvas-accent)' : 'var(--canvas-panel-divider)',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 240ms ease, background-color 240ms ease, transform 240ms ease',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export type { ExploreBannerSlide }
