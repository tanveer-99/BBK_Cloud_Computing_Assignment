import jwt from "jsonwebtoken";

// validate the user with the access_token from cookies
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    //if no token found, then not allowd to do any action
    if(!token) {
        return res.status(401).send("Unauthorized!")
    }
    jwt.verify(token, process.env.JWT_TOKEN, (error, user)=> {
        if(error) {
            return res.status(401).send("Unauthorized!")
        }
        req.user = user
        next()
    })
}
