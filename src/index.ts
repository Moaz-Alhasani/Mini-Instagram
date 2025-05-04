import express,{ Application } from "express";
import Server from "./server";

class Instgram{
    public run():void{
        const app:Application=express()
        const server:Server=new Server(app)
        server.start()
    }
}
export const instgram:Instgram=new Instgram();
instgram.run()