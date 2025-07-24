import express from 'express';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import BlogRoute from './routes/blog.routes.js'
import UserRoute from './routes/user.routes.js'
import cors from 'cors';
import cookieParser from "cookie-parser";
import { FRONTEND_URI , MONGODB_URI , PORT} from './api.js';

configDotenv()

const app = express()

app.use(cors({
    origin: `${FRONTEND_URI}`,  // your frontend URL
    credentials: true
}));
app.use(cookieParser());
app.use(express.json())

mongoose.connect(`${MONGODB_URI}`)
.then((i) => {
    app.listen(PORT ,() => {
    console.log(`App running: ${i}`);
    console.log(`🚀 App running on http://localhost:${PORT}`);
    });
})
.catch((e) => {
    console.log(`Error occured in db connection: ${e}`);
})

app.use('/api/blog' ,BlogRoute )
app.use('/api/user' ,UserRoute )

app.get('/', (req, res) => {
    res.send(
        `<h1>Blog working</h1>`
    )
    console.log("Request recevied");
    
})

app.get('/loaderio-97c0674a53f5902209884eb53e717fcb.txt', (req, res) => {
  res.send('loaderio-97c0674a53f5902209884eb53e717fcb');
});

