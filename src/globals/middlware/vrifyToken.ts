import express, { NextFunction, Request, Response }  from 'express'
import jwt from 'jsonwebtoken'
import { forbiddenExcption, UNAUTHORIZED_Exception } from './error.middlware'
import { USERPAYLOAD } from '../../type'

export function generateJwt(pyload:any){
    return jwt.sign(pyload,process.env.JWT_SECRET!,{expiresIn:'1d'})
}

export function vrefiyUser(req:Request,res:Response,next:NextFunction){
    if (!req.headers['authorization'] || !req.headers['authorization'].startsWith('Bearer')){
        throw new UNAUTHORIZED_Exception('Token is invlaid , please login agin')
    }
    const token=req.headers['authorization'].split(' ')[1]
    try{
        const userDecoded=jwt.verify(token,process.env.JWT_SECRET!) as USERPAYLOAD
        req.currentuser=userDecoded
        next();
    }
    catch(error){
        throw new UNAUTHORIZED_Exception('Token is invlaid , please login agin')
    }
}

export const checkPermission=(...roles:String[])=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const userrole=req.currentuser.role
        if(!userrole || !roles.includes(userrole)){
            throw new forbiddenExcption ('YOU ARE NOT ALLOWED');
        }
        next()
    }
}