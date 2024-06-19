import { Router } from "express";
import AuthService from '../controllers/auth.controller';
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";


const routes:Router =Router();

routes.post('/signup', errorHandler(AuthService.RegisterUser));
routes.post('/signin',errorHandler(AuthService.LoginUser));
routes.get('/me',authMiddleware, errorHandler(AuthService.me));
export default routes;
