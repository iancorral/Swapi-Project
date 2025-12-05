import { useNavigate } from "react-router-dom";
import type { Post } from "../../types/post.interface";
import type { User } from "../../types/user.interface";
import { getAvatarColor } from "../../utils/colors";

interface Props {
    product: Post;
    isSavedInitial?: boolean;
}

export const ProductCard = ({ product }: Props) => {
    const navigate = useNavigate();

    const BACKEND_URL = "http://localhost:3000";

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) {
            return "https://via.placeholder.com/400x300?text=Sin+Imagen";
        }
        if (imagePath.startsWith("http")) return imagePath;
        return `${BACKEND_URL}/storage/${imagePath}`;
    };

    const imageUrl =
        product.images.length > 0
            ? getImageUrl(product.images[0])
            : getImageUrl();

    const author = product.author as User | undefined;
    const firstName = author?.firstName || "Usuario";
    const lastName = author?.paternalSurname || "";

    const initials =
        firstName.charAt(0).toUpperCase() +
        (lastName ? lastName.charAt(0).toUpperCase() : "");

    const avatarHex = getAvatarColor(firstName);

    return (
        <div
            onClick={() => navigate(`/post/${product._id}`)}
            className="
                group bg-white rounded-2xl border border-gray-100
                shadow-sm hover:shadow-lg transition-all
                overflow-hidden cursor-pointer flex flex-col
            "
        >
            <div className="relative w-full aspect-[4/3] bg-gray-200 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) =>
                        (e.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=Sin+Imagen")
                    }
                />

                <span className="
                    absolute top-3 left-3 bg-white/90 backdrop-blur
                    text-gray-800 text-[10px] font-bold
                    px-3 py-1 rounded-full uppercase tracking-wide
                    border border-gray-100
                ">
                    {product.category}
                </span>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <p className="text-lg font-extrabold text-primary mb-1">
                    ${product.price.toLocaleString("es-MX")}
                </p>

                <h3 className="
                    text-gray-900 font-semibold text-sm
                    line-clamp-2 h-[2.5rem]
                    group-hover:text-primary transition-colors
                ">
                    {product.title}
                </h3>

                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: avatarHex }}
                    >
                        {initials}
                    </div>

                    <div className="truncate">
                        <p className="text-sm font-bold text-gray-700 truncate">
                            {firstName} {lastName}
                        </p>
                        <span className="text-[10px] text-gray-400 uppercase">
                            Usuario
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
