import mongoose from "mongoose";

const categoryscheam=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const Category=mongoose.model("Category",categoryscheam)

export default Category