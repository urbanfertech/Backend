import { Router } from "express";
import { verifyToken } from "../middlewares/verifytoken.js";
import { searchServices, searchGroomers} from "../controllers/search.controller.js";
const router = Router();
//adding search
router.get("/services", searchServices);
router.get("/groomers", searchGroomers);
export default router;