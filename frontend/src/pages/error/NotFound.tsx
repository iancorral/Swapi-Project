import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <div className="max-w-md w-full">
        <h1 className="text-8xl font-bold text-gray-200 mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Página no encontrada
        </h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Lo sentimos, la dirección que ingresó no existe o ha sido movida. 
          Por favor, verifique la URL o regrese a la página principal.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 shadow-sm"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default NotFound;