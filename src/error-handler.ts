import { Request,Response,NextFunction } from "express"
import { ErrorCode, httpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-exception"
import { ZodError } from "zod"
import { BadRequestException } from "./exceptions/bad-requests"

export const errorHandler = (method:Function)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try{
            await method(req,res,next)
        }catch(error:any){
            let exception : httpException;
            if(error instanceof httpException){
                exception = error;
            }else{
                if(error instanceof ZodError)
                {
                    exception = new BadRequestException("Unprocessable Entity",ErrorCode.UNPROCESSABLE_ENTITY);
                }else{
                    exception = new InternalException('Something went wrong!',error,ErrorCode.INTERNAL_SERVER_ERROR)
                }
            }
            next(exception)
        }
    }
}