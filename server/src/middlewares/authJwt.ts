import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "./../models/user.model";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ') || !authorization.split(' ')[1]) {
      return res.status(403).send({
        message: "please provide the token.",
        statusCode: 400,
        data: null
      });
    }
    const token = authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY as string);
    if (!decodedToken) {
      return res.status(401).send({
        message: "Unauthorized!",
        statusCode: 401,
        data: null
      });
    }
    const { id } = decodedToken as JwtPayload;
    const user = await UserModel.findById(id);
    if (!user || user.status !== 'verified') {
      return res.status(403).send({
        message: "User does not exist",
        statusCode: 404,
        data: null
      });
    }
    const { password, ...rest } = user;
    res.locals = rest;
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error?.errors || "Something went wrong.",
      statusCode: 500,
      data: null
    });
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { role } = res.locals;
  try {
    if (role !== 'admin') {
      return res.status(401).send({
        message: "Unauthorized",
        statusCode: 401,
        data: null
      });
    }
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error?.errors || "Something went wrong.",
      statusCode: 500,
      data: null
    });
  }
};

export const isSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { role } = res.locals;
  try {
    if (role !== 'superAdmin') {
      return res.status(401).send({
        message: "Unauthorized",
        statusCode: 401,
        data: null
      });
    }
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error?.errors || "Something went wrong.",
      statusCode: 500,
      data: null
    });
  }
};