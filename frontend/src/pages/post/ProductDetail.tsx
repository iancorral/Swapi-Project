import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { PostService } from "../../services/post.service";
import { UserService } from "../../services/user.service";
import type { Post } from "../../types/post.interface";
import type { User } from "../../types/user.interface";
import { getAvatarColor } from "../../utils/colors";

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Cargar datos al entrar
  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Cargar Post y Lista de Guardados en paralelo (más rápido)
      const [postData, savedIds] = await Promise.all([
        PostService.getOne(id!),
        UserService.getSavedPosts()
      ]);
      
      setPost(postData);
      // Verificamos si este post está en mis guardados
      setIsSaved(savedIds.includes(postData._id));
      
    } catch (error) {
      toast.error("Error al cargar la publicación");
      navigate("/"); // Si falla, regresamos al home
    } finally {
      setLoading(false);
    }
  };

  // 2. Acción de Guardar/Quitar
  const handleToggleSave = async () => {
    if (!post || saving) return;
    try {
      setSaving(true);
      // Optimistic UI: Cambiamos el icono antes de que responda el server (se siente más rápido)
      setIsSaved(!isSaved); 
      
      const response = await UserService.toggleSave(post._id);
      
      // Confirmamos con el estado real del server
      setIsSaved(response.saved);
      toast.success(response.saved ? "Guardado en favoritos" : "Eliminado de favoritos");
      
    } catch (error) {
      setIsSaved(!isSaved); // Revertimos si falló
      toast.error("Error al actualizar favoritos");
    } finally {
      setSaving(false);
    }
  };

  // 3. Acción de WhatsApp
  const handleWhatsApp = () => {
    if (!post) return;
    const author = post.author as User;
    const phone = author.phone;
    if (!phone) return toast.error("El vendedor no tiene teléfono registrado");

    const message = `Hola, vi tu publicación "${post.title}" en Swapi y me interesa.`;
    const url = `https://wa.me/52${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!post) return null;

  const author = post.author as User;
  const BASE_URL = "http://localhost:3000/storage/";
  const imageUrl = post.images.length > 0 ? `${BASE_URL}${post.images[0]}` : "https://via.placeholder.com/600x400";
  const avatarHex = getAvatarColor(author.firstName);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Botón Regresar */}
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-500 hover:text-primary transition font-medium">
        <ArrowBackIcon className="mr-1" /> Regresar
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* COLUMNA IZQUIERDA: IMAGEN */}
        <div className="md:w-1/2 bg-gray-100 relative h-96 md:h-auto">
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* COLUMNA DERECHA: INFO */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col">
          
          {/* Header Info */}
          <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <button 
              onClick={handleToggleSave}
              className="text-gray-400 hover:text-primary transition p-2 rounded-full hover:bg-gray-50"
            >
              {isSaved ? <BookmarkIcon className="text-primary" fontSize="large" /> : <BookmarkBorderIcon fontSize="large" />}
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{post.title}</h1>
          <p className="text-4xl font-extrabold text-primary mb-6">${post.price.toLocaleString('es-MX')}</p>

          {/* Ubicación Fake (Estilo App) */}
          <div className="flex items-center text-gray-500 text-sm mb-8">
            <LocationOnIcon fontSize="small" className="mr-1" />
            <span>Chihuahua, Chih. (Comunidad ULSA)</span>
          </div>

          {/* Descripción */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Descripción</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{post.description}</p>
          </div>

          <div className="mt-auto pt-8 border-t border-gray-100">
            {/* Vendedor */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
                  style={{ backgroundColor: avatarHex }}
                >
                  {author.firstName.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-bold">{author.firstName} {author.paternalSurname}</p>
                  <p className="text-xs text-gray-500 uppercase">Miembro Verificado</p>
                </div>
              </div>
            </div>

            {/* Botón WhatsApp */}
            <button 
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition flex items-center justify-center gap-2"
            >
              <WhatsAppIcon />
              Contactar por WhatsApp
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}