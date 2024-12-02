import { Router } from "express";
import { deleteUser, signIn, signUp } from "../controllers/auth.controller.js";

const router = Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/delete', deleteUser)

export default router