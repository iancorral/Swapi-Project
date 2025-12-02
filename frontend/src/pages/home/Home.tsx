import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PostService } from "../../services/post.service";
import { UserService } from "../../services/user.service";
import { ProductCard } from "../../components/ui/ProductCard";
import type { Post } from "../../types/post.interface";
import { useAuthStore } from "../../context/auth.store";

export default function Home() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [posts, setPosts] = useState<Post[]>([]);
    const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [postsData, savedData] = await Promise.all([
                PostService.getAll(),
                UserService.getSavedPosts()
            ]);

            setPosts(Array.isArray(postsData) ? postsData : []);
            
            if (Array.isArray(savedData)) {
                setSavedPostIds(savedData.map((p: any) => p._id));
            }

        } catch (error) {
            console.error("Error cargando home:", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['ventas', 'rentas', 'servicios', 'anuncios'];
    const getPostsByCategory = (cat: string) => posts.filter(p => p.category.toLowerCase() === cat);

    if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>;

    return (
        // Se eliminó pb-20
        <div>
            <div className="mb-6 px-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {t('home_welcome', { name: user?.firstName })} 
                </h1>
            </div>

            {/* CATEGORÍAS */}
            {categories.map((category) => {
                const categoryPosts = getPostsByCategory(category);
                if (categoryPosts.length === 0) return null;

                return (
                    <div key={category} className="mb-6">
                        <div className="flex justify-between items-end mb-3 px-2">
                            <h2 className="text-xl font-bold capitalize text-gray-800 flex items-center gap-2">
                                {t(`${category}`)}
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-normal">
                                    {categoryPosts.length}
                                </span>
                            </h2>
                            <Link to={`/category/${category}`} className="text-primary font-medium hover:underline text-sm">
                                {t('see_more')}
                            </Link>
                        </div>

                        <div className="flex overflow-x-auto pb-4 gap-3 px-2 scrollbar-hide snap-x">
                            {categoryPosts.slice(0, 6).map((post) => (
                                <div key={post._id} className="min-w-[260px] snap-center">
                                    <ProductCard 
                                        product={post} 
                                        isSavedInitial={savedPostIds.includes(post._id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}