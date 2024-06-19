import { IGetUserAuthInfoRequest } from './../types/express.d';
import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../lib/db";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { signInSchema, signUpSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

export default class AuthService {
  //register
  public static RegisterUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    signUpSchema.parse(req.body);
    const { firstName, lastName, email, password } = req.body;
    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      next(
        new BadRequestException(
          "User already exists",
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
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
  };
  //login
  public static LoginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    signInSchema.parse(req.body);
    const { email, password } = req.body;
    let user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
      throw new NotFoundException(
        "User does not exists",
        ErrorCode.USER_NOT_FOUND
      );
    }
    if (!compareSync(password, user.password)) {
      throw new BadRequestException(
        "Incorrect password..!",
        ErrorCode.INCORRECT_PASSWORD
      );
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ user, token });
  };
  // return the logged in user
  public static me = async (req:IGetUserAuthInfoRequest, res:Response) => {
    res.json(req.user);
  };
}
