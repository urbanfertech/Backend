import { Router } from "express";
import { signup,login,googleLogin,googleCallback,setPassword } from "../controllers/accounts.controller.js";
const router = Router();
import { verifyToken } from "../middlewares/verifytoken.js";

router.post("/signup",signup);
router.post("/login",login);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

router.post("/set-password", verifyToken, setPassword);


export default router;
