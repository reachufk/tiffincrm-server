import { Router } from "express";
import { deleteAdmin, getAdmins} from "../controllers/admin.controller"
import { isSuperAdmin, verifyToken } from "../middlewares/authJwt";
 
export const adminRouter: Router = Router();

adminRouter.get('/', verifyToken, isSuperAdmin, getAdmins);
adminRouter.delete('/id', verifyToken, isSuperAdmin, deleteAdmin);
