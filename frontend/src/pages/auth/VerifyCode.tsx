import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthService } from "../../services/auth.service";
// Iconos
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface VerifyRequest {
  code: string;
}

export default function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email;

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<VerifyRequest>();

  if (!email) {
    navigate("/register");
    return null;
  }

  const onSubmit = async (data: VerifyRequest) => {
    try {
      await AuthService.verifyCode(email, data.code);
      
      toast.success("¡Cuenta verificada! Ahora puedes iniciar sesión.");
      navigate("/login");
      
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data || "Código incorrecto";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <LockOpenIcon fontSize="large" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifica tu cuenta</h1>
        <p className="text-gray-500 text-sm mb-6">
          Hemos enviado un código de 6 dígitos a <br/>
          <span className="font-semibold text-gray-700">{email}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input
            {...register("code", { 
              required: true, 
              minLength: 6, 
              maxLength: 6 
            })}
            type="text"
            maxLength={6}
            placeholder="123456"
            className="w-full text-center text-3xl tracking-[0.5em] font-mono py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none uppercase"
            autoFocus
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Verificando..." : "Verificar Código"}
          </button>
        </form>

        <button 
          onClick={() => navigate("/register")}
          className="mt-6 text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowBackIcon fontSize="small" /> Corregir correo
        </button>
      </div>
    </div>
  );
}