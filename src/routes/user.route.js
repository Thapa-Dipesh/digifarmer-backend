import express from "express";
import {
  loginFirebase,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";
import {
  validateLogIn,
  validateSignUp,
} from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/register", validateSignUp, registerUser);
router.post("/login", validateLogIn, loginUser);
router.post("/loginfirebase", loginFirebase);
router.put("/update/:id", updateUser);
router.post("/logout", logoutUser);

export default router;
