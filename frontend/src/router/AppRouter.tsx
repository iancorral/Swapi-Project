import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyCode from "../pages/auth/VerifyCode";
import Home from "../pages/home/Home";
import ProductDetail from "../pages/post/ProductDetail";
import CreatePost from "../pages/post/CreatePost";
import CategoryFeed from '../pages/post/CategoryFeed';
import Profile from '../pages/profile/Profile';
import EditPost from '../pages/post/EditPost';
import { Dashboard } from '../pages/admin/Dashboard';

import NotFound from "../pages/error/NotFound";

import { useAuthStore } from "../context/auth.store";
import { MainLayout } from "../components/layout/MainLayout";

/**
 * Ruta protegida estándar (Solo requiere estar logueado)
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

/**
 * Ruta protegida VIP (Requiere estar logueado Y ser admin).
 */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // AQUÍ ESTÁ EL TRUCO: Verificamos el rol
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRouter = () => {
  return (
    <Routes>
      {/* ---------- RUTAS PÚBLICAS ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerifyCode />} />

      {/* ---------- RUTAS PRIVADAS (Cualquier usuario) ---------- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/post/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProductDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-post"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CreatePost />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/category/:type"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CategoryFeed />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-post/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EditPost />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------- RUTA DE ADMIN (Protegida x2) ---------- */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute> {/* <--- CAMBIO AQUÍ: Usamos AdminRoute en vez de ProtectedRoute */}
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </AdminRoute>
        }
      />
      
      {/* ---------- FALLBACK (ERROR 404) ---------- */}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
};