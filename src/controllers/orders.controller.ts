import { OrderEvent } from './../../node_modules/.prisma/client/index.d';
import { Request,Response } from "express";
import { prismaClient } from "../lib/db";
import Product from "./products.controller";
 

export default class orders{
    public static createOrder =async(req:Request,res:Response)=>{
        //1. to create a transaction
        //2. to list all the cart items and proceed if cart is not empty
        //3. calculate the total amount
        //4. fetch address of user
        //5. to define compute field for formatted addrress module
        //6 we will create a order and order productsorder prosucs
        //7. create event
        //8 to empty the cart
        return await prismaClient.$transaction(async(tx)=>{
            const CartItems =await tx.cartItem.findMany({
                where:{
                    userId:req.user?.id
                },
                include:{
                    product:true
                }
            })
            if(CartItems.length===0){
                return res.json({message:'cart is empty'})
            }
            const price = CartItems.reduce((prev,current)=>{
                return prev + (current.quantity * +current.product.price)
            },0)
            const address = await tx.address.findFirst({
                where:{
                    id:req.user?.defaultShippingAddress as any
                }
            })
            const order = await tx.order.create({
                data:{
                    userId :req.user?.id,
                    netAmmount:price,
                    address:address?.formattedAddress,
                    products:{
                        create:CartItems.map((cart)=>{
                            productId:cart.productId
                            quantity:cart.quantity
                        }) 
                    } 

                }as any
            })
            const orderEvent = await tx.orderEvent.create({
                data:{
                    orderId:order.id,
                }
            })
            await tx.cartItem.deleteMany({
                where:{
                    userId:req.user?.id
                }
            })
            return res.json(order)
        })

    }
    public static listOrders = async(req:Request,res:Response)=>{

    }
    public static cancelOrder = async(req:Request,res:Response)=>{

    }
    public static getOrderById = async(req:Request,res:Response)=>{

    }
}

