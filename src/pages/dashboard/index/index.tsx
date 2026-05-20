import DashboardLayout from '../dashboard-layout'
import StrategiesContent from './strategies-content'

export default function DashboardPage() {
  return (
    <DashboardLayout activeItem="Strategies" showPortfolioAction>
      <StrategiesContent />
    </DashboardLayout>
  )
}
