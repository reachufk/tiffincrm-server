import { Request, Response } from "express";
import { UserModel } from "../models/user.model";

export const deleteAdmin = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(409).json({
        message: "Email is required.",
        statusCode: 400,
        data: null
      });
    }
    const isExists = await UserModel.findOne({ email });
    if (!isExists) {
      return res.status(201).json({
        message: "Admin does not exists.",
        statusCode: 404,
        data: null
      })
    }
    await isExists.delete();
    return res.status(201).json({
      message: "Admin deleted successfully.",
      statusCode: 200,
      data: null
    })
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error?.errors || 'Something went wrong.',
      statusCode: 500,
      data: null
    });
  }
}

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await UserModel.find({ role: 'admin' });
    return res.status(201).json({
      message: "Admins fetched successfully.",
      statusCode: 200,
      data: admins
    })
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error?.errors || 'Something went wrong.',
      statusCode: 500,
      data: null
    });
  }
}
