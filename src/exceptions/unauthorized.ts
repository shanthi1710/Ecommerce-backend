import { httpException } from "./root";

export class UnauthorizedException extends httpException {
    constructor(message: string,errorcode:number,error?:any){
        super(message,errorcode,401,error)
    }
}