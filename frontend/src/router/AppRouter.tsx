import React from 'react'; // <--- 1. Importa React explícitamente
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import { useAuthStore } from "../context/auth.store";
import { MainLayout } from "../components/layout/MainLayout";
import Home from "../pages/home/Home";

// 2. Cambiamos el tipo de 'children' a React.ReactNode (es el estándar)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas Públicas (Login no lleva Navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<div className="p-10">Registro</div>} />

      {/* Rutas Privadas */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout>
              {/* 2. USAR EL COMPONENTE HOME AQUÍ */}
              <Home /> 
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};