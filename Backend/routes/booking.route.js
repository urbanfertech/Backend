import { Router } from "express";
import { verifyToken } from "../middlewares/verifytoken.js";
import { createBooking , updateBooking, cancelBooking, getBookingsByPet, getMyBookings} from "../controllers/booking.controller.js";
import { allowRoles } from "../middlewares/allowedroles.js";
const router = Router();

router.post("/create-booking", verifyToken, allowRoles("USER"), createBooking);

router.patch("/update/:id", verifyToken, allowRoles("USER"), updateBooking);

router.patch("/cancel/:id", verifyToken, allowRoles("USER"), cancelBooking);

router.get("/pet/:petId", verifyToken, allowRoles("USER"), getBookingsByPet);

router.get("/my", verifyToken, allowRoles("USER"), getMyBookings);
export default router