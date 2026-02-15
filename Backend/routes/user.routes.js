import { Router } from "express";
import { verifyToken } from "../middlewares/verifytoken.js";
import { setPassword, getProfile, updateProfile, deleteProfile } from "../controllers/user.controller.js";
import { allowRoles } from "../middlewares/allowedroles.js";
const router = Router();
router.use(allowRoles("USER"));
router.post("/set-password", verifyToken, setPassword);
router.get("/get-profile", verifyToken, getProfile);
router.put("/update-profile", verifyToken, updateProfile);
router.delete("/delete-profile", verifyToken, deleteProfile);

export default router;