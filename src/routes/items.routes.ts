import { Router } from "express";
import { createItem, deleteItem, getItems, updateItem } from "../controllers/item.controller";
import { isAdmin, verifyToken } from "../middlewares/authJwt";

export const itemRouter: Router = Router();

itemRouter.post('/', verifyToken, isAdmin, createItem);
itemRouter.get('/', getItems);
itemRouter.put('/:id', verifyToken, isAdmin, updateItem);
itemRouter.delete('/:id', verifyToken, isAdmin, deleteItem);