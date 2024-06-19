import { Router } from "express";
import AuthService from '../controllers/auth.controller';
import { errorHandler } from "../error-handler";


const routes:Router =Router();

routes.post('/signup', errorHandler(AuthService.RegisterUser));
routes.post('/signin',errorHandler(AuthService.LoginUser));
export default routes;
