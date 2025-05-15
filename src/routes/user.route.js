import express from "express";
import {
  loginFirebase,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import {
  validateLogIn,
  validateSignUp,
} from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/register", validateSignUp, registerUser);
router.post("/login", validateLogIn, loginUser);
router.post("/loginfirebase", loginFirebase);
router.post("/logout", logoutUser);

export default router;
