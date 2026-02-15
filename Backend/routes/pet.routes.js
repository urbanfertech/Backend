import { Router } from "express";
import { verifyToken } from "../middlewares/verifytoken.js";
import { AddPet, getPets, updatePet, getPet,deletePet } from "../controllers/pet.controller.js";
const router = Router();

router.post("/addpets", verifyToken, AddPet);
router.get("/getpets", verifyToken, getPets);
router.get("/getpet/:petId", verifyToken, getPet);
router.put("/update-pet/:petId", verifyToken, updatePet);
router.delete("/delete-pet/:petId", verifyToken, deletePet);

export default router;