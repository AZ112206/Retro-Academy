import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ElementarySchoolMap from './components/Game World/ElementarySchoolMap.jsx'

// Dev shortcut: /?map renders the school map directly for visual verification.
const showMapOnly = new URLSearchParams(window.location.search).has('map')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {showMapOnly ? <ElementarySchoolMap /> : <App />}
  </StrictMode>,
)
