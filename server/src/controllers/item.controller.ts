import { Request, Response } from "express";
import { ItemModel } from "../models/item.model";
import { uploadImageToS3 } from "../utils/aws-utils"

export const createItem = async (req: Request, res: Response) => {
    const { name, image, categoryId, imageType, price, discount } = req.body;
    if (!name?.trim() || !image || !imageType || !categoryId || !price?.trim()) {
        return res.status(409).json({
            message: "All fields are required.",
            statusCode: 400,
            data: null
        });
    }
    try {
        const id: string = `${Date.now()}${Math.random() * 100}`;
        const imageData = {
            id,
            fileType: imageType,
            fileData: Buffer.from(image?.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        }
        const awsImageLocation = await uploadImageToS3(imageData, 'item');
        if (!awsImageLocation) {
            return res.status(500).json({
                message: "Somthing went wrong.",
                statusCode: 500,
                data: null
            });
        }
        const item = new ItemModel({
            _id: id,
            name,
            image: awsImageLocation,
            imageType,
            price,
            discount
        });
        await item.save();
        return res.status(201).json({
            message: "Item created successfully.",
            statusCode: 201,
            data: item
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error?.errors || "Somthing went wrong.",
            statusCode: 500,
            data: null
        });
    }
}

export const getItems = async (req: Request, res: Response) => {
    try {
        const catagories = await ItemModel.find({});
        return res.status(200).json({
            message: "Items fetched successfully.",
            statusCode: 200,
            data: catagories
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error?.errors || "Somthing went wrong.",
            statusCode: 500,
            data: null
        });
    }
}


export const updateItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedItem = await ItemModel.findOneAndUpdate({ _id: id }, req.body);
        if (!updatedItem) {
            return res.status(404).json({
                message: "Item does not exists.",
                statusCode: 404,
                data: null
            });
        }
        return res.status(200).json({
            message: "catagory updated successfully.",
            statusCode: 200,
            data: updatedItem
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error?.errors || "Somthing went wrong.",
            statusCode: 500,
            data: null
        });
    }

}

export const deleteItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedItem = await ItemModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({
                message: "Item does not exists.",
                statusCode: 404,
                data: null
            });
        }
        return res.status(200).json({
            message: "Item deleted successfully.",
            statusCode: 200,
            data: null
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error?.errors || "Somthing went wrong.",
            statusCode: 500,
            data: null
        });
    }
}