import BrandBadge from '../brand/brand-badge'
import CanvasDebugPanel from './canvas-debug-panel'
import CanvasDock from './canvas-dock'
import HelpFaq from '../help/help-faq'
import HelpKeybindings from '../help/help-keybindings'
import DockLoadingShell from '../loading/dock-loading-shell'
import ProfileAvatar from '../profile/profile-avatar'
import { useAppLoading } from '../../state/app-loading-store'
import { useCanvasTool, setCanvasTool } from '../../state/canvas-tool-store'

export default function DockApp() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const isCanvasRoute = pathname === '/canvas/staging' || /^\/canvas\/[^/]+$/.test(pathname)
  const activeTool = useCanvasTool()
  const { isLoading } = useAppLoading()

  if (!isCanvasRoute) {
    return null
  }

  if (isLoading) {
    return <DockLoadingShell />
  }

  return (
    <>
      <CanvasDebugPanel />
      <BrandBadge />
      <ProfileAvatar />
      <HelpFaq />
      <HelpKeybindings />
      <CanvasDock activeTool={activeTool} onToolChange={setCanvasTool} />
    </>
  )
}
