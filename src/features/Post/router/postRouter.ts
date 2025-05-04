import express from 'express'
import { asyncWapper } from '../../../globals/middlware/error.middlware';
import upload from '../../../globals/constants/multer';
import { checkPermission, vrefiyUser } from '../../../globals/middlware/vrifyToken';
import { postcontrollers } from '../controllers/post.controllers';


const Postrouter=express.Router();
Postrouter.post('/',asyncWapper(postcontrollers.CreatePost))

export default Postrouter