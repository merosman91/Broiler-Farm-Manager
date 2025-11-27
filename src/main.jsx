import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { FarmProvider } from './context/FarmContext.jsx'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FarmProvider>
      <App />
    </FarmProvider>
  </React.StrictMode>
)
