import express from 'express';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import BlogRoute from './routes/blog.routes.js'
import UserRoute from './routes/user.routes.js'
configDotenv()
const app = express()
const PORT = 4000;

app.use(express.json())

    mongoose.connect(`${process.env.MONGODB_URI}`)
    .then((i) => {
        app.listen(PORT ,() => {
        console.log(`App running: ${i}`);
        console.log(`🚀 App running on http://localhost:${PORT}`);
    });
    })
    .catch((e) => {
        console.log(`Error occured in db connection: ${e}`);
    })

app.use('/api' ,BlogRoute )
app.use('/api' ,UserRoute )

app.get('/', (req, res) => {
    res.send(
        `<h1>Blog working</h1>`
    )
    console.log("Request recevied");
    
})

