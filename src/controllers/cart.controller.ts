 
import { Request,Response } from "express";
import { cartItemSchema, changeQuantitySchema } from "../schema/cart";
import { Product } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "../lib/db";

export default class    {
    public static addItemToCart = async(req:Request,res:Response)=>{
        const validateData = cartItemSchema.parse(req.body)
        let product:Product;
        try {
            product = await prismaClient.product.findFirstOrThrow({
                where:{
                    id:validateData.productId
                }
            })
        } catch (error) {
            throw new NotFoundException('Product not found!',ErrorCode.PRODUCT_NOT_FOUND)
        }
        const cart= await prismaClient.cartItem.create({
            data:{
                userId:req.user?.id,
                productId:product.id,
                quantity:validateData.quantity
            } as any
        })
        res.json(cart)
    }
    public static deleteItemFromCart = async(req:Request,res:Response)=>{
        //Check if user is delete its own cart item
        await prismaClient.cartItem.delete({
            where:{
                id:+req.params.id
            }
        })
        res.json(" successfully deleted !")
    }
    public static changeQuantity = async(req:Request,res:Response)=>{
        //Check if user is updating its own cart item
        const validateData = changeQuantitySchema.parse(req.body)

        const updatedCart = await prismaClient.cartItem.update({
            where:{
                id:+req.params.id
            },
            data:{
                quantity:validateData.quantity
            }
        })
        res.json(updatedCart)
    }
    public static getCart = async(req:Request,res:Response)=>{
        const cart = await prismaClient.cartItem.findMany({
            where:{
                userId:req.user?.id
            },
            include:{
                product:true
            }
        })
        res.json(cart)
    }
}