import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CategoryProvider from './context/CategoryProvider'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CategoryProvider>
    <App />
  </CategoryProvider>
  </StrictMode>
)
