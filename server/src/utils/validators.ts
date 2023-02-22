
import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

export const validators = (req: Request, res: Response, next: NextFunction) => {
    body('username').notEmpty();
    body('phoneNumber').isLength({ min: 10, max: 12 });
    body('email').isEmail();
    body('password').isLength({ min: 8 })
    next()
}