"use client"

import * as React from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CarouselApi = UseEmblaCarouselType[1]
type CarouselProps = {
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  orientation: 'horizontal' | 'vertical'
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

function Carousel({ orientation = 'horizontal', setApi, className, children, ...props }: React.ComponentProps<'div'> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel({ axis: orientation === 'horizontal' ? 'x' : 'y' })
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  React.useEffect(() => {
    if (!api) {
      return
    }

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    onSelect()
    api.on('select', onSelect)
    api.on('reInit', onSelect)

    if (setApi) {
      setApi(api)
    }

    return () => {
      api.off('select', onSelect)
    }
  }, [api, setApi])

  return (
    <CarouselContext.Provider value={{ carouselRef, canScrollPrev, canScrollNext, scrollPrev: () => api?.scrollPrev(), scrollNext: () => api?.scrollNext(), orientation }}>
      <div className={cn('relative', className)} data-slot="carousel" {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
      <div className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)} {...props} />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel()
  return <div data-slot="carousel-item" className={cn('min-w-0 shrink-0 grow-0 basis-full', orientation === 'horizontal' ? 'pl-4' : 'pt-4', className)} {...props} />
}

function CarouselPrevious({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()
  return <Button data-slot="carousel-previous" size="icon-sm" variant="outline" className={cn('absolute rounded-full', orientation === 'horizontal' ? 'top-1/2 -left-12 -translate-y-1/2' : '-top-12 left-1/2 -translate-x-1/2 rotate-90', className)} disabled={!canScrollPrev} onClick={scrollPrev} {...props}><ChevronLeftIcon /><span className="sr-only">Previous slide</span></Button>
}

function CarouselNext({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  return <Button data-slot="carousel-next" size="icon-sm" variant="outline" className={cn('absolute rounded-full', orientation === 'horizontal' ? 'top-1/2 -right-12 -translate-y-1/2' : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90', className)} disabled={!canScrollNext} onClick={scrollNext} {...props}><ChevronRightIcon /><span className="sr-only">Next slide</span></Button>
}

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel }
