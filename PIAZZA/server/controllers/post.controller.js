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



export const updateLikeDislike = async (req, res)=> {
    const action = req.query.action
    const postId = req.params.postId
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
        try {
            const updatedPost = await Post.findByIdAndUpdate(postId, 
                { $inc: { 
                    likes: 1 
                } 
            }, 
            { new: true })
            res.status(200).send(updatedPost)
        } catch (error) {
            res.send(error.message)
        }
    }
    // if query===dislike, update the number of dislikes of the post
    if(action==="dislike") {
        try {
            const updatedPost = await Post.findByIdAndUpdate(postId, 
                { $inc: { 
                    dislikes: 1 
                } 
            }, 
            { new: true })
            res.status(200).send(updatedPost)
        } catch (error) {
            res.send(error.message)
        }
    }
}


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
        res.status(200).send("comment added successfully")
        
    } catch (error) {
        res.send(error.message)
    }

}


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

export const getMostActivePostPerTopic = async (req, res) => {
    const { topic } = req.query;
    if(!topic) {
        return res.status(400).send("A topic is required.")
    }
    try {
        const matchStage = { $match: { topic: topic } } // Filter by specific topic 
            

        const result = await Post.aggregate([
            matchStage, // Filter posts
            {
                $addFields: {
                    engagement: { $add: ['$likes', '$dislikes'] }, // Calculate engagement
                },
            },
            {
                $sort: { engagement: -1 }, // Sort by engagement in descending order
            },
            {
                $group: {
                    _id: topic ? topic : '$topic', // Group by topic or return all topics
                    mostActivePost: { $first: '$$ROOT' }, // Select the most active post
                },
            },
        ]);

        // Respond with the aggregated result directly
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching most active post', error });
    }
}

