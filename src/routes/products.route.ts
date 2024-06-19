import { Router } from "express";
import Product from "../controllers/products.controller"
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
 
const routes:Router = Router();

routes.post('/',[authMiddleware,adminMiddleware],errorHandler(Product.createProduct))
routes.put('/:id',[authMiddleware,adminMiddleware],errorHandler(Product.updateProduct))
routes.delete('/:id',[authMiddleware,adminMiddleware],errorHandler(Product.deleteProduct))
routes.get('/',[authMiddleware,adminMiddleware],errorHandler(Product.ListProducts))
routes.get('/:id',[authMiddleware,adminMiddleware],errorHandler(Product.getProductsById))
export default routes;