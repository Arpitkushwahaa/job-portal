import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profile = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
      profile = myCloud.secure_url;
    }

    const user = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile,
    });

    return res.status(201).json({ message: "User registered successfully", user, success: true });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGIN
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

    const token = jwt.sign({ userId: userDoc._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax",
    };
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "none";
    }

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

// LOGOUT
export const logout = async (req, res) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "lax",
      })
      .status(200)
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { fullname, phoneNumber } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    user.fullname = fullname || user.fullname;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
      user.profile = myCloud.secure_url;
    }

    await user.save();

    return res.status(200).json({ message: "Profile updated", user, success: true });
  } catch (error) {
    console.error("Update Profile error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
