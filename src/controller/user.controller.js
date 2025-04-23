import cookieParser from "cookie-parser";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import ApiError from "../utils/ApiError.js";

        // Register User
const RegisterUser = asyncHandler(async (req, res) => {
    try {
        const { FirstName, LastName, Email, PhoneNo, Password, Gender } = req.body;
    
        if (!FirstName || !LastName || !Email || !PhoneNo || !Password) {
            throw new ApiError("All fields are required");
        }

        const existingUser = await User.findOne({ Email });
        const existingPhone = await User.findOne({ PhoneNo });
        const existingPassword = await User.findOne({ Password });

        if (existingUser || existingPhone || existingPassword) {
            throw new ApiError("User already exists");
        }
    
        const user = await User.create({
            FirstName,
            LastName,
            Email,
            PhoneNo,
            Password,
            Gender
        });
    
        if (!user) {
            throw new ApiError("User registration failed");
        }

        const { accessToken, refreshToken } = generateToken(user._id);
    
        if (!accessToken || !refreshToken) {
            throw new ApiError("Token generation failed");
        }
    
        res.cookie("jwt", accessToken, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            sameSite: "strict",
        });

        res
        .status(201)
        .json( new ApiResponse(201, { user }, "User registered successfully"));
    } catch (error) {
        console.log(error.message);
        throw new ApiError(error.message || "User registration failed");
    }
});

        // Login User
const LoginUser = asyncHandler(async (req, res) => {
    try {
        const { Email, Password } = req.body;
    
        if (!Email || !Password) {
            throw new ApiError("All fields are required");
        }
    
        const user = await User.findOne({ Email });
    
        if (!user) {    
            throw new ApiError("User not found");
        }
    
        const isPasswordMatch = await user.comparePassword(Password);
        if (!isPasswordMatch) {
            throw new ApiError("Invalid password");
        }
    
        const { accessToken, refreshToken } = generateToken(user._id);
    
        if (!accessToken || !refreshToken) {
            throw new ApiError("Token generation failed");
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
        throw new ApiError(error.message || "User login failed");
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
            throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({ Email, _id: { $ne: req.user._id } });
        const existingPhone = await User.findOne({ PhoneNo, _id: { $ne: req.user._id } });

        if (existingUser) {
            throw new Error("Email already exists");
        }
        if (existingPhone) {
            throw new Error("Phone number already exists");
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
            throw new Error("User not found");
        }

        res
        .status(200)
        .json( new ApiResponse(200, { user }, "User updated successfully"));
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message || "User update failed");
    }
})


    // Get User
const GetUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        if (!user) {
            throw new Error("User not found");
        }
        res
        .status(200)
        .json( new ApiResponse(200, { user }, "User found successfully"));
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message || "User not found");
    }
})

export { RegisterUser, LoginUser, LogoutUser, GetUser, UpdateUser };