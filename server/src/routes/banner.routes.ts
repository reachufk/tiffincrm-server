import { Router } from "express";
import { isAdmin, verifyToken } from "../middlewares/authJwt";
import { createBanner, deleteBanner, getBanners, updateBanner } from "./../controllers/banner.controller"
export const bannerRouter: Router = Router();

bannerRouter.post('/', verifyToken, isAdmin, createBanner);
bannerRouter.get('/', getBanners);
bannerRouter.put('/:id', verifyToken, isAdmin, updateBanner);
bannerRouter.delete('/:id', verifyToken, isAdmin, deleteBanner);