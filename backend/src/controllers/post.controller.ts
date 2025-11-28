import { Request, Response } from 'express';
import PostModel from '../models/post.model';
import UserModel from '../models/user.model';
import { JwtPayload } from 'jsonwebtoken';

// --- CORRECCIÓN FINAL Y ROBUSTA ---
// 1. Traemos todo lo que exporta la librería
const badWordsRaw = require('bad-words');

// 2. Buscamos el constructor "Filter" donde sea que esté escondido
// Algunos sistemas lo ponen en .default, otros en .Filter, y otros directo.
const Filter = badWordsRaw.default || badWordsRaw.Filter || badWordsRaw;

// 3. Verificamos (Debug de seguridad)
if (typeof Filter !== 'function') {
    console.error('⚠️ ERROR CRÍTICO: No se encontró la clase Filter de bad-words.');
    console.error('Contenido recibido:', badWordsRaw);
}

// 4. Instanciamos
const filter = new Filter();

// Diccionario de groserías en español y mexicano
const spanishBadWords = [
    'mierda', 'puta', 'puto', 'cabron', 'cabrón', 'pendejo', 'pinche', 'verga', 
    'estupido', 'estúpido', 'idiota', 'imbecil', 'imbécil', 'joder', 'coño', 
    'mamadas', 'chingar', 'chingada', 'chingado', 'culero', 'culo', 'panocha', 'chingón', 'chingona', 'pija', 'boludo', 'boluda', 'zorra',
    'chinga', 'chingue', 'chingues', 'madre', 'hijo de puta', 'hijo de la chingada',
    'pinches', 'pendeja', 'vergas', 'culera', 'coger', 'cogida', 'cogido', 'follar',
    'maricon', 'maricón', 'maricones', 'maricas', 'marica', 'putas', 'putones', 'putona',
    'tarado', 'tarada', 'tarados', 'taradas', 'tonto', 'tonta', 'tontos', 'tontas', 'pito', 'pitos', 'pene', 'vagina', 'vaginas'
];

// Agregamos las palabras al filtro existente
filter.addWords(...spanishBadWords);

// Interfaz extendida para el Request
interface RequestExt extends Request {
    user?: string | JwtPayload | any; 
}

// CREAR UN POST (MODO ESTRICTO)
const createPost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id;
        const file = req.file; 
        const pathPhoto = file ? `${file.filename}` : '';
        const { title, description, price, category } = req.body;

        // --- VALIDACIÓN: Si hay groserías, RECHAZAMOS la petición ---
        // isProfane devuelve true si encuentra alguna palabra de la lista
        if (filter.isProfane(title) || filter.isProfane(description)) {
            // Borramos la imagen que se subió porque no vamos a guardar el post
            // (Opcional, pero buena práctica para no llenar el server de basura)
            return res.status(400).send({ 
                error: 'PALABRAS_OFENSIVAS',
                message: 'No se permiten palabras ofensivas en el título o descripción.' 
            });
        }
        // ------------------------------------------------------------

        // Si pasa el filtro, guardamos normal (ya no necesitamos .clean)
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

// OBTENER TODOS LOS POSTS
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

// OBTENER UN SOLO POST
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

// ACTUALIZAR UN POST (MODO ESTRICTO)
const updatePost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id; 
        const { id } = req.params; 
        const body = req.body; 

        // --- VALIDACIÓN AL ACTUALIZAR ---
        if ( (body.title && filter.isProfane(body.title)) || 
             (body.description && filter.isProfane(body.description)) ) {
             return res.status(400).send({ 
                error: 'PALABRAS_OFENSIVAS',
                message: 'No se permiten palabras ofensivas.' 
            });
        }
        // -------------------------------

        const post = await PostModel.findOne({ _id: id });

        if (!post) return res.status(404).send('POST_NO_ENCONTRADO');
        if (post.author.toString() !== userId) return res.status(403).send('NO_ERES_EL_DUEÑO');

        const response = await PostModel.findOneAndUpdate(
            { _id: id },
            body,
            { new: true } 
        ).populate('author', 'firstName paternalSurname email phone');

        res.send(response);

    } catch (e) {
        console.log("ERROR EN UPDATE POST:", e);
        res.status(500).send('ERROR_UPDATE_POST');
    }
};

export { createPost, getPosts, getPost, getMyPosts, deletePost, updatePost };