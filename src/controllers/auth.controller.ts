import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../lib/db";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { signUpSchema } from "../schema/users"; 
export default class AuthService {
  public static RegisterUser = async (
    req: Request,
    res: Response, 
    next: NextFunction
  ) => {
    try {
      signUpSchema.parse(req.body);
      const { firstName, lastName, email, password } = req.body;
      if (!password) {
        throw Error("Password is required and cannot be empty");
      }

      let user = await prismaClient.user.findFirst({ where: { email } });
      if (user) {
        next(new BadRequestException("User already exists",ErrorCode.USER_ALREADY_EXISTS))
      }

      user = await prismaClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashSync(password, 10),
        },
      });
      res.json(user);
    } catch (err: any) {
      next(new UnprocessableEntity(err?.issues,'Unprocessable entity',ErrorCode.UNPROCESSABLE_ENTITY))
    }
  };

  public static LoginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;

      if (!password) {
        throw Error("Password is required and cannot be empty");
      }
      let user = await prismaClient.user.findFirst({ where: { email } });
      if (!user) {
        throw Error("User does not exists");
      }
      if (!compareSync(password, user.password)) {
        throw Error("Incorrect password..!");
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({user,token})
    } catch (error: any) {
      next(error);
    }
  };
}
