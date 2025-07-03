import jwt from 'jsonwebtoken';
import User from '../model/user.schema.js';

const authMiddleware = async (req, res, next) => {
    console.log("auth middleware accessed");
    
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            error : "Not logged in"
        })
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("-password")

        if(!user){
            return res.status(401).json({ error: "Invalid token or user not found" });
        }

        req.user = user;

        next()
        console.log("Authenticated User:", req.user);

    }
    catch(error){
            return res.status(401).json({ error: "Invalid or expired token" });
    }
}


export default authMiddleware;