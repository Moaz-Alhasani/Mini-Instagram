import { NextFunction, Request, Response } from "express";
import User from "../../../models/user";
import { HTTB_STATUS } from "../../../globals/constants/http";
import bcrybt from 'bcryptjs'
import { generateJwt } from "../../../globals/middlware/vrifyToken";
import { BAD_REQUST_EXCEPTION, NOT_FOUND } from "../../../globals/middlware/error.middlware";
class AuthControllers{
    public async Register(req:Request,res:Response,next:NextFunction){
        const{firstname,lastname,email,password}=req.body;

        const profilePhoto = req.file ? req.file.path : null;
        
        const user=await User.findOne({email});
        if(user){
            res.status(HTTB_STATUS.FORRIDDEN).json({
                message:"User already exist"
            })
        }
        const salt=await bcrybt.genSalt(10)
        const hashpassword=await bcrybt.hash(password,salt)
        const newuser=await User.create({
            firstname,
            lastname,
            profilePhoto,
            email,
            password:hashpassword
        })
        const pyload={
            email,
            firstname,
            lastname,
            _id:newuser.id,
            role:newuser.role
        }
        const token=await generateJwt(pyload)
        return res.status(HTTB_STATUS.OK).json({
            message:"success added",
            data:token
        })
    }
    public async login(req:Request,res:Response,next:NextFunction){
        const{email,password}=req.body;
        const user=await User.findOne({email:email})
        if(!user){
            throw new NOT_FOUND("Email Not found")
        }
        const matchPassword=await bcrybt.compare(password,user.password)
        if(!matchPassword){
            throw new BAD_REQUST_EXCEPTION('Error in password')
        }

        const pyload={email:user.email,id:user._id}
        const token=await generateJwt(pyload);
        return res.status(HTTB_STATUS.OK).json({
            message:"login success",
            data:token
        })
    }

    public async WhoViewedMyProfile(req:Request,res:Response,next:NextFunction){
        const user=await User.findById(req.params.id)
        const userwhoviewd=await User.findById(req.currentuser.id)
        console.log(userwhoviewd)
        if(user && userwhoviewd){
            const IsUserAlreadyViewd=user.viewers.find(viewer=>viewer.toString()===userwhoviewd._id.toJSON())
            if(IsUserAlreadyViewd){
                return  next(new BAD_REQUST_EXCEPTION("You already viewed this page"))
            }
            else{
                user.viewers.push(userwhoviewd._id)
                await user.save()
                return res.status(HTTB_STATUS.OK).json({
                    message:"viewed success",
                })
            }
        }

    }

    public async followingCtrl (req:Request,res:Response,next:NextFunction){
        const userToFollow=await User.findById(req.params.id)
        const userWhoFollow=await User.findById(req.currentuser.id)

        if(userToFollow && userWhoFollow){
            const isUserAlreadyFollowed=userToFollow.followers.find(follower=> follower.toString()===userWhoFollow._id.toString())
            if(isUserAlreadyFollowed){
                return  next(new BAD_REQUST_EXCEPTION("You already follow this page"))
            }

            else {
                userToFollow.followers.push(userWhoFollow._id)
                userWhoFollow.following.push(userToFollow._id)
                await userWhoFollow.save()
                await userToFollow.save()
                return res.status(HTTB_STATUS.OK).json({
                    message:"follow success",
                })
            }
        }
    }


    public async UnfollowingCtrl (req:Request,res:Response,next:NextFunction){
        const userToBeUnFollow=await User.findById(req.params.id)
        const userWhoUnFollow=await User.findById(req.currentuser.id)

        if(userToBeUnFollow && userWhoUnFollow){
            const isUserAlreadyFollowed=userToBeUnFollow.followers.find(Unfollower=> Unfollower.toString()===userWhoUnFollow._id.toString())
            if(isUserAlreadyFollowed){
                return  next(new BAD_REQUST_EXCEPTION("You already follow this page"))
            }

            else {
                userToBeUnFollow.followers=userToBeUnFollow.followers.filter(follower=>follower.toString() 
                !== userWhoUnFollow._id.toString()
                )
                await userToBeUnFollow.save()

                userWhoUnFollow.following=userWhoUnFollow.following.filter(follower=>follower.toString() 
                !== userToBeUnFollow._id.toString()
                )
                await userToBeUnFollow.save() 

                return res.status(HTTB_STATUS.OK).json({
                    message:"Unfollow success",
                })
            }
        }
    }
    public async Blocking(req:Request,res:Response,next:NextFunction){
        const userToBeBlocked=await User.findById(req.params.id)
        const userWhoBlock=await User.findById(req.currentuser.id)
        if(userToBeBlocked && userWhoBlock){
            const isUserAlreadyBlock=userWhoBlock.blocked.find(
                blocked=>blocked.toString()===userToBeBlocked._id.toString()
            )
            if(isUserAlreadyBlock){
                return  next(new BAD_REQUST_EXCEPTION("You already blocked this user"))
            }
            else{
                userWhoBlock.blocked.push(userToBeBlocked._id)
                await userWhoBlock.save()
                return res.status(HTTB_STATUS.OK).json({
                    message:"Blocking success",
                })
            }
        }
    }

    public async UnBlocking(req:Request,res:Response,next:NextFunction){
        const userToBeUnBlocked=await User.findById(req.params.id)
        const userWhoUnBlock=await User.findById(req.currentuser.id)
        if(userToBeUnBlocked && userWhoUnBlock){
            const isUserAlreadyUnBlock=userWhoUnBlock.blocked.find(
                Unblocked=>Unblocked.toString()===userToBeUnBlocked._id.toString()
            )
            if(isUserAlreadyUnBlock){
                return  next(new BAD_REQUST_EXCEPTION("You already unblocked this user"))
            }
            else{
                userWhoUnBlock.blocked=userWhoUnBlock.blocked.filter(blocked=>blocked.toString() !== userToBeUnBlocked._id.toString())
                await userWhoUnBlock.save()
                return res.status(HTTB_STATUS.OK).json({
                    message:"UnBlocking success",
                })
            }
        }
    }
    public async adminblock(req:Request,res:Response,next:NextFunction){
        const userToBeBlocked=await User.findById(req.params.id)
        if(!userToBeBlocked){
            return  next(new BAD_REQUST_EXCEPTION("User not Found"))
        }
        userToBeBlocked.isBlocked=true;
        await userToBeBlocked.save();
        return res.status(HTTB_STATUS.OK).json({
            message:"AdminBlock success",
        })
    }

    public async Unadminblock(req:Request,res:Response,next:NextFunction){
        const userToBeUnBlocked=await User.findById(req.params.id)
        if(!userToBeUnBlocked){
            return  next(new BAD_REQUST_EXCEPTION("User not Found"))
        }
        userToBeUnBlocked.isBlocked=false;
        await userToBeUnBlocked.save();
        return res.status(HTTB_STATUS.OK).json({
            message:"AdminUnBlock success",
        })
    }


}
export const authcontrollers:AuthControllers=new AuthControllers();