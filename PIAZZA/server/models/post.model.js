import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        topic: {
            type: [String],
            required: true,
            enum: ['Politics', 'Health', 'Sport', 'Tech'],
        },
        messageBody: {
            type: String,
            required: true
        },
        expirationTime: { 
            type: String, //how many minutes it should be 'LIVE': a number 
            required: true 
        },
        status: { 
            type: String, 
            enum: ["Live", "Expired"], 
            default: "Live" 
        },
        owner: { 
            name: { 
                type: String, 
                required: true
            },
            email: { 
                type: String,
                required: true
            }
        },
        likes: { 
            type: Number, 
            default: 0 
        },
        dislikes: { 
            type: Number, 
            default: 0 
        },
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model('Post', postSchema)
export default Post

