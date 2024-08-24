// // utils/generateToken.js
// import jwt from 'jsonwebtoken';
// import { JWT_SECRET } from '../config.js';

// //import config from '../config/config.js';

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };

// export default generateToken;


// utils/generateToken.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; // Ensure this path is correct

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
