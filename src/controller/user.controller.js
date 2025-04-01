import cookieParser from "cookie-parser";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

        // Register User
const RegisterUser = asyncHandler(async (req, res) => {
    try {
        const { FirstName, LastName, Email, PhoneNo, Password, Date, Gender } = req.body;
    
        if (!FirstName || !LastName || !Email || !PhoneNo || !Password) {
            throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({ Email });
        const existingPhone = await User.findOne({ PhoneNo });
        const existingPassword = await User.findOne({ Password });

        if (existingUser || existingPhone || existingPassword) {
            throw new Error("User already exists");
        }   

    
        const user = await User.create({
            FirstName,
            LastName,
            Email,
            PhoneNo,
            Password,
            Date,
            Gender
        });
    
        if (!user) {
            throw new Error("User registration failed");
        }

        const { accessToken, refreshToken } = generateToken(user._id);
    
        if (!accessToken || !refreshToken) {
            throw new Error("Token generation failed");
        }
    
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res
        .status(201)
        .json( new ApiResponse(201, { user }, "User registered successfully"));
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message || "User registration failed");
    }
});

        // Login User
const LoginUser = asyncHandler(async (req, res) => {
    try {
        const { Email, Password } = req.body;
    
        if (!Email || !Password) {
            throw new Error("All fields are required");
        }
    
        const user = await User.findOne({ Email });
    
        if (!user) {    
            throw new Error("User not found");
        }
    
        const isPasswordMatch = await user.comparePassword(Password);
        if (!isPasswordMatch) {
            throw new Error("Invalid password");
        }
    
        const { accessToken, refreshToken } = generateToken(user._id);
    
        if (!accessToken || !refreshToken) {
            throw new Error("Token generation failed");
        }   
    
        res.cookie("jwt", refreshToken, {
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
        throw new Error(error.message || "User login failed");
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

export { RegisterUser, LoginUser, LogoutUser };