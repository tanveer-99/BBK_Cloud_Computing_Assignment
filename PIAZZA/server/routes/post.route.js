import { Router } from "express";
import { getAllPosts, uploadPosts } from "../controllers/post.controller.js";
import { verifyToken } from "../utilities/verifyToken.js";

const router = Router()

router.post('/',verifyToken, uploadPosts)
router.get('/', getAllPosts)


export default router