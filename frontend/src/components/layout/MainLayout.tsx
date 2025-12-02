import React from 'react';
import { Link, useLocation} from 'react-router-dom';
import { Navbar } from './Navbar';
// Importamos el icono de "Más"
import AddIcon from '@mui/icons-material/Add';

interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  const location = useLocation();

  const isCreatePostPage = location.pathname === "/create-post";
  return (
    <div className="min-h-screen bg-secondary relative"> {/* 'relative' es importante */}
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24"> 
        {/* Agregamos pb-24 (padding bottom) para que el contenido no quede tapado por el botón al final */}
        {children}
      </main>

      {/* --- BOTÓN FLOTANTE (FAB) --- */}
      {!isCreatePostPage && (
        <Link
          to="/create-post"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary hover:bg-primary-dark text-white w-16 h-16 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
          title="Crear nueva publicación"
        >
          <AddIcon style={{ fontSize: 32 }} />

          <span className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Crear Publicación
          </span>
        </Link>
      )}


    </div>
  );
};