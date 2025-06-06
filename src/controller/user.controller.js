import cookieParser from "cookie-parser";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

        // Register User
const RegisterUser = asyncHandler(async (req, res) => {
    try {
        const { FirstName, LastName, Email, PhoneNo, Password, Gender, Role } = req.body;
    
        if (!FirstName || !LastName || !Email || !PhoneNo || !Password) {
            res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ Email });
        const existingPhone = await User.findOne({ PhoneNo });
        const existingPassword = await User.findOne({ Password });

        if (existingUser || existingPhone || existingPassword) {
            res.status(400).json({
                message: "User already exists",
            });
        }
    
        const user = await User.create({
            FirstName,
            LastName,
            Email,
            PhoneNo,
            Password,
            Gender,
            Role: Role || "user", // Default role is 'user'
        });
    
        if (!user) {
            res.status(400).json({
                message: "User registration failed",
            })
        }

        const { accessToken, refreshToken } = generateToken(user._id);
    
        if (!accessToken || !refreshToken) {
            res.status(400).json({
                message: "Token generation failed",
            });
        }
    
        res.cookie("jwt", accessToken, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            sameSite: "none",
        });

        res
        .status(201)
        .json( new ApiResponse(201, { user, accessToken }, "User registered successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "User registration failed",
        });
    }
});

        // Login User
const LoginUser = asyncHandler(async (req, res) => {
    try {
        const { Email, Password } = req.body;
    
        if (!Email || !Password) {
            res.status(400).json({
                message: "All fields are required",
            });
        }
    
        const user = await User.findOne({ Email });
    
        if (!user) {    
            res.status(400).json({
                message: "User not found",
            });
        }
    
        const isPasswordMatch = await user.comparePassword(Password);
        if (!isPasswordMatch) {
            res.status(400).json({
                message: "Invalid password",
            });
        }
    
        const { accessToken, refreshToken } = generateToken(user._id);
    
        if (!accessToken || !refreshToken) {
            res.status(400).json({
                message: "Token generation failed",
            });
        }   
    
        res.cookie("jwt", accessToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            secure: true,
            sameSite: "none",
        });

        res
        .status(200)
        .json( new ApiResponse(200, { user, accessToken, refreshToken }, "User logged in successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "User login failed",
        });
    }
});

        // Logout User
const LogoutUser = asyncHandler(async (req, res) => {

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    res
    .status(200)
    .json( new ApiResponse(200, {}, "User logged out successfully"));
});

        // Update user
const UpdateUser = asyncHandler(async (req, res) => {
    try {
        const { FirstName, LastName, Email, PhoneNo, Gender, Date, CountryCode} = req.body;

        if (!FirstName || !LastName || !Email || !PhoneNo) {
            res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ Email, _id: { $ne: req.user._id } });
        const existingPhone = await User.findOne({ PhoneNo, _id: { $ne: req.user._id } });

        if (existingUser) {
            res.status(400).json({
                message: "Email already exists",
            });
        }
        if (existingPhone) {
            res.status(400).json({
                message: "Phone number already exists",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    FirstName,
                    LastName,
                    Email,
                    PhoneNo,
                    Gender,
                    Date,
                    CountryCode
                }
            },
            { new: true, runValidators: true }
        ).select("-password -refreshToken");
        if (!user) {
            res.status(400).json({
                message: "User not found",
            });
        }

        res
        .status(200)
        .json( new ApiResponse(200, { user }, "User updated successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "User update failed",
        });
    }
})


    // Get User
const GetUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        if (!user) {
            res.status(400).json({
                message: "User not found",
            });
        }
        res
        .status(200)
        .json( new ApiResponse(200, { user }, "User found successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "User not found",
        });
    }
})

    // Update user profile image
const UpdateImage = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const file = req.file;

        if (!file) {
            res.status(400).json({
                message: "No file uploaded",
            });
        }

        const result = await cloudinary.uploader.upload(file.path, {
            folder: "ProfileImages",
            width: 500,
            height: 500,
            crop: "fill",
            public_id: `user_${userId}`,
        });

        await fs.unlink(file.path); // Delete the file from the server


        const user = await User.findByIdAndUpdate(
            userId,
            {
                    ProfileImage: result.secure_url,
            },
            { new: true, runValidators: true }
        ).select("-password -refreshToken");
        if (!user) {
            res.status(400).json({
                message: "User not found",
            });
        }

        res
        .status(200)
        .json( new ApiResponse(200, { user }, "Profile image updated successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "User update failed",
        });
    }
})

    // Update password
const UpdatePassword = asyncHandler(async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            res.status(400).json({
                message: "All fields are required",
            });
        }
        if (newPassword !== confirmPassword) {
            res.status(400).json({
                message: "New password and confirm password do not match",
            });
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(400).json({
                message: "User not found",
            });
        }
        const isPasswordMatch = await user.comparePassword(currentPassword);
        if (!isPasswordMatch) {
            res.status(400).json({
                message: "Current password is incorrect",
            });
        }
        user.Password = newPassword;
        await user.save();

        res
        .status(200)
        .json( new ApiResponse(200, { user }, "Password updated successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "Password update failed",
        });
    }
})

    // Become Admin
const BecomeAdmin = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    Role: "admin"
                }
            },
            { new: true, runValidators: true }
        ).select("-password -refreshToken");
        if (!user) {
            res.status(400).json({
                message: "User not found",
            });
        }

        res
        .status(200)
        .json( new ApiResponse(200, { user }, "User updated successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "User update failed",
        });
    }
})

    // become user
const BecomeUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    Role: "user"
                }
            },
            { new: true, runValidators: true }
        ).select("-password -refreshToken");
        if (!user) {
            res.status(400).json({
                message: "User not found",
            });
        }

        res
        .status(200)
        .json( new ApiResponse(200, { user }, "User updated successfully"));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message || "User update failed",
        });
    }
})

export { RegisterUser, LoginUser, LogoutUser, GetUser, UpdateUser, UpdateImage, UpdatePassword, BecomeAdmin, BecomeUser };