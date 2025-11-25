import { Request } from 'express';
import multer, { diskStorage } from 'multer';

// CONFIGURACIÓN DE ALMACENAMIENTO LOCAL
const PATH_STORAGE = `${process.cwd()}/storage`;

const storage = diskStorage({
    destination(req: Request, file: Express.Multer.File, cb: any) {
        // Aquí decimos: "Guárdalo en la carpeta storage"
        cb(null, PATH_STORAGE);
    },
    filename(req: Request, file: Express.Multer.File, cb: any) {
        // Generamos un nombre único: "archivo-123456789.png"
        const ext = file.originalname.split('.').pop(); // Sacamos la extensión (jpg, png)
        const fileNameRandom = `image-${Date.now()}.${ext}`;
        cb(null, fileNameRandom);
    }
});

const multerMiddleware = multer({ storage });

export { multerMiddleware };