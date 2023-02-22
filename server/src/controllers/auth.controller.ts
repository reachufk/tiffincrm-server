import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";
import { validationResult } from 'express-validator';
import { sendSMS, verifyOTP } from "../utils/sendSMS";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, mobile, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { msg, param } = errors.array()[0]
    return res.status(400).json({
      message: `${msg} for ${param}`,
      statusCode: 400,
      data: null
    });
  }
  try {
    // await sendSMS(mobile);
    const user = new UserModel({
      username,
      email,
      roles: 'user',
      mobile,
      password: bcrypt.hashSync(password, 10),
    });
    await user.save();
    return res.status(200).json({
      message: "OTP sent to your mobile.",
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

export const verifyUserOTP = async (req: Request, res: Response) => {
  const { otp, mobile } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array(),
        statusCode: 400,
        data: null
      });
    }
    const user = await UserModel.findOne({ mobile });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid mobile number.',
        statusCode: 400,
        data: null
      });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY as string,
      { expiresIn: 86400 });
    if (user.status === 'verified') {
      return res.status(200).json({
        message: "Account already verified.",
        statusCode: 200,
        data: {
          token,
          username: user.username,
          email: user.email,
          roles: user.role,
          mobile: user.mobile
        }
      })
    }
    const valid = await verifyOTP(mobile, otp);
    if (!valid) {
      return res.status(404).json({
        message: 'Invalid or expired OTP, please try again.',
        statusCode: 404,
        data: null
      });
    }
    user.status = 'verified';
    await user.save();
    return res.status(201).json({
      message: "Account registered successfully.",
      statusCode: 201,
      data: {
        token,
        username: user.username,
        email: user.email,
        roles: user.role,
        mobile: user.mobile
      }
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

export const registerAdmin = async (req: Request, res: Response) => {
  const { username, email, mobile, password } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array(),
        statusCode: 400,
        data: null
      });
    }
    await sendSMS(mobile);
    const user = new UserModel({
      username,
      email,
      roles: 'admin',
      mobile,
      password: bcrypt.hashSync(password, 10),
    });
    await user.save();
    return res.status(200).json({
      message: "OTP sent to your mobile.",
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

export const forgetPassword = async (req: Request, res: Response) => {
  const { mobile } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array(),
        statusCode: 400,
        data: null
      });
    }
    const user = await UserModel.findOne({ mobile });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid mobile number.',
        statusCode: 400,
        data: null
      });
    }
    await sendSMS(mobile);
    return res.status(200).json({
      message: "OTP sent to your mobile.",
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

export const verifyForgetPassword = async (req: Request, res: Response) => {
  const { mobile, password, otp } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array(),
        statusCode: 400,
        data: null
      });
    }
    const user = await UserModel.findOne({ mobile });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid mobile number.',
        statusCode: 400,
        data: null
      });
    }
    const valid = await verifyOTP(mobile, otp);
    if (!valid) {
      return res.status(404).json({
        message: 'Invalid or expired OTP, please try again.',
        statusCode: 404,
        data: null
      });
    }
    user.password = bcrypt.hashSync(password, 10);
    await user.save();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY as string,
      { expiresIn: 86400 });
    return res.status(201).json({
      message: "Password changed successfully.",
      statusCode: 200,
      data: {
        token,
        username: user.username,
        email: user.email,
        roles: user.role,
        mobile: user.mobile
      }
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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array(),
      statusCode: 400,
      data: null
    });
  }
  const user = await UserModel.findOne({ email })
  if (!user) {
    return res.status(404).json({
      message: "Email does not exixts, please try register.",
      statusCode: 404,
      data: null
    });
  }
  const isPasswordValid = bcrypt.compareSync(
    password,
    user.password
  );
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid Password.",
      statusCode: 400,
      data: null
    });
  }
  var token = jwt.sign({ id: user.id, email: user.email, roles: user.role }, process.env.SECRET_KEY as string, {
    expiresIn: 86400
  });
  return res.status(400).json({
    message: "Login success.",
    statusCode: 200,
    data: {
      token,
      username: user.username,
      email: user.email,
      roles: user.role,
      mobile: user.mobile,
    }
  });
};