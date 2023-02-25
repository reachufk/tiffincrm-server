import { Router } from "express";
import { isAdmin, verifyToken } from "../middlewares/authJwt";
import { createCategory, getCategories, updateCategory, deleteCategory } from "./../controllers/category.controller"

export const categoryRouter: Router = Router();

categoryRouter.post('/', verifyToken, isAdmin, createCategory);
categoryRouter.get('/', getCategories);
categoryRouter.put('/:id', verifyToken, isAdmin, updateCategory);
categoryRouter.delete('/:id', verifyToken, isAdmin, deleteCategory);