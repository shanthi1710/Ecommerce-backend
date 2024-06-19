//message,status code,error codes,error

import { UnauthorizedException } from "./unauthorized";

export class httpException extends Error{
    message: string;
    errorCode:any;
    statusCode:number;
    errors:any;

    constructor(message:string,errorCode:any,statusCode:number,error:any){
        super(message);
        this.message=message;
        this.statusCode=statusCode;
        this.errorCode=errorCode;
        this.errors=error;
    }
}

export enum ErrorCode{
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSABLE_ENTITY =2001,
    INTERNAL_SERVER_ERROR = 3001,
    UnauthorizedException_ERROR =4001,
    PRODUCT_NOT_FOUND = 5001
}