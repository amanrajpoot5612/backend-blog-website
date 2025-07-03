import express, { Router } from 'express';
import Blog from '../model/blog.schema.js';
import authMiddleware from '../middleware/Auth.js';
// import blog from '../model/blog.schema';


const router = express.Router();
console.log("📁 blog.route.js loaded");

router.get('/test', (req, res) => {
  res.send("✅ App is receiving new routes");
});

//Find all blogs
router.get('/', async(req , res) => {
    try{
        const blogs = await Blog.find().populate('author' , 'name , email').sort({
            createdAt: -1
        });
        res.json(blogs);
    }
    catch(err){
        res.status(500).json({error: `${err} : Failed to fetch blogs`})
    }
})

//Create new blog
router.post('/' , authMiddleware , async(req, res) => {
    const {content , title} = req.body;
    if(!title || !content){
        return res.status(400).json({
            error: "Title and content are required"
        })
    }
    
    try{
        const newBlog = new Blog({
            title,
            content,
            author: req.user._id
        })
        
    await newBlog.save();

    res.status(201).json({
        message: "Blog saved",
        blog: newBlog
    });
    }

    catch(err){
        res.status(500).json({
            error: `Faild to create blog [${err}]`
        })
    }
    

})


// user specific blog
router.get('/my-blogs' , authMiddleware, async (req, res) => {
    console.log("route entered");
    try {
         console.log("User ID:", req.user._id);
        const blogs = await Blog.find({
        author: req.user._id
        })
           console.log("Blogs found:", blogs);
        return res.status(200).json(blogs);
    } catch (error) {
        return res.status(501).json({
            error: "Can't find blogs"
        })
    }
})


//Fetch single blog
router.get('/:id' ,  async(req, res,) => {
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
router.delete('/:id' , authMiddleware , async(req, res,) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({
                error: "blog can't be fetched"
            })
        }
        else{
            if(blog.author.toString() !== req.user._id.toString()){
                return res.status(403).json({
                    error: "unauthorized access"
                })
            }
            await blog.deleteOne();
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

router.put('/:id' , authMiddleware ,async(req ,res) => {
    const {title , content} = req.body;
    try {
        const blog = await Blog.findById(
            req.params.id
        )

        if(!blog){
            return res.status(404).json({
            error: "Blog can't be fetched"
        })
        }
        if(blog.author.toString() !== req.user._id.toString()){
            return res.status(403).json({
                error : "Unauthorized access"
            })
        }
        blog.title = title
        blog.content = content
        await blog.save();
        res.status(200)
        .json({
            message: "Blog updated successfully",
            blog: blog
        })
        
    } catch (error) {
        res.status(400).json({
            error: "Blog can't be find"
        })
    }
})


export default router;