import { Request, Response } from "express";
import { CatagoryModel } from "../models/category.model";
import { uploadImageToS3 } from "./../utils/aws-utils"

export const createCategory = async (req: Request, res: Response) => {
    const { name, image, imageType } = req.body;
    if (!name?.trim() || !image || !imageType) {
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
            fileType: imageType?.split('/')[1],
            fileData: Buffer.from(image?.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        }
        const awsImageLocation = await uploadImageToS3(imageData, 'category');
        if (!awsImageLocation) {
            return res.status(500).json({
                message: "Somthing went wrong.",
                statusCode: 500,
                data: null
            });
        }
        const catagory = new CatagoryModel({
            _id: id,
            name,
            image: awsImageLocation,
            imageType
        });
        await catagory.save();
        return res.status(201).json({
            message: "Category created successfully.",
            statusCode: 201,
            data: catagory
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error?.errors || "Somthing went wrong.",
            statusCode: 500,
            data: null
        });
    }
}

export const getCategories = async (req: Request, res: Response) => {
    try {
        const catagories = await CatagoryModel.find({});
        return res.status(200).json({
            message: "Categories fetched successfully.",
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


export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { image, imageType } = req.body;
    try {
        if (image?.includes('base64')) {
            const imageData = {
                id,
                fileType: imageType?.split('/')[1],
                fileData: Buffer.from(image?.replace(/^data:image\/\w+;base64,/, ""), 'base64')
            }
            const awsImageLocation = await uploadImageToS3(imageData, 'category');
            req.body = { ...req.body, image: awsImageLocation };
        }
        const updatedCatagory = await CatagoryModel.findOneAndUpdate({ _id: id }, req.body);
        if (!updatedCatagory) {
            return res.status(404).json({
                message: "Catagory does not exists.",
                statusCode: 404,
                data: null
            });
        }
        return res.status(200).json({
            message: "Catagory updated successfully.",
            statusCode: 200,
            data: updatedCatagory
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error?.errors || "Somthing went wrong.",
            statusCode: 500,
            data: null
        });
    }

}

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedCatagory = await CatagoryModel.findByIdAndDelete(id);
        if (!deletedCatagory) {
            return res.status(404).json({
                message: "Catagory does not exists.",
                statusCode: 404,
                data: null
            });
        }
        return res.status(200).json({
            message: "Catagory deleted successfully.",
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