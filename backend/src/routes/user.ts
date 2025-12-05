import { Router } from "express";
import { checkJwt } from "../middlewares/session";
import { toggleSavedPost, getMySavedPosts } from "../controllers/user.controller";

const router = Router();

router.get("/saved", checkJwt, getMySavedPosts);

router.post("/save/:postId", checkJwt, toggleSavedPost);

export { router };