import { Router } from "express";
import { verifyToken } from "../middlewares/verifytoken.js";
import {
  createGroomerProfile,
  getGroomerProfile,
  updateGroomerProfile,
  uploadDocument,
  getGroomerDocuments,
  addServiceToGroomer,
  updateServicePrice,
  getGroomerServices,
  setAvailability,
  getAvailability,
  updateAvailability,
  deleteAvailability,
  getGroomerBookings,
  getGroomerWallet,
  getGroomerPayouts,
  requestPayout,
  getAllGroomers,
  getGroomerById,
  removeServiceFromGroomer,
} from "../controllers/groomers.controller.js";

const router = Router();

// Public Routes
router.get("/", getAllGroomers);
router.get("/:groomerId", getGroomerById);

// Protected Routes (Groomer Only)
router.post("/onboard", verifyToken, createGroomerProfile);
router.put("/profile", verifyToken, updateGroomerProfile);
router.get("/profile/me", verifyToken, getGroomerProfile);

// Document Management
router.post("/documents/upload", verifyToken, uploadDocument);
router.get("/documents/list", verifyToken, getGroomerDocuments);

// Service Management
router.post("/services/add", verifyToken, addServiceToGroomer);
router.put("/services/:serviceId/pricing", verifyToken, updateServicePrice);
router.get("/services/list", verifyToken, getGroomerServices);
router.delete("/services/:groomerServiceId", verifyToken, removeServiceFromGroomer);

// Availability Management
router.post("/availability/set", verifyToken, setAvailability);
router.get("/availability/list", verifyToken, getAvailability);
router.put("/availability/:availabilityId", verifyToken, updateAvailability);
router.delete("/availability/:availabilityId", verifyToken, deleteAvailability);

// Bookings & Earnings
router.get("/bookings/list", verifyToken, getGroomerBookings);
router.get("/wallet", verifyToken, getGroomerWallet);
router.get("/payouts/list", verifyToken, getGroomerPayouts);
router.post("/payouts/request", verifyToken, requestPayout);

export default router;
