import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../lib/db";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
export default class AuthService {
  public static RegisterUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      if (!password) {
        throw Error("Password is required and cannot be empty");
      }

      let user = await prismaClient.user.findFirst({ where: { email } });
      if (user) {
        throw Error("User already exists");
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
    } catch (error: any) {
      console.log(error);
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
      console.log(error);
    }
  };
}
