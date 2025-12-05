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
 * Ruta protegida
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const AppRouter = () => {
  return (
    <Routes>
      {/* ---------- RUTAS PÚBLICAS ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerifyCode />} />

      {/* ---------- RUTAS PRIVADAS ---------- */}
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

      {/* DETALLE DE POST */}
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

      {/* CREAR POST */}
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

      {/* CATEGORÍAS */}
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

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      {/* ---------- FALLBACK (ERROR 404) ---------- */}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
};