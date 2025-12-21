import { Router } from "express";
import { completeProfile } from "./profile.controller.js";
import auth from '../../middlewares/auth.js';
import { getProfile } from "./profile.controller.js";

const router = Router();

router.post("/", auth, completeProfile);
router.get("/", auth, getProfile);


export default router;
