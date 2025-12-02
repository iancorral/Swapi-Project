import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { PostService } from "../../services/post.service";
import type { Category } from "../../types/post.interface";

// Iconos
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface CreatePostForm {
  title: string;
  description: string;
  price: number;
  category: Category;
  image: FileList;
}

export default function CreatePost() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreatePostForm>();

  // Previsualización de imagen
  const imageFiles = watch("image");
  if (imageFiles && imageFiles.length > 0 && !preview) {
    const file = imageFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  const onSubmit = async (data: CreatePostForm) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("category", data.category);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      await PostService.create(formData);

      toast.success("¡Publicado con éxito!");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Error al publicar";

      if (
        error.response?.status === 400 &&
        error.response?.data?.error === "PALABRAS_OFENSIVAS"
      ) {
        toast.error("Contenido inapropiado detectado");
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Nueva Publicación
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Fila 1: Título y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                {...register("title", { required: "Escribe un título claro" })}
                placeholder="Título de tu publicación"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
              {errors.title && (
                <span className="text-red-500 text-xs">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", { required: "Ponle precio", min: 0 })}
                  placeholder="0.00"
                  className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              {...register("category", { required: "Elige una categoría" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
            >
              <option value="">Selecciona...</option>
              <option value="ventas">Ventas</option>
              <option value="rentas">Rentas </option>
              <option value="servicios">Servicios </option>
              <option value="anuncios">Anuncios </option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              {...register("description", { required: "Describe tu producto" })}
              rows={4}
              placeholder="Detalles, estado del producto, lugar de entrega..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto del Producto
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition cursor-pointer relative overflow-hidden">
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {preview ? (
                <div className="relative w-full h-64">
                  <img
                    src={preview}
                    alt="Previsualización"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition text-white font-bold">
                    Cambiar Imagen
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
                    <AddPhotoAlternateIcon className="text-primary" fontSize="large" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    Toca para subir una foto
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    JPG, PNG (Max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botón Publicar */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2 text-lg"
          >
            {isSubmitting ? "Publicando..." : (
              <>
                <CloudUploadIcon />
                Publicar Ahora
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
