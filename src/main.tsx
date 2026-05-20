import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import DockApp from './components/canvas/dock-app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const dockRoot = document.getElementById('dock-root')

if (dockRoot) {
  createRoot(dockRoot).render(
    <StrictMode>
      <DockApp />
    </StrictMode>,
  )
}
