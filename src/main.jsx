import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { FarmProvider } from './src/context/FarmContext.jsx'
import './src/styles/index.css'

// عنصر وسيط لحل مشكلة Double Render
const StrictModeSafeApp = () => {
  const [isMounted, setIsMounted] = React.useState(false)
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
      // إخفاء شاشة التحميل
      const loadingScreen = document.getElementById('app-loading')
      if (loadingScreen) {
        loadingScreen.style.opacity = '0'
        setTimeout(() => {
          loadingScreen.style.display = 'none'
        }, 300)
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (!isMounted) {
    return null // أو شاشة تحميل داخلية
  }
  
  return (
    <FarmProvider>
      <App />
    </FarmProvider>
  )
}

// تهيئة التطبيق
const rootElement = document.getElementById('root')
if (rootElement) {
  const root = createRoot(rootElement)
  
  root.render(
    <React.StrictMode>
      <StrictModeSafeApp />
    </React.StrictMode>
  )
    } 
