import Post from "../models/post.model.js"
import User from "../models/user.model.js"


// Upload a new post api functionalities
export const uploadPosts = async (req,res)=> {
    const {title, topic, messageBody, expirationTime } = req.body
    try {
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
        const post = await newPost.save()
        res.status(200).send(post)
    } catch (error) {
        res.send(error.message)
    }
}


// get all posts api functionalities
export const getAllPosts = async (req, res)=> {
    try {
        const allPosts = await Post.find()
        res.status(200).send(allPosts)
    } catch (error) {
        res.send(error.message)
    }
}


//get posts by topic api functionalities
export const getPostsPerTopic = async (req, res)=> {
    const {topic} = req.query
    //if query parameter is not given
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


// like and dislike update api functionlities
export const updateLikeDislike = async (req, res)=> {
    const action = req.query.action
    const postId = req.params.postId
    try {
        //retrieve the user email with req.user.id, getting from verifyToken
        const user = await User.findOne({_id: req.user.id})
        //find the post to be updated
        const updatingPost = await Post.findOne({_id:postId})
        //check if the user himself wants to like or dislike his own post
        if(user.email === updatingPost.owner.email) {
            return res.status(400).send("You cannot like or dislike your own post")
        }
        //check the expired status of the post
        if(updatingPost.status === "Expired") {
            return res.status(400).send("You cannot like/dislike an expired post.")
        }
        // if query===like, update the number of likes of the post
        if(action==="like") {
            const updatedPost = await Post.findByIdAndUpdate(postId, 
                { $inc: { 
                    likes: 1 
                } 
            }, 
            { new: true })
            res.status(200).send(updatedPost)   
        }
        // if query===dislike, update the number of dislikes of the post
        if(action==="dislike") {
            const updatedPost = await Post.findByIdAndUpdate(postId, 
                { $inc: { 
                    dislikes: 1 
                } 
            }, 
            { new: true })
            res.status(200).send(updatedPost)
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}


// put a comment on a post api functionalities
export const updateComment = async (req, res) => {
    const postId = req.params.postId
    const {commentBody} = req.body
    try {
        //retrieve the user email and username with req.user.id, getting from verifyToken
        const user = await User.findOne({_id: req.user.id})
        //check the expired status of the post
        const updatingPost = await Post.findOne({_id:postId})
        if (!updatingPost) {
            return res.status(404).json('Post not found.');
        }
        if(updatingPost.status === "Expired") {
            return res.status(400).send("You cannot comment on an expired post.")
        }
        //check if the comment box is empty or not
        if (!commentBody || !commentBody.match(/^(?!\s$).+/)) {
            return res.status(400).send("Empty comment box is not allowed.");
        }
        //create the new comment oject
        const newComment = {
            commenterUsername: user.username,
            commentText : commentBody
        }
        // Add the comment to the comments array
        updatingPost.comments.push(newComment);
        // Save the updated post
        await updatingPost.save();
        res.status(200).send(updatingPost)
        
    } catch (error) {
        res.send(error.message)
    }

}


// get all the expired post api
export const getExpiredPosts = async(req, res) => {
    const query = req.query.topic
    try {
        const expiredPosts = await Post.find({topic:query, status:'Expired'})
        if(!expiredPosts) {
            return res.status(400).send("No posts expired")
        }
        res.status(200).send(expiredPosts)
    } catch (error) {
        res.send(error.message)
    }
}


// get the post with the most likes and dislikes api
export const getMostActivePostPerTopic = async (req, res) => {
    const { topic } = req.query;
    if(!topic) {
        return res.status(400).send("A topic is required.")
    }
    try {
        // Filter by specific topic
        const matchStage = { $match: { topic: topic } }  
        // Filter posts
        const result = await Post.aggregate([
            matchStage, 
            {
                $addFields: {
                    engagement: { $add: ['$likes', '$dislikes'] }, 
                },
            },
            {
                $sort: { engagement: -1 }, 
            },
            {
                $group: {
                    _id: topic ? topic : '$topic', // 
                    mostActivePost: { $first: '$$ROOT' },
                },
            },
        ]);

        // Respond with the aggregated result directly
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching most active post', error });
    }
}

