import DashboardLayout from '../dashboard-layout'
import SettingsContent from './settings-content'

export default function DashboardSettingsPage() {
  return (
    <DashboardLayout activeItem="Settings">
      <SettingsContent />
    </DashboardLayout>
  )
}
