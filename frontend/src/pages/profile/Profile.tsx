import { useState, useEffect, useRef } from "react";
// 1. IMPORTAR useSearchParams además de useNavigate
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../context/auth.store";
import { PostService } from "../../services/post.service";
import { UserService } from "../../services/user.service";
import { ProductCard } from "../../components/ui/ProductCard";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { toast } from "react-hot-toast";

export default function Profile() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    
    // --- CORRECCIÓN TABS: Usar URL params ---
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Si no hay tab en la URL, asumimos 'my_posts'
    const activeTab = searchParams.get('tab') || 'my_posts';

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [activeTab]); // Se recarga cuando cambia la URL

    const handleTabChange = (tab: string) => {
        setSearchParams({ tab }); // Esto actualiza la URL y guarda historial
    };

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'my_posts') {
                const all = await PostService.getAll();
                const myPosts = Array.isArray(all) 
                    ? all.filter(p => {
                        const authorId = typeof p.author === 'object' ? (p.author as any)._id : p.author;
                        return authorId === user?._id;
                    }) 
                    : [];
                setItems(myPosts);
            } else {
                const saved = await UserService.getSavedPosts();
                setItems(Array.isArray(saved) ? saved : []);
            }
        } catch (error) {
            console.error("Error cargando perfil:", error);
            toast.error("Error al cargar publicaciones");
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId: string) => {
        const confirmed = await confirmDelete("¿Estás seguro de que quieres eliminar esta publicación?");
        if (!confirmed) return;

        try {
            await PostService.delete(postId);
            toast.success("Publicación eliminada");
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar la publicación");
        }
    };

    // Modal confirm (centered)
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const confirmResolve = useRef<((value: boolean) => void) | null>(null);

    const confirmDelete = (message: string) => {
        return new Promise<boolean>((resolve) => {
            confirmResolve.current = resolve;
            setConfirmMessage(message);
            setConfirmOpen(true);
        });
    };

    const onConfirm = () => {
        setConfirmOpen(false);
        confirmResolve.current?.(true);
        confirmResolve.current = null;
    };

    const onCancel = () => {
        setConfirmOpen(false);
        confirmResolve.current?.(false);
        confirmResolve.current = null;
    };

    return (
        <div>
            {/* Header del Perfil */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex items-center gap-4">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0">
                    {user?.firstName?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <h2 className="text-2xl font-bold truncate">
                        {user?.firstName} {user?.paternalSurname}
                    </h2>
                    <p className="text-gray-500 truncate">{user?.email}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b mb-6 overflow-x-auto">
                <button 
                    className={`pb-2 px-4 font-medium whitespace-nowrap transition-colors ${
                        activeTab === 'my_posts' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleTabChange('my_posts')}
                >
                    Mis Publicaciones
                </button>
                <button 
                    className={`pb-2 px-4 font-medium whitespace-nowrap transition-colors ${
                        activeTab === 'saved' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleTabChange('saved')}
                >
                    Guardados
                </button>
            </div>

            {/* Estado de Carga */}
            {loading ? (
                <div className="flex justify-center py-10">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    {/* Mensaje si está vacío */}
                    {items.length === 0 && (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                            <p>No hay publicaciones aquí todavía.</p>
                            {activeTab === 'my_posts' && (
                                <Link to="/create-post" className="text-primary font-bold mt-2 inline-block">
                                    ¡Crea tu primera publicación!
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Grid de resultados */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map(post => (
                            <div key={post._id} className="relative group">
                                <ProductCard product={post} />

                                {/* Botones de acción (Solo para mis posts) */}
                                {activeTab === 'my_posts' && (
                                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        
                                        {/* Botón Eliminar */}
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDelete(post._id);
                                            }}
                                            className="bg-white/90 p-2 rounded-full shadow-md hover:bg-red-50 text-red-600 transition-transform hover:scale-110"
                                            title="Eliminar"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                         {/* Botón Editar */}
                                         <button 
                                            className="bg-white/90 p-2 rounded-full shadow-md hover:bg-blue-50 text-blue-600 transition-transform hover:scale-110"
                                            title="Editar"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/edit-post/${post._id}`);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
            
            {/* Confirm modal */}
            <ConfirmModal open={confirmOpen} message={confirmMessage} onConfirm={onConfirm} onCancel={onCancel} />
        </div>
    );
}