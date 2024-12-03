import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import "./utilities/cron.js"; 



const app = express()
dotenv.config()
const PORT = process.env.PORT

//middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

// connect to mongoDB with mongoose
mongoose.connect(process.env.MONGO)
.then(()=> {
    console.log("connected to MongoDB")
})
.catch((error)=> {
    console.log(error)
})

// routes
import authRouter from './routes/auth.route.js'
import postRouter from './routes/post.route.js'
app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)






app.get('/', (req, res)=> {
    res.send("Server Running")
})
app.listen(PORT, ()=> [
    console.log(`Listening to port ${PORT}`)
])