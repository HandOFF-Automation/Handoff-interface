import {
  ChartPieSlice,
  Crown,
  CurrencyCircleDollar,
  Drop,
  Gear,
  GlobeHemisphereWest,
  PiggyBank,
  Medal,
  ShareNetwork,
  UsersThree,
} from '@phosphor-icons/react'

export type DashboardActiveItem = 'Strategies' | 'Investing Account' | 'Explore' | 'Yield' | 'Community' | 'Leaderboard' | 'Invite Friend' | 'Point' | 'Settings'

export type DashboardSidebarItem = {
  label: DashboardActiveItem
  href: string
  icon: React.ReactNode
}

export type DashboardSidebarGroup = {
  heading: string
  items: DashboardSidebarItem[]
}

export type DashboardHeaderAction = {
  id: string
  label: string
  variant?: 'primary' | 'secondary'
}

export const dashboardSidebarGroups: DashboardSidebarGroup[] = [
  {
    heading: 'Workspace',
    items: [
      { label: 'Strategies', href: '/dashboard', icon: <ChartPieSlice size={20} weight="regular" /> },
      { label: 'Investing Account', href: '/dashboard/investing-account', icon: <PiggyBank size={20} weight="regular" /> },
    ],
  },
  {
    heading: 'Markets',
    items: [
      { label: 'Explore', href: '/dashboard/overview', icon: <GlobeHemisphereWest size={20} weight="regular" /> },
      { label: 'Yield', href: '/dashboard/yield', icon: <Drop size={20} weight="regular" /> },
    ],
  },
  {
    heading: 'Utils',
    items: [
      { label: 'Community', href: '/dashboard/komunitas', icon: <UsersThree size={20} weight="regular" /> },
      { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <Crown size={20} weight="regular" /> },
      { label: 'Invite Friend', href: '/dashboard/invite-friend', icon: <ShareNetwork size={20} weight="regular" /> },
      { label: 'Point', href: '/dashboard/point', icon: <Medal size={20} weight="regular" /> },
    ],
  },
]

export const dashboardBottomItem: DashboardSidebarItem = {
  label: 'Settings',
  href: '/dashboard/settings',
  icon: <Gear size={20} weight="regular" />,
}

export const dashboardProfile = {
  walletAddress: '0x8F21...A91C',
  walletAddressFull: '0x8F21D9A4C6B18E72A91C',
  balanceLabel: 'Balance Mantle: 12.84 MNT',
  disconnectLabel: 'Disconnected',
  strategiesHeaderActions: [
    { id: 'new-strategies', label: 'New Strategies', variant: 'primary' },
  ] satisfies DashboardHeaderAction[],
}
