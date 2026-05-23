import { useEffect } from 'react'
import CanvasAiSidebar from '../../../components/canvas/canvas-ai-sidebar'
import CanvasViewport from '../../../components/canvas/canvas-viewport'
import { appLoadingController } from '../../../state/app-loading-store'
import { setCanvasAiSidebarOpen, useCanvasAiSidebarOpen } from '../../../state/canvas-ai-sidebar-store'

export default function CanvasPage() {
  const isAiSidebarOpen = useCanvasAiSidebarOpen()

  useEffect(() => {
    appLoadingController.start('Fetching strategy details', 10)

    const firstStep = window.setTimeout(() => {
      appLoadingController.update(36, 'Loading nodes and edges')
    }, 420)

    const secondStep = window.setTimeout(() => {
      appLoadingController.update(68, 'Resolving model configuration')
    }, 980)

    const finishStep = window.setTimeout(() => {
      appLoadingController.finish()
    }, 1860)

    return () => {
      window.clearTimeout(firstStep)
      window.clearTimeout(secondStep)
      window.clearTimeout(finishStep)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <CanvasViewport />
      </div>

      <CanvasAiSidebar active={isAiSidebarOpen} onClose={() => setCanvasAiSidebarOpen(false)} />
    </div>
  )
}
