import prima from "../config/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
  const firebaseToken = process.env.FIREBASE_TOKEN;
  try {
    if (!firebaseToken) {
      return res.status(400).json({
        message: "Firebase token is required",
      });
    }
    const user = await prima.user.findUnique({
      where: {
        firebaseToken,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
