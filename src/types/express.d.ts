import { User } from "@prisma/client";
import express from 'express';
import { Request } from "express"
export interface IGetUserAuthInfoRequest extends Request {
  user: string  
}
declare module 'express' {
    export interface Request {
        user?: User;
    }
}