import { Request, Response } from 'express';
import PostModel from '../models/post.model';
import UserModel from '../models/user.model';
import { JwtPayload } from 'jsonwebtoken';

// Interfaz extendida igual que en el middleware
interface RequestExt extends Request {
    user?: string | JwtPayload | any; // 'any' para facilitar acceso al ID
}

// CREAR UN POST
const createPost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id;
        
        const file = req.file; 
        const pathPhoto = file ? `${file.filename}` : '';

        const { title, description, price, category } = req.body;

        const newPost = await PostModel.create({
            title,
            description,
            price,
            category,
            images: [pathPhoto],
            author: userId
        });

        const postWithAuthor = await newPost.populate('author', 'firstName paternalSurname email phone');

        res.send(postWithAuthor); // Enviamos el post YA poblado
        // -----------------------

    } catch (e) {
        console.log(e);
        res.status(500).send('ERROR_CREATE_POST');
    }
};

// 1. OBTENER TODOS LOS POSTS
const getPosts = async (req: Request, res: Response) => {
    try {
        // Obtenemos los parámetros de la URL (ej: ?search=nintendo&category=ventas)
        const { search, category } = req.query;
        
        // Filtro base: Solo traer los activos
        let query: any = { isActive: true };

        // Si enviaron algo en "search", buscamos en título O descripción
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }, // 'i' = ignora mayúsculas
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Si enviaron una categoría, filtramos exacto
        if (category) {
            query.category = category;
        }

        const posts = await PostModel.find(query)
            .populate('author', 'firstName email'); // Traemos datos del autor
            
        res.send(posts);
    } catch (e) {
        res.status(500).send('ERROR_GET_POSTS');
    }
};

// 2. NUEVO: OBTENER UN SOLO POST (Detalle)
const getPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Buscamos por ID y que esté activo
        const post = await PostModel.findOne({ _id: id, isActive: true })
            .populate('author', 'firstName paternalSurname email phone'); // Traemos más datos para contactar
            
        if (!post) {
            return res.status(404).send('POST_NO_ENCONTRADO');
        }

        res.send(post);
    } catch (e) {
        res.status(500).send('ERROR_GET_ONE_POST');
    }
};

// OBTENER SOLO MIS POSTS (Para el perfil del usuario)
const getMyPosts = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id; 
        // Buscamos solo los que tengan TU id en el campo 'author'
        const posts = await PostModel.find({ author: userId, isActive: true })
            .populate('author', 'firstName email');
        
        res.send(posts);
    } catch (e) {
        res.status(500).send('ERROR_GET_MY_POSTS');
    }
};

// ELIMINAR UN POST (Dueño o Admin)
const deletePost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id; 
        const { id } = req.params; 

        // 1. Buscamos el post
        const post = await PostModel.findOne({ _id: id });
        if (!post) {
            return res.status(404).send('POST_NO_ENCONTRADO');
        }

        // 2. Buscamos quién está intentando borrar para ver su ROL
        const user = await UserModel.findById(userId);

        // 3. REGLAS DE BORRADO:
        const isOwner = post.author.toString() === userId; // ¿Es el dueño?
        const isAdmin = user?.role === 'admin';            // ¿Es administrador?

        // Si NO es dueño Y TAMPOCO es admin, entonces no tiene permiso
        if (!isOwner && !isAdmin) {
            return res.status(403).send('NO_TIENES_PERMISOS');
        }

        // 4. Borrado Lógico
        post.isActive = false;
        await post.save();

        res.send({ 
            message: 'Post eliminado correctamente', 
            deletedBy: isAdmin ? 'admin' : 'owner' 
        });

    } catch (e) {
        res.status(500).send('ERROR_DELETE_POST');
    }
};

// ACTUALIZAR UN POST

const updatePost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id; 
        const { id } = req.params; // El ID del post a editar
        const body = req.body; // Los nuevos datos (título, precio, etc.)

        // 1. Buscamos el post
        const post = await PostModel.findOne({ _id: id });

        if (!post) {
            return res.status(404).send('POST_NO_ENCONTRADO');
        }

        // 2. VALIDACIÓN DE DUEÑO: ¿Eres tú quien lo subió?
        if (post.author.toString() !== userId) {
            return res.status(403).send('NO_ERES_EL_DUEÑO');
        }

        // 3. Actualizamos el post
        // { new: true } hace que mongo te devuelva el post YA actualizado, no el viejo
        const response = await PostModel.findOneAndUpdate(
            { _id: id },
            body,
            { new: true } 
        );

        res.send(response);

    } catch (e) {
        res.status(500).send('ERROR_UPDATE_POST');
    }
};

// ¡Agregamos updatePost al export!
export { createPost, getPosts, getPost, getMyPosts, deletePost, updatePost };