import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'

export const signUp = async (req, res)=> {
    const {username, email, password} = req.body

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
        res.send(error)
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

    } catch (error) {
        
    }
}

export const deleteUser = async (req, res)=> {
    
}