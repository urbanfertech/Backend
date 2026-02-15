import { Router } from "express";
import { verifyToken } from "../middlewares/verifytoken.js";
import { setPassword, getProfile, updateProfile, deleteProfile } from "../controllers/user.controller.js";
const router = Router();

router.post("/set-password", verifyToken, setPassword);
router.get("/get-profile", verifyToken, getProfile);
router.put("/update-profile", verifyToken, updateProfile);
router.delete("/delete-profile", verifyToken, deleteProfile);

export default router;