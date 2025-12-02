import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthService } from "../../services/auth.service";
import { useAuthStore } from "../../context/auth.store";
import type { LoginRequest } from "../../types/auth.interface";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  // Configuración del formulario
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      // 1. Llamamos al backend
      const response = await AuthService.login(data);
      
      // 2. Guardamos sesión en el store global
      setAuth(response.token, response.user);
      
      // 3. Feedback y redirección
      toast.success(`¡Bienvenido, ${response.user.firstName}!`);
      navigate("/"); // Nos manda al Home (que crearemos luego)
      
    } catch (error: any) {
      console.error(error);
      // Mostramos el error que venga del backend o uno genérico
      const msg = error.response?.data?.message || "Error al iniciar sesión";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Swapi</h1>
          <p className="text-gray-500">Ingresa con tu cuenta institucional</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              {...register("email", { required: "El correo es obligatorio" })}
              type="email"
              placeholder="tumatricula@ulsachihuahua.edu.mx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              {...register("password", { required: "La contraseña es obligatoria" })}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Entrando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}