import express from 'express'
import { getAllUser, Login, Register } from '../controller/authController.js'

const router = express.Router()

router.post("/register" , Register)
router.post("/login" , Login)
router.get("/get",getAllUser)
export default router;