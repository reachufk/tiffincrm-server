import { Router } from "express";
import { isAlreadyExists } from "./../middlewares/verifySignUp";
import { registerUser, registerAdmin, login, verifyUserOTP, forgetPassword, verifyForgetPassword } from "./../controllers/auth.controller"
import { body } from 'express-validator';
export const authRouter: Router = Router();

authRouter.post('/register/user', [
  body('username').notEmpty(),
  body('mobile').isLength({ min: 10, max: 13 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], isAlreadyExists, registerUser);

authRouter.post('/verify-otp', [
  body('otp').isLength({ min: 6, max: 6 }),
  body('mobile').isLength({ min: 10, max: 13 }),
], verifyUserOTP);

authRouter.post('/register/admin', [
  body('username').notEmpty(),
  body('mobile').isLength({ min: 10, max: 12 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], isAlreadyExists, registerAdmin);

authRouter.post('/forget-password', [
  body('mobile').isLength({ min: 10, max: 13 }),
], forgetPassword);

authRouter.post('/forget-password/verify-otp', [
  body('otp').isLength({ min: 6, max: 6 }),
  body('password').isLength({ min: 8 }),
  body('mobile').isLength({ min: 10, max: 13 }),
], verifyForgetPassword);

authRouter.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], login);
