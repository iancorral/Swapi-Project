import React from 'react';
import { Link, useLocation} from 'react-router-dom';
import { Navbar } from './Navbar';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  const location = useLocation();
  const isCreatePostPage = location.pathname === "/create-post";

  return (
    <div className="min-h-screen bg-secondary relative">
      
      <Navbar />

      {/* CAMBIO: Reduje pb-24 a pb-12 para quitar el espacio excesivo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12"> 
        {children}
      </main>

      {/* --- BOTÓN FLOTANTE (FAB) --- */}
      {!isCreatePostPage && (
        <Link
          to="/create-post"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary hover:bg-primary-dark text-white w-14 h-14 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
          title="Crear nueva publicación"
        >
          <AddIcon style={{ fontSize: 28 }} />

          <span className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Crear Publicación
          </span>
        </Link>
      )}

    </div>
  );
};