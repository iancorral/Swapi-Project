import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppRouter } from './router/AppRouter' // Usamos el Router directo en lugar de App
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Habilita la navegación */}
      <AppRouter /> {/* Nuestra configuración de rutas */}
      <Toaster position="top-center" reverseOrder={false} /> {/* Alertas globales */}
    </BrowserRouter>
  </React.StrictMode>,
)