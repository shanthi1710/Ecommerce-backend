import { Request, Response } from "express";
import { prismaClient } from "../lib/db";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export default class orders {
  public static createOrder = async (req: Request, res: Response) => {
    //1. to create a transaction
    //2. to list all the cart items and proceed if cart is not empty
    //3. calculate the total amount
    //4. fetch address of user
    //5. to define compute field for formatted addrress module
    //6 we will create a order and order productsorder prosucs
    //7. create event
    //8 to empty the cart
    return await prismaClient.$transaction(async (tx) => {
      // Step 1: List all the cart items and proceed if cart is not empty
      const CartItems = await tx.cartItem.findMany({
        where: {
          userId: req.user?.id,
        },
        include: {
          product: true,
        },
      });

      if (CartItems.length === 0) {
        return res.json({ message: "Cart is empty" });
      }

      // Step 2: Calculate the total amount
      const totalPrice = CartItems.reduce((prev, current) => {
        return prev + current.quantity * current.product.price.toNumber();
      }, 0);

      // Step 3: Fetch address of user
      const address = await tx.address.findFirst({
        where: {
          id: req.user?.defaultShippingAddress as any,
        },
      });

      if (!address) {
        return res
          .status(400)
          .json({ message: "Default shipping address not found" });
      }

      // Step 4: Create an order and order products
      const order = await tx.order.create({
        data: {
          userId: req.user?.id,
          netAmount: totalPrice,
          address: `${address.lineOne}, ${address.lineTwo}, ${address.city}, ${address.state}, ${address.country} - ${address.pincode}`,
          products: {
            create: CartItems.map((cart) => ({
              productId: cart.productId,
              quantity: cart.quantity,
            })),
          },
        } as any,
      });

      // Step 5: Create order event
      const orderEvent = await tx.orderEvent.create({
        data: {
          orderId: order.id,
        },
      });

      // Step 6: Empty the cart
      await tx.cartItem.deleteMany({
        where: {
          userId: req.user?.id,
        },
      });

      return res.json(order);
    });
  };
  public static listOrders = async (req: Request, res: Response) => {
    const orders = await prismaClient.order.findMany({
      where: {
        userId: req.user?.id,
      },
    });
    res.json(orders);
  };
  public static cancelOrder = async (req: Request, res: Response) => {
    // 1. wrap it inside tranaction
    // 2. check  if the users is cancelling its own order
    try {
      const order = await prismaClient.order.update({
        where: {
          id: +req.params.id,
        },
        data: {
          status: "CANCELLED",
        }  
      });
      await prismaClient.orderEvent.create({
        data: {
          orderId: order.id,
          status: "CANCELLED",
        },
      });
      res.status(200).json(order);
    } catch (error) {
      throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
    }
  };
  public static getOrderById = async (req: Request, res: Response) => {
    try {
      const order = await prismaClient.order.findFirstOrThrow({
        where: {
          id: +req.params.id,
        },
        include: {
          products: true,
          event: true,
        },
      });
      res.json(order);
    } catch (error) {
      throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
    }
  };
}
