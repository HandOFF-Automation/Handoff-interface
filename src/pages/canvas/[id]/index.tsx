import { useEffect } from 'react'
import CanvasViewport from '../../../components/canvas/canvas-viewport'
import { appLoadingController } from '../../../state/app-loading-store'

export default function CanvasPage() {
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
    </div>
  )
}
