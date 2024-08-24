import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT_SECRET } from "../config.js";
import otpUtils from "../utils/sendOtp.js";
// import { generateOtp, sendOTP } from "../utils/sendOtp.js";
const { generateOtp, sendOTP } = otpUtils;




dotenv.config();


// Register with OTP
const registerWithOtp = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });

    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    const user = await User.create({
      name,
      email,
      password,
      mobile,
      otp,
      otpExpiry
    });

     await sendOTP(mobile, otp);

    res.status(201).json({
      msg: "OTP sent to your mobile number. Please verify to complete registration."
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// Verify OTP and complete registration
const verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;

  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // OTP is correct, complete registration
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '10h' });

    res.status(200).json({
      msg: "Registration complete",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



// Login with OTP
const loginWithOtp = async (req, res) => {
  const { mobile } = req.body;

  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOtp(mobile, otp);

    res.status(200).json({ msg: "OTP sent to your mobile number" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Verify OTP and login
const verifyLoginOtp = async (req, res) => {
  const { mobile, otp } = req.body;

  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // OTP is correct, login
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '10h' });

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export {
  registerWithOtp,
  verifyOtp,
  loginWithOtp,
  verifyLoginOtp
};



// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public



const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token with environment variable

    const token = jwt.sign(
      { email: user.email, userID: user._id },
      JWT_SECRET,
      { expiresIn: "10h" } // Optional: Set token expiration time
    );
    console.log("Token: ", token);

    res.setHeader("Authorization", `Bearer ${token}`);
    // Respond with the token and optionally user info
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password ,isAdmin} = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
      isAdmin
    });

    if (user) {
      console.log(user);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin

const updateUser = async (req, res) => {
  try {
    const user = await user.findById(req.params._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin

const getUsers = async (req, res) => {
  try {
    const users = await user.find({});
    return res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete users
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await user.findById(req.params._id);

    if (user) {
      await user.remove();
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await user.findById(req.params._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  authUser,
  registerUser,
  updateUserProfile,
  getUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};

// import User from '../models/userModel.js';
// import { sendOTP } from '../services/twilioService.js';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';


// // import User from "../models/userModel.js";
//  import generateToken from "../utils/generateToken.js";


//  import dotenv from "dotenv";
//  import { JWT_SECRET } from "../config.js";



// // Function to generate OTP
// const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// // @desc    Register new user with phone number verification
// // @route   POST /api/auth/register
// // @access  Public
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, phoneNumber } = req.body;

//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const otp = generateOTP();

//     const user = await User.create({
//       name,
//       email,
//       password,
//       phoneNumber,
//       otp,  // Save OTP temporarily
//       isVerified: false, // Mark user as unverified
//     });

//     if (user) {
//       await sendOTP(phoneNumber, otp);  // Send OTP to the user
//       return res.status(201).json({ message: 'OTP sent to your phone number' });
//     } else {
//       return res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Verify OTP
// // @route   POST /api/auth/verify-otp
// // @access  Public
// export const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });

//     if (user && user.otp === otp) {
//       user.isVerified = true;
//       user.otp = null;  // Clear OTP after successful verification
//       await user.save();

//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '30d',
//       });

//       return res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         token,
//       });
//     } else {
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Login user with phone number OTP verification
// // @route   POST /api/auth/login
// // @access  Public
// export const authUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//       if (!user.isVerified) {
//         const otp = generateOTP();
//         user.otp = otp;
//         await user.save();

//         await sendOTP(user.phoneNumber, otp);
//         return res.status(401).json({ message: 'OTP sent. Please verify to continue.' });
//       } else {
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//           expiresIn: '30d',
//         });

//         return res.json({
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           phoneNumber: user.phoneNumber,
//           token,
//         });
//       }
//     } else {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
