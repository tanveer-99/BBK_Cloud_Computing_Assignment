import { Router } from "express";
import { getAllPosts, uploadPosts, getPostsPerTopic } from "../controllers/post.controller.js";
import { verifyToken } from "../utilities/verifyToken.js";

const router = Router()

router.post('/',verifyToken, uploadPosts)
router.get('/', verifyToken, getAllPosts)
router.get('/posts', verifyToken, getPostsPerTopic)


export default router