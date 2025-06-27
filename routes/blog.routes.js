import express, { Router } from 'express';
import Blog from '../model/blog.schema.js';
// import blog from '../model/blog.schema';


const router = express.Router();

//Find all blogs
router.get('/', async(req , res) => {
    try{
        const blogs = await Blog.find().populate('author' , 'name , email');
        res.json(blogs);
    }
    catch(err){
        res.status(500).json({error: `${err} : Failed to fetch blogs`})
    }
})

//Create new blog
router.post('/' , async(req, res) => {
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

//Fetch single blog
router.get('/:id' , async(req, res,) => {
    try{
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({
                error: "blog can't be fetched"
            })
        }
        else{
            res.json(blog)
        }
    }
    catch(err){
        res.status(500).json({
            error: "Blog can't be accessed"
        })
    }
    
})

//Delete a blog
router.delete('/:id' , async(req, res,) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if(!blog){
            return res.status(404).json({
                error: "blog can't be fetched"
            })
        }
        else{
            res.json({
                message: "Blog deleted",
                id: req.params.id
            })
        }
    } catch (error) {
        res.status(500).json({
            error: "Unable to delete blog"
        })
    }
})

//Edit blog

router.put('/:id' ,async(req ,res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id)
        if(!blog){
            res.status(400).json({
            error: "Blog can't be fetched"
        })
        }
        
    } catch (error) {
        res.status(400).json({
            error: "Blog can't be find"
        })
    }
})


export default router;