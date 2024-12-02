import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000


import authRouter from './routes/auth.route.js'
app.use('/api/auth', authRouter)








app.get('/', (req, res)=> {
    res.send("Server Running")
})
app.listen(PORT, ()=> [
    console.log(`Listening to port ${PORT}`)
])