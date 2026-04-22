import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder,userOrders,listOrders,updateStatus } from "../controllers/orderCon.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/userOrders",authMiddleware,userOrders)
orderRouter.get("/list",listOrders)
orderRouter.post("/update",updateStatus)
export default orderRouter;
