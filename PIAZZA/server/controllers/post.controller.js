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



export const getAllPosts = async (req, res)=> {
    try {
        const allPosts = await Post.find()
        res.status(200).send(allPosts)
    } catch (error) {
        res.send(error.message)
    }
}



export const getPostsPerTopic = async (req, res)=> {
    const {topic} = req.query
    //if query parameter is not written
    if(!topic) {
        return res.status(400).send("Topic query parameter is required.")
    }
    try {
        const postsPerTopic = await Post.find({topic})
        //if no posts found or query value not written correctly
        if (postsPerTopic.length === 0) {
            return res.status(404).json(`No posts found for topic: ${topic}`);
        }
        res.status(200).send(postsPerTopic)
    } catch (error) {
        res.send(error.message)
    }
}


// const newPost = new Post({
//     title: "The Impact of Technology on Society",
//     topics: ["Tech", "Health"],
//     messageBody: "This post discusses the impact of technology on modern society.",
//     expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
//     owner: { name: "John Doe", email: "john.doe@example.com" },
// });