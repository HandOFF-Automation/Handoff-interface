import DashboardLayout from '../dashboard-layout'
import CommunityContent from './community-content'

export default function DashboardKomunitasPage() {
  return (
    <DashboardLayout activeItem="Community" disableContentScroll>
      <CommunityContent />
    </DashboardLayout>
  )
}
