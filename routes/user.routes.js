import express from 'express'
import User from '../model/user.schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import authMiddleware from '../middleware/Auth.js';

const router = express.Router();

// user register route
router.post('/register', async(req, res) => {
    const {name , username , email , password} = req.body;

    try {
        if (!name || !username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({
            error: "User already exists"
        })
        }

        const hashedPassword =  await bcrypt.hash(password , 10);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        })

        await newUser.save();
        
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie(
            "token" , token , {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true,             // ✅ only on HTTPS (Render uses HTTPS)
                sameSite: "None",
        });
        
        res.status(201).json({
            message: "user registered successfully"
        })
    } catch (error) {
        res.status(500).json({
            error: "Server error while registering user"
        })
    }
})

// user login route
router.post('/login' , async(req, res) => {
    const {email , password} = req.body;

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                error: "Invalid credentials"
            })
        }
        
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({
                error: "Invalid password"
            })
        }
        
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })

        console.log("token generate");
        
        res.cookie(
            "token" , token , {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true,             // ✅ only on HTTPS (Render uses HTTPS)
                sameSite: "None",
        });
        res.status(200).json({
            message: "login successful",
            user: {_id: user._id , name: user.name , email: user.email , username: user.username}
        })

        console.log("response send");
        

        
    } catch (error) {
        res.status(500).json({
            error: "login failed"
        })
    }
})


router.get('/profile' , authMiddleware , async(req , res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        res.json(
            {
                user
            }
        )

    } catch (error) {
         res.status(500).json({ error: 'Failed to fetch user profile' });
    }
})

router.post('/logout' , authMiddleware , async (req, res) => {
    try {
        res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
  });
  res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(501).json({
            error: "can't logout"
        })
    }
})

export default router