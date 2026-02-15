import { Router } from "express";
import { signup,login,googleLogin,googleCallback } from "../controllers/accounts.controller.js";
const router = Router();


router.post("/signup",signup);
router.post("/login",login);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);




export default router;
