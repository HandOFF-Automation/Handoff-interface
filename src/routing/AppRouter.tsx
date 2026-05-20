import CanvasPage from '../pages/canvas/[id]/index'
import DashboardPage from '../pages/dashboard/index/index'
import DashboardInvestingAccountPage from '../pages/dashboard/investing-account/index'
import DashboardInviteFriendPage from '../pages/dashboard/invite-friend/index'
import DashboardKomunitasPage from '../pages/dashboard/komunitas/index'
import DashboardLeaderboardPage from '../pages/dashboard/leaderboard/index'
import DashboardOverviewPage from '../pages/dashboard/overview/index'
import DashboardPointPage from '../pages/dashboard/point/index'
import DashboardSettingsPage from '../pages/dashboard/settings/index'
import DashboardTradePage from '../pages/dashboard/trade/index'
import DashboardYieldPage from '../pages/dashboard/yield/index'
import HomePage from '../pages/home/index'
import StagingCanvasPage from '../pages/canvas/staging/index'
import StrategyDetailPage from '../pages/strategies/[id]/index'
import StrategyStagingPage from '../pages/strategies/staging/index'
import { useLocationPathname } from '../state/location-store'

export default function AppRouter() {
  const pathname = useLocationPathname()
  const isHomePage = pathname === '/'
  const isDashboardPage = pathname === '/dashboard'
  const isDashboardInvestingAccountPage = pathname === '/dashboard/investing-account'
  const isDashboardInviteFriendPage = pathname === '/dashboard/invite-friend'
  const isDashboardOverviewPage = pathname === '/dashboard/overview'
  const isDashboardKomunitasPage = pathname === '/dashboard/komunitas'
  const isDashboardLeaderboardPage = pathname === '/dashboard/leaderboard'
  const isDashboardPointPage = pathname === '/dashboard/point'
  const isDashboardTradePage = pathname === '/dashboard/trade'
  const isDashboardYieldPage = pathname === '/dashboard/yield'
  const isDashboardSettingsPage = pathname === '/dashboard/settings'
  const isStrategyStagingPage = pathname === '/strategies/staging'
  const isStagingCanvasPage = pathname === '/canvas/staging'
  const isCanvasPage = /^\/canvas\/[^/]+\/?$/.test(pathname)
  const isStrategyDetailPage = /^\/strategies\/[^/]+\/?$/.test(pathname) && pathname !== '/strategies/staging'

  if (isHomePage) {
    return <HomePage />
  }

  if (isDashboardPage) {
    return <DashboardPage />
  }

  if (isDashboardInvestingAccountPage) {
    return <DashboardInvestingAccountPage />
  }

  if (isDashboardInviteFriendPage) {
    return <DashboardInviteFriendPage />
  }

  if (isDashboardOverviewPage) {
    return <DashboardOverviewPage />
  }

  if (isDashboardKomunitasPage) {
    return <DashboardKomunitasPage />
  }

  if (isDashboardLeaderboardPage) {
    return <DashboardLeaderboardPage />
  }

  if (isDashboardPointPage) {
    return <DashboardPointPage />
  }

  if (isDashboardTradePage) {
    return <DashboardTradePage />
  }

  if (isDashboardYieldPage) {
    return <DashboardYieldPage />
  }

  if (isDashboardSettingsPage) {
    return <DashboardSettingsPage />
  }

  if (isStrategyStagingPage) {
    return <StrategyStagingPage />
  }

  if (isStagingCanvasPage) {
    return <StagingCanvasPage />
  }

  if (isCanvasPage) {
    return <CanvasPage />
  }

  if (isStrategyDetailPage) {
    return <StrategyDetailPage />
  }

  return null
}
