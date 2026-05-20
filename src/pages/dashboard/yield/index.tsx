import DashboardLayout from '../dashboard-layout'
import StocksContent from './stocks-content'

export default function DashboardYieldPage() {
  return (
    <DashboardLayout activeItem="Stocks">
      <StocksContent />
    </DashboardLayout>
  )
}
