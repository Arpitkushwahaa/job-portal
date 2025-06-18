import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        let cloudResponse;
        if (file) {
            const fileUri = getDataUri(file);
            if (fileUri) {
                cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    resource_type: "auto"
                });
            }
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: cloudResponse?.secure_url || "",
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        const cookieOptions = {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/'
        };

        // For development environment, use less strict settings
        if (process.env.NODE_ENV === 'development') {
            cookieOptions.sameSite = 'Lax';
            cookieOptions.secure = false;
        }

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, cookieOptions).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        const cookieOptions = {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/'
        };

        if (process.env.NODE_ENV === 'development') {
            cookieOptions.sameSite = 'Lax';
            cookieOptions.secure = false;
        }

        return res.status(200).cookie("token", "", cookieOptions).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Handle profile photo upload
        if (req.files && req.files.profilePhoto) {
            const profilePhoto = req.files.profilePhoto[0];
            const fileUri = getDataUri(profilePhoto);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "auto"
            });
            user.profile.profilePhoto = cloudResponse.secure_url;
        }

        // Handle resume upload
        if (req.files && req.files.resume) {
            const resume = req.files.resume[0];
            const fileUri = getDataUri(resume);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "auto"
            });
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = resume.originalname;
        }

        // Update other profile fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) {
            user.profile.skills = skills.split(",");
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred while updating the profile." });
    }
};
