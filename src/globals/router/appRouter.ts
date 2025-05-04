import express, { Application } from 'express'
import userrouter from '../../features/User/router/userRouter'


const appRouter=(app:Application)=>{
    app.use('/api/v1/user',userrouter)
}
export default appRouter