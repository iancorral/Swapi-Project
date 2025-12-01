import React from 'react';
import { Navbar } from './Navbar';

interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Barra Superior Fija */}
      <Navbar />

      {/* Contenido Dinámico (Las páginas) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};