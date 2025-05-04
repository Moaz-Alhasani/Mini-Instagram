import express,{Application, Request, Response,NextFunction} from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import { CustomError, IError } from './globals/middlware/error.middlware';
import { HTTB_STATUS } from './globals/constants/http';
import appRouter from './globals/router/appRouter';
import path from 'path'
import https from 'https'
import fs from 'fs'
class Server{
    private app:Application
    constructor (app:Application){
        this.app=app;
    }
    public start(){
        this.setMiddleware();
        this.setRouter();
        this.setGlobalError();
        this.startServer();
    }
    private setMiddleware(){
        this.app.use(express.json())
        this.app.use('/upload', express.static(path.join(__dirname, '/upload')))
    }
    private setRouter(){
        appRouter(this.app)
    }
    private setGlobalError(){
        this.app.all('*',(req:Request,res:Response)=>{
            res.status(404).json({
                message: `URL ${req.originalUrl} not found`
            })
        })

        this.app.use(((error: IError, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(HTTB_STATUS.INTERNAL_SERVER).json({ message: "Internal Server Error" });
        }) as unknown as express.ErrorRequestHandler);

    }
    private startServer(){

        const options={
            key:fs.readFileSync('./cert/key.pem'),
            cert:fs.readFileSync('./cert/cert.pem')
        }

        const port=parseInt(process.env.PORT!)||5000
        
        mongoose.connect(process.env.MONGOSSES_URL!).then(()=>{
            console.log('connect to DataBase')
        }).catch((err)=>{
            console.log(err)
        })
        
        https.createServer(options,this.app).listen(port, () => {
            console.log(`HTTPS server running🚀 on https://localhost:${port}`);
        });
    }
}

export default Server;