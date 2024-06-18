import { Router } from "express";
import AuthService from '../controllers/auth.controller';


const routes:Router =Router();

routes.post('/signup', AuthService.RegisterUser);
routes.post('/signin',AuthService.LoginUser);
export default routes;
