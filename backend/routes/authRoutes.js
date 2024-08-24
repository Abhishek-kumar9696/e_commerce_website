import express from 'express';
import { authUser, registerUser } from '../controllers/authController.js';
import { registerWithOtp,verifyOtp,verifyLoginOtp,loginWithOtp } from '../controllers/authController.js';


const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);

router.post("/register/otp", registerWithOtp);
router.post("/register/verify-otp", verifyOtp);
router.post("/login/otp", loginWithOtp);
router.post("/login/verify-otp", verifyLoginOtp);


export default router;
