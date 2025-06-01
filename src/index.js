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
import postRoutes from "./routes/post.route.js";

// Use routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/posts", postRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on PORT :${port}`);
});
