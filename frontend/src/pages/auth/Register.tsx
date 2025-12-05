import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthService } from "../../services/auth.service";
import type { RegisterRequest } from "../../types/auth.interface";
// Iconos para darle estilo
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface RegisterForm extends RegisterRequest {
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    trigger, 
    formState: { errors, isSubmitting } 
  } = useForm<RegisterForm>({
    mode: "onChange" 
  });

  const handleNextStep = async () => {
    const isEmailValid = await trigger("email");
    if (isEmailValid) {
      setStep(2);
    }
  };

  const onSubmit = async (data: RegisterForm) => {
    try {
        await AuthService.register(data);
        
        toast.success("Código enviado. Revisa tu correo.");
        navigate("/verify", { state: { email: data.email } });
        
        } catch (error: any) {
        }
    };

  const password = watch("password");
  const emailValue = watch("email"); 

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        <div className="text-center mb-8 mt-2">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {step === 1 ? "Comencemos" : "Casi listo"}
          </h1>
          <p className="text-gray-500">
            {step === 1 
              ? "Ingresa tu correo institucional para validar" 
              : "Completa tus datos personales"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {step === 1 && (
            <div className="space-y-6 fade-in-animation">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Institucional</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <EmailIcon fontSize="small" />
                  </div>
                  <input
                    {...register("email", { 
                      required: "El correo es obligatorio",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@ulsachihuahua\.edu\.mx$/i,
                        message: "Debe ser @ulsachihuahua.edu.mx"
                      }
                    })}
                    placeholder="tumatricula@ulsachihuahua.edu.mx"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-lg"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 bg-red-50 p-2 rounded-md border border-red-100 flex items-center gap-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="button" 
                onClick={handleNextStep}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 group"
              >
                Continuar
                <ArrowForwardIcon fontSize="small" className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 fade-in-animation">
              
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <EmailIcon fontSize="small" />
                  <span className="font-medium text-sm">{emailValue}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
                >
                  Editar
                </button>
              </div>

              {/* Nombres */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    {...register("firstName", { required: "Requerido" })}
                    placeholder=""
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
                  <input
                    {...register("paternalSurname", { required: "Requerido" })}
                    placeholder=""
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  {errors.paternalSurname && <span className="text-red-500 text-xs">{errors.paternalSurname.message}</span>}
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  {...register("phone", { 
                    required: "Requerido",
                    minLength: { value: 10, message: "10 dígitos" }
                  })}
                  placeholder="6141234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
                {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
              </div>

              {/* Contraseñas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    {...register("password", { required: "Requerida", minLength: { value: 6, message: "Mínimo 6" } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar</label>
                  <input
                    type="password"
                    {...register("confirmPassword", { 
                      required: "Requerida",
                      validate: (val) => val === password || "No coinciden"
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  <ArrowBackIcon />
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Creando Cuenta..."
                  ) : (
                    <>
                      <PersonIcon fontSize="small" />
                      Registrarme
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}