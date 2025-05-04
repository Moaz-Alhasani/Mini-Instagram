import {Request} from 'express'

interface USERPAYLOAD{
    email: string;
    _id: string;
    role:string;
    firstname:string;
    lastname:string;
}

declare global{
    namespace Express{
        interface Request{
            currentuser?:any
        }
    }
}