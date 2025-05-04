import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Post Title is required"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"description is required"],
    },
    category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:[true,"Category is required"]
    },
    numViews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"Auther is required"] 
    },
    pohto:{
        type:String,
        required:[true,"pohto is required"],
    }
},{
    timestamps:true
})

const Post = mongoose.model("Post", postSchema);
export default Post;