import { Router } from "express";
import { createOrder, getCompletedOrders, getLatestOrders } from "../controllers/order.controller";
import { isAdmin, verifyToken } from "../middlewares/authJwt";
export const orderRouter: Router = Router();

orderRouter.post('/', createOrder);
orderRouter.post('/completed', verifyToken, isAdmin, getCompletedOrders);
orderRouter.get('/latest', verifyToken, isAdmin, getLatestOrders)
// orderRouter.post('/payment',payment);