import { useNavigate } from "react-router-dom";
import type { Post } from "../../types/post.interface";
import type { User } from "../../types/user.interface";
import { getAvatarColor } from "../../utils/colors";

interface Props {
    product: Post;
}

export const ProductCard = ({ product }: Props) => {
    const navigate = useNavigate();

    const BASE_URL = "http://localhost:3000/storage/";
    const imageUrl = product.images.length > 0
        ? `${BASE_URL}${product.images[0]}`
        : "https://via.placeholder.com/400x300?text=Sin+Imagen";

    const author = product.author as User;
    const firstName = author.firstName || "Anónimo";
    const lastName = author.paternalSurname || "";

    // Iniciales
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    const initials = `${firstInitial}${lastInitial}`;

    // Color dinámico del avatar
    const avatarHex = getAvatarColor(firstName);

    return (
        <div
            onClick={() => navigate(`/post/${product._id}`)}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden cursor-pointer"
        >
            {/* --- IMAGEN --- */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-50">
                <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge categoría */}
                <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur-md text-gray-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-gray-100">
                        {product.category}
                    </span>
                </div>
            </div>

            {/* --- CONTENIDO --- */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-4">
                    <p className="text-xl font-extrabold text-primary mb-1">
                        ${product.price.toLocaleString('es-MX')}
                    </p>
                    <h3 className="text-gray-900 font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>
                </div>

                {/* --- FOOTER: VENDEDOR --- */}
                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-3">
                    <div
                        className="w-9 h-9 min-w-[36px] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white"
                        style={{ backgroundColor: avatarHex }}
                    >
                        {initials}
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm text-gray-700 font-bold leading-tight">
                            {firstName} {lastName}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                            Vendedor
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
