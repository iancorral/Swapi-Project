import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../context/auth.store";
import { toast } from "react-hot-toast";
// Importamos íconos de Material UI (si no instalaste @mui/icons-material, avísame y usamos texto)
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              {/* Puedes poner aquí tu imagen de logo si la tienes en /public */}
              <span className="text-2xl font-extrabold text-primary tracking-tight">
                Swapi
              </span>
            </Link>
          </div>

          {/* MENÚ DERECHA */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="hidden md:block text-gray-700 font-medium">
                  Hola, {user.firstName}
                </span>
                
                {/* Botón Perfil */}
                <Link 
                  to="/profile" 
                  className="p-2 text-gray-500 hover:text-primary transition rounded-full hover:bg-gray-100"
                  title="Mi Perfil"
                >
                  <PersonIcon />
                </Link>

                {/* Botón Salir */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 transition rounded-full hover:bg-red-50"
                  title="Cerrar Sesión"
                >
                  <LogoutIcon />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};