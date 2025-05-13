import prima from "../config/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

 const admin = (await import("../config/firebaseConfig.js")).default;

export const registerUser = async (req, res) => {
  const body = req.body;

  try {
    if (!body.email || !body.password || !body.phoneNo) {
      return res.status(400).json({
        message: "These fields are required",
      });
    }

    const existingUser = await prima.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prima.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        phoneNo: body.phoneNo,
        name: body.name,
        provience: body.province,
        city: body.city,
        wardNo: body.wardNo,
        deviceToken: body.deviceToken,
        firebaseToken: body.firebaseToken,
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        phoneNo: user.phoneNo,
        deviceToken: user.deviceToken,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, phoneNo, password } = req.body;

  try {
    if (!email && !phoneNo) {
      return res.status(400).json({
        message: "Login with email or phone number",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await prima.user.findUnique({
      where: {
        OR: [email, phoneNo],
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // generate token for user
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      access_token: `Bearer ${token}`,
      user: {
        id: user.id,
        email: user.email,
        phoneNo: user.phoneNo,
        deviceToken: user.deviceToken,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginFirebase = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Firebase ID token is required",
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, phone_number, name } = decodedToken;

    // Check if user exists in our database
    let user = await prima.user.findFirst({
      where: {
        OR: [{ firebaseUid: uid }, { email: email || "" }],
      },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prima.user.create({
        data: {
          email: email || null,
          phoneNo: phone_number || null,
          name: name || null,
          firebaseUid: uid,
          firebaseToken: idToken,
          // Generate a random password since we won't use it for Firebase auth users
          password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
        },
      });
    } else {
      // Update the user's Firebase token
      user = await prima.user.update({
        where: { id: user.id },
        data: {
          firebaseToken: idToken,
          firebaseUid: uid,
          email: email || user.email,
          phoneNo: phone_number || user.phoneNo,
          name: name || user.name,
        },
      });
    }

    // Generate JWT token for your application
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Firebase login successful",
      access_token: `Bearer ${token}`,
      user: {
        id: user.id,
        email: user.email,
        phoneNo: user.phoneNo,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Firebase login error:", error);
    return res.status(401).json({
      message: "Invalid Firebase token or authentication failed",
      error: error.message,
    });
  }
};
