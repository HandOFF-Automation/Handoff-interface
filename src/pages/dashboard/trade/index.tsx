import DashboardLayout from '../dashboard-layout'
import TradeContent from './trade-content'

export default function DashboardTradePage() {
  return (
    <DashboardLayout activeItem="Trade">
      <TradeContent />
    </DashboardLayout>
  )
}
