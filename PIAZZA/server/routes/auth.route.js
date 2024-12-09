import { Router } from "express";
import { deleteUser, signIn, signUp } from "../controllers/auth.controller.js";
import { verifyToken } from "../utilities/verifyToken.js";

const router = Router()

router.get('/', verifyToken, (req,res)=> {
    res.send("Auth API working")
})
router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/delete', deleteUser)

export default router