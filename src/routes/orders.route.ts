 
import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import orders from "../controllers/orders.controller";

const router:Router = Router();

router.post('/',[authMiddleware],errorHandler(orders.createOrder))
router.get('/',[authMiddleware],errorHandler(orders.listOrders))
router.put('/:id/cancel',[authMiddleware],errorHandler(orders.cancelOrder))
router.get('/:id',[authMiddleware],errorHandler(orders.getOrderById))

export default router;
