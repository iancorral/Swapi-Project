// backend/src/controllers/user.controller.ts
import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";

interface RequestExt extends Request {
    user?: string | JwtPayload | any;
}

// GUARDAR O QUITAR FAVORITO (TOGGLE)
const toggleSavedPost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params; // El ID del post viene en la URL

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).send("USUARIO_NO_ENCONTRADO");

        // Convertimos a string para comparar fácil
        const savedIndex = user.savedPosts.findIndex(id => id.toString() === postId);

        if (savedIndex >= 0) {
            // SI YA EXISTE -> LO QUITAMOS (Pull)
            user.savedPosts.splice(savedIndex, 1);
            await user.save();
            res.send({ saved: false, message: "Eliminado de guardados" });
        } else {
            // SI NO EXISTE -> LO AGREGAMOS (Push)
            user.savedPosts.push(postId as any);
            await user.save();
            res.send({ saved: true, message: "Agregado a guardados" });
        }

    } catch (e) {
        console.log(e);
        res.status(500).send("ERROR_TOGGLE_SAVE");
    }
};

// OBTENER MIS FAVORITOS
const getMySavedPosts = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id;
        
        // Buscamos al usuario y "populamos" (rellenamos) el arreglo savedPosts
        const user = await UserModel.findById(userId)
            .populate({
                path: 'savedPosts',
                populate: { path: 'author', select: 'firstName email' } // También traemos al autor del post
            });

        if (!user) return res.status(404).send("USUARIO_NO_ENCONTRADO");

        // Regresamos solo la lista de posts
        res.send(user.savedPosts);

    } catch (e) {
        res.status(500).send("ERROR_GET_SAVED");
    }
};

export { toggleSavedPost, getMySavedPosts };