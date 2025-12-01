import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppRouter } from './router/AppRouter'
import './index.css' // <--- ¡ESTA LÍNEA ES LA MAGIA!

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  </React.StrictMode>,
)