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

        res.send(postWithAuthor); 

    } catch (e) {
        console.log(e);
        res.status(500).send('ERROR_CREATE_POST');
    }
};

// 1. OBTENER TODOS LOS POSTS
const getPosts = async (req: Request, res: Response) => {
    try {
        const { search, category } = req.query;
        
        let query: any = { isActive: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        const posts = await PostModel.find(query)
            .populate('author', 'firstName email');
            
        res.send(posts);
    } catch (e) {
        res.status(500).send('ERROR_GET_POSTS');
    }
};

// 2. OBTENER UN SOLO POST
const getPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const post = await PostModel.findOne({ _id: id, isActive: true })
            .populate('author', 'firstName paternalSurname email phone');
            
        if (!post) {
            return res.status(404).send('POST_NO_ENCONTRADO');
        }

        res.send(post);
    } catch (e) {
        res.status(500).send('ERROR_GET_ONE_POST');
    }
};

// OBTENER SOLO MIS POSTS
const getMyPosts = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id; 
        const posts = await PostModel.find({ author: userId, isActive: true })
            .populate('author', 'firstName email');
        
        res.send(posts);
    } catch (e) {
        res.status(500).send('ERROR_GET_MY_POSTS');
    }
};

// ELIMINAR UN POST
const deletePost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id; 
        const { id } = req.params; 

        const post = await PostModel.findOne({ _id: id });
        if (!post) {
            return res.status(404).send('POST_NO_ENCONTRADO');
        }

        const user = await UserModel.findById(userId);

        const isOwner = post.author.toString() === userId;
        const isAdmin = user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).send('NO_TIENES_PERMISOS');
        }

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

// ACTUALIZAR UN POST (CORREGIDO)
const updatePost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id; 
        const { id } = req.params; 
        const body = req.body; 

        const post = await PostModel.findOne({ _id: id });

        if (!post) {
            return res.status(404).send('POST_NO_ENCONTRADO');
        }

        if (post.author.toString() !== userId) {
            return res.status(403).send('NO_ERES_EL_DUEÑO');
        }

        // --- CORRECCIÓN AQUÍ: Añadimos .populate(...) al final ---
        const response = await PostModel.findOneAndUpdate(
            { _id: id },
            body,
            { new: true } 
        ).populate('author', 'firstName paternalSurname email phone'); // <--- ¡ESTO FALTABA!

        res.send(response);

    } catch (e) {
        console.log("ERROR EN UPDATE POST:", e);
        res.status(500).send('ERROR_UPDATE_POST');
    }
};

export { createPost, getPosts, getPost, getMyPosts, deletePost, updatePost };