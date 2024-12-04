import { Router } from "express";
import { getAllPosts, uploadPosts, getPostsPerTopic,updateLikeDislike, updateComment, getExpiredPosts, getMostActivePostPerTopic } from "../controllers/post.controller.js";
import { verifyToken } from "../utilities/verifyToken.js";

const router = Router()

router.post('/',verifyToken, uploadPosts)
router.get('/', verifyToken, getAllPosts)
router.get('/posts', verifyToken, getPostsPerTopic)
router.put('/posts/:postId', verifyToken, updateLikeDislike)
router.put('/posts/:postId/comment', verifyToken, updateComment)
router.get('/posts/expired', verifyToken, getExpiredPosts)
router.get('/posts/most-active', verifyToken, getMostActivePostPerTopic)

export default router