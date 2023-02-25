import { Request, Response } from "express";
import { BannerModel } from "../models/banner.model";
import { uploadImageToS3 } from "../utils/aws-utils"

export const createBanner = async (req: Request, res: Response) => {
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
      fileType: imageType,
      fileData: Buffer.from(image?.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    }
    const awsImageLocation = await uploadImageToS3(imageData, 'banner');
    if (!awsImageLocation) {
      return res.status(500).json({
        message: "Somthing went wrong.",
        statusCode: 500,
        data: null
      });
    }
    const banner = new BannerModel({
      _id: id,
      name,
      image: awsImageLocation,
      imageType
    });
    await banner.save();
    return res.status(201).json({
      message: "Banner created successfully.",
      statusCode: 201,
      data: banner
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.errors || "Somthing went wrong.",
      statusCode: 500,
      data: null
    });
  }
}

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await BannerModel.find({});
    return res.status(200).json({
      message: "Banners fetched successfully.",
      statusCode: 200,
      data: banners
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.errors || "Somthing went wrong.",
      statusCode: 500,
      data: null
    });
  }
}


export const updateBanner = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedBanner = await BannerModel.findOneAndUpdate({ _id: id }, req.body);
    if (!updatedBanner) {
      return res.status(404).json({
        message: "Banner does not exists.",
        statusCode: 404,
        data: null
      });
    }
    return res.status(200).json({
      message: "Banner updated successfully.",
      statusCode: 200,
      data: updatedBanner
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.errors || "Somthing went wrong.",
      statusCode: 500,
      data: null
    });
  }

}

export const deleteBanner = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedBanner = await BannerModel.findByIdAndDelete(id);
    if (!deletedBanner) {
      return res.status(404).json({
        message: "Banner does not exists.",
        statusCode: 404,
        data: null
      });
    }
    return res.status(200).json({
      message: "Banner deleted successfully.",
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