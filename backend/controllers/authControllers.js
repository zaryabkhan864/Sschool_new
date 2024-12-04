import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
// import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
// import { delete_file, upload_file } from "../utils/cloudinary.js";
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import APIFilters from "../utils/apiFilters.js";


// Register a user  =>  /api/v1/register
// Register a user  =>  /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const accountExist = await User.findOne({ email });
    if (accountExist) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    try {
        // Create a new user
        const user = new User({
            name,
            email,
            password,
            role
        });

        // Save the user
        await user.save();

        // Send success response
        res.status(200).json({
            message: "User registered successfully",
            user
        });
    } catch (err) {
        // Handle any errors during saving
        console.error("Error saving user:", err);
        res.status(500).json({
            message: "Something went wrong",
            error: err.message
        });
    }
});


// Read all User List  =>  /api/v1/users
export const getUsers = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 8;
    const apiFilters = new APIFilters(User, req.query).search().filters();
    try {
        let users = await apiFilters.query;
        let filteredUsersCount = users.length;
        apiFilters.pagination(resPerPage);
        users = await apiFilters.query.clone();
        res.status(200).json({
            resPerPage,
            filteredUsersCount,
            users,
        });
    } catch (error) {
        next(new ErrorHandler(error.message || "Failed to fetch users", 500));
    }
})

//Update User  =>  /api/v1/user/:id
export const UpdateUser = catchAsyncErrors(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };
    const updatedUser = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true
    })
    res.status(200).json({
        updatedUser
    })
})

// Delete User  =>  /api/v1/user/:id
export const deleteUser = catchAsyncErrors(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    await user.deleteOne();
    res.status(200).json({
        message: "User deleted successfully"
    })
})

// Read User Details  =>  /api/v1/user/:id
export const getUserDetails = catchAsyncErrors(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    res.status(200).json({
        user
    })
})

// Login User  =>  /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res)
})

// Logout User  =>  /api/v1/logout
export const logout = catchAsyncErrors(async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        message: "Logged Out",
    });
})

// Forgot password   =>  /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    // Find user in the database
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    // Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "ShopIT Password Recovery",
            message,
        });

        res.status(200).json({
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return next(new ErrorHandler(error?.message, 500));
    }
});

// Reset password   =>  /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hash the URL Token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Password reset token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords does not match", 400));
    }

    // Set the new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});
// Update Password  =>  /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id).select("+password");

    // Check the previous user password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 400));
    }

    user.password = req.body.password;
    user.save();

    res.status(200).json({
        success: true,
    });
});

// Get current user profile  =>  /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id);

    res.status(200).json({
        user,
    });
});

