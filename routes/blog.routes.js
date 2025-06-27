import express, { Router } from 'express';
import Blog from '../model/blog.schema.js';
// import blog from '../model/blog.schema';


const router = express.Router();

router.get('/blog', async(req , res) => {
    try{
        const blogs = await Blog.find().populate('author' , 'name , email');
        res.json(blogs);
    }
    catch(err){
        res.status(500).json({error: `${err} : Failed to fetch blogs`})
    }
})

router.post('/blog' , async(req, res) => {
    const {content , title} = req.body;
    if(!title || !content){
        return res.status(400).json({
            error: "Title and content are required"
        })
    }
    try{
        const newBlog = new Blog({
            title,
            content
        })
        await newBlog.save();
        res.status(201).json(newBlog);
    }
    catch(err){
        res.status(500).json({
            error: `Faild to create blog [${err}]`
        })
    }
    

})




export default router;