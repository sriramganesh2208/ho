import express from "express";
import { login, register, registerWithGoogle } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/auth/google/callback", registerWithGoogle); // New route for Google registration
router.post("/login", login);

export default router;
