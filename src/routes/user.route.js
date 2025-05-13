import express from "express";
import {
  loginFirebase,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/loginfirebase").post(loginFirebase);

export default router;
