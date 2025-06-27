import express from 'express'

const router = express.Router();

router.get('/user' , async(req , res) => {
    res.send("User route achieved")
})

export default router