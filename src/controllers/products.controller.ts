import { Request,Response } from "express";
import { prismaClient } from "../lib/db";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export default class Product{
    public static createProduct = async(req:Request,res:Response)=>{
        
        const product = await prismaClient.product.create({
            data:{
                ...req.body,
                tags:req.body.tags.join(',')
            }
        })
        res.json(product)
    } 
    public static updateProduct = async(req:Request,res:Response)=>{
        try {
            const product = req.body;
            if(product.tags){
                product.tags = product.tags.join(',')
            }
            const updateProduct = await prismaClient.product.update({
                where:{
                    id:+req.params.id
                },
                data:product 
            })
            res.json(updateProduct)
        } catch (error) {
            throw new NotFoundException('Product not found..!',ErrorCode.PRODUCT_NOT_FOUND)
        }
    }
    public static deleteProduct = async(req:Request,res:Response)=>{

    }
    public static ListProducts = async(req:Request,res:Response)=>{
        
    }
    public static getProductsById = async(req:Request,res:Response)=>{
        
    }
}

 