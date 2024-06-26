import { Role } from './../../node_modules/.prisma/client/index.d';
import { Request, Response } from "express";
import { addAddressSchema, updateUserSchema } from "../schema/users";
import { prismaClient } from "../lib/db";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Address } from "@prisma/client";

export default class {
  public static addAddress = async (req: Request, res: Response) => {
    addAddressSchema.parse(req.body);
    const address = await prismaClient.address.create({
      data: {
        ...req.body,
        userId: req.user?.id,
      },
    });
    res.json(address);
  };
  public static deleteAddress = async (req: Request, res: Response) => {
    try {
      await prismaClient.address.delete({
        where: {
          id: +req.params.id,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found.",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    res.json({ message: "Address deleted successfully." });
  };
  public static listAddress = async (req: Request, res: Response) => {
    const addresses = await prismaClient.address.findMany({
      where: {
        userId: req.user?.id,
      },
    });
    res.json(addresses);
  };
  public static updateUser = async (req: Request, res: Response) => {
    const validteData = updateUserSchema.parse(req.body);
    let shippingAddress: Address;
    let billingAddress: Address;
    if (validteData.defaultShippingAddress) {
      try {
        shippingAddress = await prismaClient.address.findFirstOrThrow({
          where: {
            id: validteData.defaultShippingAddress as any,
            userId: req.user?.id,
          },
        });
        if (shippingAddress.userId != req.user?.id) {
          throw new NotFoundException(
            "Address not found.",
            ErrorCode.ADDRESS_NOT_FOUND
          );
        }
      } catch (error) {
        throw new NotFoundException(
          "Address not found.",
          ErrorCode.ADDRESS_NOT_FOUND
        );
      }
    }
    if (validteData.defaultBillingAddress) {
      try {
        billingAddress = await prismaClient.address.findFirstOrThrow({
          where: {
            id: validteData.defaultBillingAddress as any,
            userId: req.user?.id,
          },
        });
        if (billingAddress.userId != req.user?.id) {
          throw new NotFoundException(
            "Address not found.",
            ErrorCode.ADDRESS_NOT_FOUND
          );
        }
      } catch (error) {
        throw new NotFoundException(
          "Address not found.",
          ErrorCode.ADDRESS_NOT_FOUND
        );
      }
      if (billingAddress.userId != req.user?.id) {
        throw new NotFoundException(
          "Address not found.",
          ErrorCode.ADDRESS_NOT_FOUND
        );
      }
    }
    const updatedUser = await prismaClient.user.update({
      where: {
        id: req.user?.id,
      },
      data: {
        ...(validteData as any),
      },
    });
    res.json(updatedUser);
  };
  public static listUser = async (req: Request, res: Response) => {
    const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;
    const users = await prismaClient.user.findMany({
      skip: skip || 0,
      take: 5,
    });
    res.json(users);
  };
  public static getUserById = async (req: Request, res: Response) => {
    const user = await prismaClient.user.findFirst({
      where: {
        id: req.params.id,
      },
      include: {
        adresses: true,
      },
    });
    if (!user) {
      throw new NotFoundException("User not found.", ErrorCode.USER_NOT_FOUND);
    }
    res.json(user);
  };
  public static changeUserRole = async (req: Request, res: Response) => {
    const user = await prismaClient.user.update({
      where: {
        id: req.params.id,
      },
      data:{
        role:req.body.role
      }
      
    });
    if (!user) {
      throw new NotFoundException("User not found.", ErrorCode.USER_NOT_FOUND);
    }
    res.json(user);
  };
}
