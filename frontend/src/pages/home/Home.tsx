import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { PostService } from "../../services/post.service";
import { ProductCard } from "../../components/ui/ProductCard";
import type { Post } from "../../types/post.interface";

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar posts al iniciar
    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await PostService.getAll();
            setPosts(data);
        } catch (error) {
            console.error(error);
            toast.error("No se pudieron cargar las publicaciones");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Encabezado Simple */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Explora Swapi</h1>
                <p className="text-gray-500 mt-1">El mercado exclusivo de tu universidad.</p>
            </div>

            {/* Estado de Carga */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                // Grid de Productos
                <>
                    {posts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No hay publicaciones disponibles.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {posts.map((post) => (
                                <ProductCard key={post._id} product={post} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}