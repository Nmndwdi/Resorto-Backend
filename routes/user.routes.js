import { Router } from "express";
import { register, login, loginPart2, resetPassword, resetPasswordPart2, refreshAccessToken, validateToken, logout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/login").post(login)
router.route("/login-part-2").post(loginPart2)
router.route("/register").post(register)
router.route("/reset-password").post(resetPassword)
router.route("/reset-password-part-2").post(resetPasswordPart2)
router.route("/refresh-access-token").post(refreshAccessToken)
router.route("/validate-token").post(validateToken)
router.route("/logout").post(verifyJWT,logout)

export default router