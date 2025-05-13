import express from "express";
import {
  loginFirebase,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/loginfirebase", loginFirebase);
router.post("/logout", logoutUser);

export default router;
