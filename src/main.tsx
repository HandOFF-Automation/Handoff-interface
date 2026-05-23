import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import DockApp from './components/canvas/dock-app'
import { TooltipProvider } from './components/ui/tooltip'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>,
)

const dockRoot = document.getElementById('dock-root')

if (dockRoot) {
  createRoot(dockRoot).render(
    <StrictMode>
      <TooltipProvider>
        <DockApp />
      </TooltipProvider>
    </StrictMode>,
  )
}
