import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyCode from "../pages/auth/VerifyCode";
import Home from "../pages/home/Home";
import ProductDetail from "../pages/post/ProductDetail";
import CreatePost from "../pages/post/CreatePost";

import { useAuthStore } from "../context/auth.store";
import { MainLayout } from "../components/layout/MainLayout";
import CategoryFeed from '../pages/post/CategoryFeed';
import Profile from '../pages/profile/Profile';
import EditPost from '../pages/post/EditPost';

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

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
