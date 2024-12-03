import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res)=> {
    const { username, email, password } = req.body
    // use bcryptjs to hash the user password with a salt
    const salt = bcryptjs.genSaltSync(10)
    const hashedpassword = bcryptjs.hashSync(password, salt)

    // create new user with the user model
    const newUser = new User({
        username,
        email,
        password: hashedpassword
    })
    // upload to mongodb
    try {
        const user = await newUser.save()
        res.status(200).send(user)
    } catch (error) {
        res.send(error.message)
    }
}


export const signIn = async (req, res)=> {
    const {email, password} = req.body

    try {
        // find the user with the email in the database
        const validUser = await User.findOne({email})
        if(!validUser) {
            return res.status(404).send("Invalid Credentials.")
        }
        // compare the user password with the hashed password
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword) {
            return res.status(404).send("Invalid Credentials.")
        }
        // create a JWT token and store it in the cookie
        const token = jwt.sign({id: validUser._id}, process.env.JWT_TOKEN)
        // send user information without password
        const { password: pass, ...rest } = validUser._doc
        // store the access_token in the cookie
        res.status(200).cookie('access_token', token, {httpOnly: true}).json("Sign in Successful")
    } catch (error) {
        
    }
}

export const deleteUser = async (req, res)=> {
    
}