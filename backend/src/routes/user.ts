// backend/src/routes/user.ts
import { Router } from "express";
import { checkJwt } from "../middlewares/session";
import { toggleSavedPost, getMySavedPosts } from "../controllers/user.controller";

const router = Router();

// Ruta para ver mis guardados
router.get("/saved", checkJwt, getMySavedPosts);

// Ruta para dar like/guardar (Pasamos el ID del post en la URL)
router.post("/save/:postId", checkJwt, toggleSavedPost);

export { router };