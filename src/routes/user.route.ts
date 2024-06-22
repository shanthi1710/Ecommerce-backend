import { Router } from "express";
import UserService from "../controllers/users.controller"
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";


const routes:Router =Router();

routes.post('/address',[authMiddleware],errorHandler(UserService.addAddress));
routes.delete('/address/:id',[authMiddleware],errorHandler(UserService.deleteAddress));
routes.get('/address',[authMiddleware],errorHandler(UserService.listAddress));
routes.put('/',[authMiddleware],errorHandler(UserService.updateUser));
routes.put('/role/:id',[authMiddleware,adminMiddleware],errorHandler(UserService.changeUserRole));
routes.get('/',[authMiddleware,adminMiddleware],errorHandler(UserService.listUser))
routes.get('/:id',[authMiddleware,adminMiddleware],errorHandler(UserService.getUserById))
export default routes;
    