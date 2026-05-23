import { useEffect, useState } from 'react'
import DashboardLayout from '../dashboard-layout'
import StrategiesContent from './strategies-content'
import { DashboardSkeleton } from '../dashboard-skeleton'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading after wormhole transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <DashboardLayout activeItem="Strategies" showPortfolioAction>
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div
          style={{
            animation: 'skeletonFadeIn 500ms ease forwards',
          }}
        >
          <StrategiesContent />
        </div>
      )}
    </DashboardLayout>
  )
}
