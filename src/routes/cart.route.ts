import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import Cart from "../controllers/cart.controller";


const router:Router=Router();

router.post('/',[authMiddleware],errorHandler(Cart.addItemToCart))
router.get('/',[authMiddleware],errorHandler(Cart.getCart))
router.delete('/:id',[authMiddleware],errorHandler(Cart.deleteItemFromCart))
router.put('/:id',[authMiddleware],errorHandler(Cart.changeQuantity))

export default router