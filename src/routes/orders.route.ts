 
import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import orders from "../controllers/orders.controller";

const router:Router = Router();

router.post('/',[authMiddleware],errorHandler(orders.createOrder))
router.get('/',[authMiddleware],errorHandler(orders.listOrders))
router.put('/:id/cancel',[authMiddleware],errorHandler(orders.cancelOrder))
router.get('/:id',[authMiddleware],errorHandler(orders.getOrderById))
router.get('/index',[authMiddleware,adminMiddleware],errorHandler(orders.listAllOrders))
router.get('/users/:id',[authMiddleware,adminMiddleware],errorHandler(orders.listUserOrders))
router.put('/:id/status',[authMiddleware,adminMiddleware],errorHandler(orders.changeStatus))
router.get('/:id',[authMiddleware],errorHandler(orders.getOrderById))
export default router;
