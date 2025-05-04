import mongoose from "mongoose";
import Post from "./posts";
const userSchema =new  mongoose.Schema({
    firstname:{
        type:String,
        required:[true,"FristName is requried"]
    },
    lastname:{
        type:String,
        required:[true,"Last Name is requried"]
    },
    profilePhoto:{
        type:String,
        required:[true,"profilePhoto is requried"]
    },
    email:{
        type:String,
        required:[true,"email is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    postcount:{
        type:Number,
        default:0
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['Admin',"Guest","Editor"],
        default:'User'
    },
    viewers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User' 
        }
    ],
    posts:[
        {   
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post' 
        }
    ],
    blocked:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    plan:[{
        type:String,
        enum:['Free','Premium','Pro'],
        default:'Free'
    }],
    userAward:{
        type:String,
        enum:['Broze',"Silver","Glod"],
        default:"Broze"
    }
},
{
    timestamps:true,
    toJSON:{virtuals:true}
}
)

userSchema.pre("findOne",async  function(next){
    const userId = (this as any)._conditions_._id;
    const posts= await Post.find({user:userId})
    const lastPost =posts[posts.length -1]
    const lastPostDate=new Date (lastPost.createdAt)
    const lastpostDatestr=lastPostDate.toDateString();
    
    userSchema.virtual("lastPostDate").get(function(){
        return lastpostDatestr
    })
    const currectDate=new Date();
    const diff = currectDate.getTime() - lastPostDate.getTime();
    const diffInDays=diff / (1000 * 3600 *24)
    if(diffInDays >30){
        userSchema.virtual("IsInactive").get(function(){
            return true
        })
    }
    else{
        userSchema.virtual("IsInactive").get(function(){
            return false
        })
    }

    await User.findByIdAndUpdate(userId,{
            isBlocked:false
        },
        {
            new :true
        }
    )

    const daysAgo=Math.floor(diffInDays);
    userSchema.virtual("lastActive").get(function (){
        if (daysAgo <=0){
            return "Today"
        }
        if(daysAgo === 1 ){
            return "Yesterday"
        }
        if(daysAgo >1){
            return `${daysAgo} days ago `
        }
    })

    const numberOfPost=posts.length;
    if(numberOfPost <10){
        await User.findByIdAndUpdate(
            userId,
            {
                userAward:"Bronz"
            },{
                new:true
            }
        )
    }
    if(numberOfPost >20){
        await User.findByIdAndUpdate(
            userId,
            {
                userAward:"Silver"
            },{
                new:true
            }
        )
    }
    if(numberOfPost >30){
        await User.findByIdAndUpdate(
            userId,
            {
                userAward:"Glod"
            },{
                new:true
            }
        )
    }

    next();
})



userSchema.virtual("fullname").get(function(){
    return  `${this.firstname} ${this.lastname}`
})
userSchema.virtual("intials").get(function(){
    return  `${this.firstname[0]} ${this.lastname[0]}`
})
userSchema.virtual("postCounts").get(function(){
    return  this.posts.length
})
userSchema.virtual("followersCount").get(function(){
    return  this.followers.length
})
userSchema.virtual("followingCount").get(function(){
    return  this.following.length
})

const User = mongoose.model("User", userSchema);
export default User;