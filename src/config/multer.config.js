import multer from "multer";
import path from "path";
import crypto from "crypto";

import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define an absolute path or a path relative to the project root
const UPLOAD_DIR = path.join(__dirname, "..", "..", "public", "uploads"); // Example: project-root/public/uploads

// Ensure the upload directory exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(8, function (err, name) {
      if (err) {
        return cb(err);
      }
      const fn = name.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

const upload = multer({ storage: storage });
export default upload;
