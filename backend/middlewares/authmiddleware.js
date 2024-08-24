import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { JWT_SECRET } from "../config.js";
import dotenv from "dotenv";

dotenv.config();

const protect = async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1]; // Extract the token from the 'Bearer' scheme
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Decode the user ID from the token and attach it to req.user
      req.user = await User.findById(decoded.userID).select("-password");

      // Call the next middleware
      next();
    });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Not authorized, token verification failed" });
  }
};

const Admin = (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({ message: "Not authorized as an admin" });
    }
  } catch (error) {
    res
      .status(401)
      .json({ message: "Not authorized, token verification failed" });
  }
};
export { protect, Admin };



// const isAdmin = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   let token;

//   // Check if the authorization header exists and starts with 'Bearer'
//   if (authHeader && authHeader.startsWith('Bearer')) {
//     // Extract the token from the 'Bearer' scheme
//     token = authHeader.split(' ')[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token provided' });
//   }

//   try {
//     // Verify the token
//     jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Invalid token' });
//       }

//       // Decode the user ID from the token and attach it to req.user
//       req.user = await User.findById(decoded.userID).select('-password');

//       // Check if the user exists and is an admin
//       if (req.user && req.user.isAdmin) {
//         next();
//       } else {
//         res.status(401).json({ message: 'Not authorized as an admin' });
//       }
//     });
//   } catch (error) {
//     res.status(401).json({ message: 'Not authorized, token verification failed' });
//   }
// };

