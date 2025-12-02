import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";

interface RequestExt extends Request {
    user?: string | JwtPayload | any;
}

// TOGGLE GUARDADOS
const toggleSavedPost = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).send({ code: 'USUARIO_NO_ENCONTRADO' });

        const savedIndex = user.savedPosts.findIndex(id => id.toString() === postId);

        if (savedIndex >= 0) {
            user.savedPosts.splice(savedIndex, 1);
            await user.save();
            res.send({ 
                success: true, 
                code: 'MSG_SAVED_REMOVED', // Código para traducción
                saved: false, 
                message: "Eliminado de guardados" 
            });
        } else {
            user.savedPosts.push(postId as any);
            await user.save();
            res.send({ 
                success: true, 
                code: 'MSG_SAVED_ADDED', // Código para traducción
                saved: true, 
                message: "Agregado a guardados" 
            });
        }

    } catch (e) {
        console.log(e);
        res.status(500).send({ code: "ERROR_TOGGLE_SAVE" });
    }
};

// GET GUARDADOS
const getMySavedPosts = async (req: RequestExt, res: Response) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId)
            .populate({
                path: 'savedPosts',
                populate: { path: 'author', select: 'firstName email' } 
            });

        if (!user) return res.status(404).send({ code: "USUARIO_NO_ENCONTRADO" });

        res.send(user.savedPosts); // Enviamos array directo para no romper Android

    } catch (e) {
        res.status(500).send({ code: "ERROR_GET_SAVED" });
    }
};

export { toggleSavedPost, getMySavedPosts };