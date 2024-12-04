import Post from "../models/post.model.js"
import User from "../models/user.model.js"

export const uploadPosts = async (req,res)=> {
    const {title, topic, messageBody, expirationTime } = req.body
    //retrieve the user email and username with req.user.id, getting from verifyToken
    const user = await User.findOne({_id: req.user.id})
    //create a new post with the Post model
    const newPost = new Post({
        title,
        topic,
        messageBody,
        expirationTime: new Date(Date.now() +  expirationTime*60*1000), // 2 min from now
        owner: { 
            name: user.username, 
            email: user.email 
        },
    });
    //save the post in the database
    try {
        const post = await newPost.save()
        res.status(200).send(post)
    } catch (error) {
        res.send(error.message)
    }
    

}

export const getAllPosts = async ()=> {

}


// const newPost = new Post({
//     title: "The Impact of Technology on Society",
//     topics: ["Tech", "Health"],
//     messageBody: "This post discusses the impact of technology on modern society.",
//     expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
//     owner: { name: "John Doe", email: "john.doe@example.com" },
// });