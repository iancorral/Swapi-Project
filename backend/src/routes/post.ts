import { Router } from 'express';
import { createPost, getPosts, getMyPosts, getPost, deletePost, updatePost } from '../controllers/post.controller';
import { checkJwt } from '../middlewares/session';
import { multerMiddleware } from '../utils/storage';

const router = Router();

/** * ORDEN IMPORTANTE:
 * 1. Rutas específicas (/my-posts, /, etc.)
 * 2. Rutas dinámicas (/:id) Siempre al final
 */

// 1. Rutas Específicas
router.get('/', getPosts); // Ver todo
router.get('/my-posts', checkJwt, getMyPosts); 

router.post('/', checkJwt, multerMiddleware.single('image'), createPost);

// 2. Rutas Dinámicas 
router.get('/:id', getPost); 

router.delete('/:id', checkJwt, deletePost);
router.put('/:id', checkJwt, updatePost);

export { router };