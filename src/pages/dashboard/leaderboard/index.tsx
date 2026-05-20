import DashboardLayout from '../dashboard-layout'
import LeaderboardContent from './leaderboard-content'

export default function DashboardLeaderboardPage() {
  return (
    <DashboardLayout activeItem="Leaderboard" disableContentScroll>
      <LeaderboardContent />
    </DashboardLayout>
  )
}
