import DashboardLayout from '../dashboard-layout'
import ExploreContent from './explore-content'

export default function DashboardOverviewPage() {
  return (
    <DashboardLayout activeItem="Explore">
      <ExploreContent />
    </DashboardLayout>
  )
}
