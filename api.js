import dotenv from 'dotenv';
dotenv.config(); // Make sure to call this BEFORE accessing process.env

const FRONTEND_URI = process.env.FRONTEND_URI;
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

export { FRONTEND_URI, MONGODB_URI, PORT };
