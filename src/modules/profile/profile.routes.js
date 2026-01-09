import { Router } from "express";
import { completeProfile } from "./profile.controller.js";
import auth from '../../middlewares/auth.js';
import { getProfile } from "./profile.controller.js";
import multer from "multer";
import { uploadAvatar } from "./profile.avatar.controller.js";

const router = Router();
const upload = multer(); // memory storage


router.post("/", auth, completeProfile);
router.get("/", auth, getProfile);
router.post("/avatar", auth, upload.single("avatar"), uploadAvatar);



export default router;
