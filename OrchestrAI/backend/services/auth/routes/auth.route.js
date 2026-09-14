import { login, logOut } from "../controllers/auth.controller.js"
import express from "express"

const router = express.Router()

router.post("/login",login)
router.get("/logout",logOut)
export default router