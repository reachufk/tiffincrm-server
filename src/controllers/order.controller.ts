
// const socket = require('../../../server');

import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { OrderModel } from "./../models/order.model";



export const createOrder = async (req: Request, res: Response) => {
    try {
        const order = new OrderModel(req.body);
        order.userInfo = res.locals;
        const updatedOrder = await order.save();
        //   socket.ioObject.sockets.in("order").emit("newOrder", savedOrder);
        return res.status(201).json({
            message: 'Order created successfully',
            statusCode: 201,
            order: updatedOrder
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error?.errors || "Somthing went wrong.",
            statusCode: 500,
            data: null
        });
    }
}

export const getCompletedOrders = async (req: Request, res: Response) => {
    try {
        const { pageNo, pageSize, keyword } = req.body
        const query = {
            orderStatus: "completed",
            $or: [
                { orderAddress: { $regex: keyword, $options: 'i' } },
                { orderMode: { $regex: keyword, $options: 'i' } }
            ]
        }
        const totalCount = await OrderModel.countDocuments(query);
        const totalPages = Math.ceil(+totalCount / +pageSize);
        const orders = await OrderModel.find(query)
            .skip((+pageNo - 1) * +pageSize)
            .limit(+pageSize)
            .exec();
        return res.status(200).json({
            message: "Fetched completed orders successfully.",
            statusCode: 200,
            data: {
                orders,
                totalCount,
                totalPages
            }
        })
    } catch (error: any) {
        return res.status(500).json({
            message: error?.errors || "Somthing went wrong.",
            statusCode: 500,
            data: null
        });
    }



}

export const getLatestOrders = async (req: Request, res: Response) => {
    try {
        const orders = await OrderModel.find({ status: "pending" });
        return res.status(200).json({
            message: "Fetched latest orders successfully.",
            statusCode: 200,
            data: orders
        })
    } catch (error: any) {
        return res.status(500).json({
            message: error?.errors || "Somthing went wrong.",
            statusCode: 500,
            data: null
        });
    }
}


