import { NextFunction, Request, Response } from "express";
import User from "../../../models/user";
import { HTTB_STATUS } from "../../../globals/constants/http";
import bcrybt from 'bcryptjs'
import { generateJwt } from "../../../globals/middlware/vrifyToken";
import { BAD_REQUST_EXCEPTION, NOT_FOUND } from "../../../globals/middlware/error.middlware"; 
import Post from "../../../models/posts";


class PostControllers{
    public async CreatePost(req:Request,res:Response,next:NextFunction){
        const {title,description}=req.body;
        const author = await User.findById(req.currentuser.id);
        
        if (!author) {
            return res.status(404).json({ message: "Author not found." });
        }

        const postCreated = await Post.create({
            title,
            description,
            user: author._id
        });

        author.posts.push(postCreated.id);
        await author.save();

        return res.status(HTTB_STATUS.OK).json({
            message:"create success",
        })
    }
    
}

export const  postcontrollers:PostControllers=new PostControllers(); 