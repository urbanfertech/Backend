import { Router } from "express";
import { verifyToken } from "../middlewares/verifytoken.js";
import { AddPet, getPets, updatePet, getPet,deletePet } from "../controllers/pet.controller.js";
import { allowRoles } from "../middlewares/allowedroles.js";
const router = Router();
// router.use(allowRoles("USER"));
router.post("/addpets", verifyToken, allowRoles("USER"),AddPet);
router.get("/getpets", verifyToken, allowRoles("USER"),getPets);
router.get("/getpet/:petId", verifyToken, allowRoles("USER"),getPet);
router.put("/update-pet/:petId", verifyToken, allowRoles("USER"),updatePet);
router.delete("/delete-pet/:petId", verifyToken, allowRoles("USER"),deletePet);

export default router;