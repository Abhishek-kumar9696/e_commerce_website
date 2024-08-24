// // // config.js

// export const mongodburl = 'mongodb://localhost:27017/ecommerce';
// export const PORT = 6667;
// export const JWT_SECRET = 'akku@11'
// export const STRIPE_SECRET_KEY = 'sk_test_4eC39HqLyjWDarjtT1zdp7dc'; // Ensure this is the correct format



import dotenv from 'dotenv';

dotenv.config();

export const mongodburl = process.env.MONGODB_URL;
export const PORT = process.env.PORT || 6667;
export const JWT_SECRET = process.env.JWT_SECRET;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;


