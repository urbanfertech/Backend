import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  toggleServiceStatus,
  deleteService
} from "../controllers/service.controller.js";
import { allowRoles } from "../middlewares/allowedroles.js";
import { verifyToken } from "../middlewares/verifytoken.js";
const router = express.Router();

//for admin
router.post("/create", verifyToken, allowRoles("ADMIN"),createService);
router.get("/getall", verifyToken,getAllServices);
router.get("/get/:id", verifyToken,getServiceById);
router.patch("/update/:id", verifyToken, allowRoles("ADMIN"),updateService);
router.patch("/:id/status", verifyToken, allowRoles("ADMIN"),toggleServiceStatus);
router.delete("/delete/:id", verifyToken, allowRoles("ADMIN"),deleteService);

export default router;