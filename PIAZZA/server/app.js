import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'


const app = express()
const PORT = process.env.PORT || 3000
dotenv.config()

//middleware to parse body
app.use(express.json());
app.use(express.urlencoded({extended: true}));


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
app.use('/api/auth', authRouter)






app.get('/', (req, res)=> {
    res.send("Server Running")
})
app.listen(PORT, ()=> [
    console.log(`Listening to port ${PORT}`)
])