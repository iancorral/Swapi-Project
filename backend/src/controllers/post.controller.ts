import { Request, Response } from 'express';
import PostModel from '../models/post.model';
import UserModel from '../models/user.model';
import { JwtPayload } from 'jsonwebtoken';

const badWordsRaw = require('bad-words');
const Filter = badWordsRaw.default || badWordsRaw.Filter || badWordsRaw;

if (typeof Filter !== 'function') {
    console.error('ERROR CRÍTICO: No se encontró la clase Filter.');
}

const filter = new Filter();

const spanishBadWords = [
    'mierda', 'puta', 'puto', 'cabron', 'cabrón', 'pendejo', 'pinche', 'verga', 
    'estupido', 'estúpido', 'idiota', 'imbecil', 'imbécil', 'joder', 'coño', 
    'mamadas', 'chingar', 'chingada', 'chingado', 'culero', 'culo', 'panocha', 
    'chingón', 'chingona', 'pija', 'boludo', 'boluda', 'zorra', 'chinga', 
    'chingue', 'chingues', 'madre', 'hijo de puta', 'pinches', 'pendeja', 
    'vergas', 'culera', 'coger', 'cogida', 'follar', 'maricon', 'marica', 
    'putas', 'tarado', 'tonto', 'pito', 'pene', 'vagina'
];

filter.addWords(...spanishBadWords);

interface RequestExt extends Request {
    user?: string | JwtPayload | any; 
}

// CREAR POST
const createPost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id;
        const file = req.file; 
        const pathPhoto = file ? file.path : '';
        const { title, description, price, category } = req.body;

        if (filter.isProfane(title) || filter.isProfane(description)) {
            return res.status(400).send({ 
                error: 'PALABRAS_OFENSIVAS',
                code: 'PALABRAS_OFENSIVAS',
                message: 'No se permiten palabras ofensivas.' 
            });
        }

        const newPost = await PostModel.create({
            title, description, price, category,
            images: [pathPhoto], author: userId
        });

        const postWithAuthor = await newPost.populate('author', 'firstName paternalSurname email phone');
        
        // Mantenemos la respuesta del objeto directo para Android Retrofit
        res.send(postWithAuthor); 

    } catch (e) {
        console.log(e);
        res.status(500).send({ code: 'ERROR_CREATE_POST', message: 'Error al crear' });
    }
};

// OBTENER TODOS
const getPosts = async (req: Request, res: Response) => {
    try {
        const { search, category } = req.query;
        let query: any = { isActive: true };

        if (search) {

            query.$text = { $search: search as string };
        }
        if (category) query.category = category;

        const posts = await PostModel.find(query).populate('author', 'firstName email');
        
        res.send(posts);
    } catch (e) {
        res.status(500).send({ code: 'ERROR_GET_POSTS' });
    }
};

// OBTENER UNO
const getPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await PostModel.findOne({ _id: id, isActive: true })
            .populate('author', 'firstName paternalSurname email phone');
            
        if (!post) return res.status(404).send({ code: 'POST_NO_ENCONTRADO' });
        res.send(post);
    } catch (e) {
        res.status(500).send({ code: 'ERROR_GET_ONE_POST' });
    }
};

// MIS POSTS
const getMyPosts = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id; 
        const posts = await PostModel.find({ author: userId, isActive: true })
            .populate('author', 'firstName email');
        res.send(posts);
    } catch (e) {
        res.status(500).send({ code: 'ERROR_GET_MY_POSTS' });
    }
};

// ELIMINAR
const deletePost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id; 
        const { id } = req.params; 
        const post = await PostModel.findOne({ _id: id });

        if (!post) return res.status(404).send({ code: 'POST_NO_ENCONTRADO' });

        const user = await UserModel.findById(userId);
        const isOwner = post.author.toString() === userId;
        const isAdmin = user?.role === 'admin';

        if (!isOwner && !isAdmin) return res.status(403).send({ code: 'NO_TIENES_PERMISOS' });

        post.isActive = false;
        await post.save();

        res.send({ 
            success: true,
            code: 'POST_DELETED_SUCCESS', 
            message: 'Post eliminado correctamente', 
            deletedBy: isAdmin ? 'admin' : 'owner' 
        });

    } catch (e) {
        res.status(500).send({ code: 'ERROR_DELETE_POST' });
    }
};

// ACTUALIZAR
const updatePost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id; 
        const { id } = req.params; 
        
        // Hacemos una copia del body para poder modificarlo si hay foto
        const body = { ...req.body }; 

        // DETECCIÓN DE IMAGEN NUEVA:
        // Si hay un archivo nuevo (req.file), actualizamos el campo 'images'
        if (req.file) {
            body.images = [req.file.path];
        }

        if ( (body.title && filter.isProfane(body.title)) || 
             (body.description && filter.isProfane(body.description)) ) {
             return res.status(400).send({ 
                error: 'PALABRAS_OFENSIVAS',
                code: 'PALABRAS_OFENSIVAS',
                message: 'No se permiten palabras ofensivas.' 
            });
        }

        const post = await PostModel.findOne({ _id: id });
        if (!post) return res.status(404).send({ code: 'POST_NO_ENCONTRADO' });
        
        // Verificamos que sea el dueño (o admin)
        // Nota: Agregué la conversión a String para asegurar la comparación
        if (post.author.toString() !== userId) return res.status(403).send({ code: 'NO_ERES_EL_DUEÑO' });

        const response = await PostModel.findOneAndUpdate(
            { _id: id }, body, { new: true } 
        ).populate('author', 'firstName paternalSurname email phone');

        res.send(response); 

    } catch (e) {
        console.log("ERROR EN UPDATE:", e);
        res.status(500).send({ code: 'ERROR_UPDATE_POST' });
    }
};

export { createPost, getPosts, getPost, getMyPosts, deletePost, updatePost };