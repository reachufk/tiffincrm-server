
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model";

export const isAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, mobile } = req.body;
    const exists = await UserModel.findOne({ $or: [{ email }, { mobile }] });
    if (exists) {
      return res.status(409).json({
        message: "User already exists, please try login.",
        statusCode: 409,
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
}

