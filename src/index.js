import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import routes
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";

// Use routes
app.use("/api/v1/auth", userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on PORT :${port}`);
});
