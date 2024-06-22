 
import { Request, Response } from "express";
import { prismaClient } from "../lib/db";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export default class Product {
  public static createProduct = async (req: Request, res: Response) => {
    const product = await prismaClient.product.create({
      data: {
        ...req.body,
        tags: req.body.tags.join(","),
      },
    });
    res.json(product);
  };
  public static updateProduct = async (req: Request, res: Response) => {
    try {
      const product = req.body;
      if (product.tags) {
        product.tags = product.tags.join(",");
      }
      const updateProduct = await prismaClient.product.update({
        where: {
          id: +req.params.id,
        },
        data: product,
      });
      res.json(updateProduct);
    } catch (error) {
      throw new NotFoundException(
        "Product not found..!",
        ErrorCode.PRODUCT_NOT_FOUND
      );
    }
  };
  public static deleteProduct = async (req: Request, res: Response) => {
    try {
      const deleteProduct = await prismaClient.product.delete({
        where: {
          id: +req.params.id,
        },
      });
      res
        .send({ message: "Product deleted successfully..!", deleteProduct })
        .json(deleteProduct);
    } catch (error) {
      throw new NotFoundException(
        "Product not found..!",
        ErrorCode.PRODUCT_NOT_FOUND
      );
    }
  };
  public static ListProducts = async (req: Request, res: Response) => {
    const count = await prismaClient.product.count();
    const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;

    const products = await prismaClient.product.findMany({
      skip: skip,
      take: 5,
    });
    res.json({
      count,
      products,
    });
  };
  public static getProductsById = async (req: Request, res: Response) => {
    try {
      const product = await prismaClient.product.findUnique({
        where: {
          id: +req.params.id,
        },
      });
      res.json(product);
    } catch (error) {
      throw new NotFoundException(
        "Product not found..!",
        ErrorCode.PRODUCT_NOT_FOUND
      );
    }
  };
  public static searchProducts = async (req: Request, res: Response) => {
     try {
      const product = await prismaClient.product.findMany({
        where:{
          name:{
            search:req.query.q?.toString()
          },
          description:{
            search:req.query.q?.toString()
          },
          tags:{
            search:req.query.q?.toString()
          }
        }
      })
      res.json(product);
     } catch (error) {
      console.log(error)
     }
     
  };
}
