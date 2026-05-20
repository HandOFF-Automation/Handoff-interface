import DashboardLayout from '../dashboard-layout'
import InvestingAccountContent from './investing-account-content'

export default function DashboardInvestingAccountPage() {
  return (
    <DashboardLayout activeItem="Investing Account">
      <InvestingAccountContent />
    </DashboardLayout>
  )
}
