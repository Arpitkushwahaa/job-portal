import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Something is missing", success: false });
    }

    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(400).json({ message: "Incorrect email or password.", success: false });
    }

    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password.", success: false });
    }

    if (role !== userDoc.role) {
      return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
    }

    // 1) sign token
    const token = jwt.sign(
      { userId: userDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 2) cookie options
    const cookieOptions = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax",              // dev default
    };
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure   = true;
      cookieOptions.sameSite = "none";  // lowercase!
    }

    // 3) send cookie + response
    const payloadUser = {
      _id: userDoc._id,
      fullname: userDoc.fullname,
      email: userDoc.email,
      phoneNumber: userDoc.phoneNumber,
      role: userDoc.role,
      profile: userDoc.profile,
    };

    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        message: `Welcome back ${userDoc.fullname}`,
        user: payloadUser,
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
