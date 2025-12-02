import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostService } from "../../services/post.service";
import { ProductCard } from "../../components/ui/ProductCard";
import type { Post } from "../../types/post.interface";

export default function CategoryFeed() {
    const { type } = useParams<{ type: string }>(); // 'ventas', 'rentas', etc.
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (type) {
            // Asumiendo que tu backend soporta filtro por query param ?category=...
            // Si no, filtra en el cliente como en el Home.
            PostService.getAll(type).then(setPosts);
        }
    }, [type]);

    return (
        <div>
            <h1 className="text-3xl font-bold capitalize mb-6">{type}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {posts.map(post => (
                    <ProductCard key={post._id} product={post} />
                ))}
            </div>
        </div>
    );
}