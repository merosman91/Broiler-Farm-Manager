import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { FarmProvider } from './context/FarmContext.jsx'
import './styles/index.css'

// إخفاء شاشة التحميل عند تهيئة React
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById('app-loading')
  if (loadingScreen) {
    loadingScreen.style.opacity = '0'
    setTimeout(() => {
      loadingScreen.style.display = 'none'
    }, 300)
  }
}

// تأخير بسيط لضمان تحميل كل شيء
const initApp = () => {
  const rootElement = document.getElementById('root')
  
  if (!rootElement) {
    console.error('عنصر #root غير موجود!')
    return
  }

  try {
    const root = createRoot(rootElement)
    
    // عرض التطبيق بدون StrictMode للتجربة
    root.render(
      <FarmProvider>
        <App />
      </FarmProvider>
    )
    
    // إخفاء شاشة التحميل بعد 500ms
    setTimeout(hideLoadingScreen, 500)
    
  } catch (error) {
    console.error('خطأ في تحميل التطبيق:', error)
    hideLoadingScreen()
    
    // عرض رسالة خطأ
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #d32f2f;">
        <h2 style="color: #f59e0b;">⚠️ حدث خطأ في التطبيق</h2>
        <p>${error.message}</p>
        <button onclick="window.location.reload()" 
          style="padding: 10px 25px; background: #f59e0b; color: white; 
                 border: none; border-radius: 8px; margin-top: 20px;
                 font-weight: bold; cursor: pointer;">
          إعادة تحميل الصفحة
        </button>
      </div>
    `
  }
}

// انتظر حتى تحميل DOM بالكامل
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  // إذا كان DOM محملاً بالفعل
  setTimeout(initApp, 100)
        }
