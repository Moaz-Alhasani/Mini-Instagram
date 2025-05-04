import express from 'express'
import { asyncWapper } from '../../../globals/middlware/error.middlware';
import { authcontrollers } from '../controllers/authControllers';
import upload from '../../../globals/constants/multer';
import { checkPermission, vrefiyUser } from '../../../globals/middlware/vrifyToken';


const userrouter=express.Router();
userrouter.post('/register',upload.single('profilePhoto'),asyncWapper(authcontrollers.Register))
userrouter.post('/login',asyncWapper(authcontrollers.login))
userrouter.get('/profileviewed/:id',vrefiyUser,asyncWapper(authcontrollers.WhoViewedMyProfile))
userrouter.get('/following/:id',vrefiyUser,asyncWapper(authcontrollers.followingCtrl))
userrouter.get('/unfollowing/:id',vrefiyUser,asyncWapper(authcontrollers.UnfollowingCtrl))
userrouter.get('/block/:id',vrefiyUser,asyncWapper(authcontrollers.Blocking))
userrouter.get('/Unblock/:id',vrefiyUser,asyncWapper(authcontrollers.UnBlocking))
userrouter.get('/admin-block/:id',vrefiyUser,checkPermission("Admin"),asyncWapper(authcontrollers.adminblock))
userrouter.get('/admin-unblock/:id',vrefiyUser,checkPermission("Admin"),asyncWapper(authcontrollers.Unadminblock))

export default userrouter