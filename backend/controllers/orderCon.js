import orderModel from "../models/orderModel.js";
import userModel from "../models/UserModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//PLACING USER ORDER FROM FRONTEND
const placeOrder = async (req, res) => {
  const front_url = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      address: req.body.address,
    });
    await newOrder.save();

    //clear user cart after placing order
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    //CREATE STRIPE PAYMENT INTENT
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delievery Charges",
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${front_url}/verify?success=true&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${front_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success, sessionId } = req.body;

  try {
    if (!orderId || typeof success === "undefined") {
      return res.json({ success: false, message: "Missing verification data" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (success === "true") {
      if (sessionId) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== "paid") {
          await orderModel.findByIdAndDelete(orderId);
          return res.json({ success: false, message: "Payment not completed" });
        }
      }

      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: "Paid" });
    }

    await orderModel.findByIdAndDelete(orderId);
    return res.json({ success: false, message: "Not Paid" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error" });
  }
};

//USER ORDER FOR FRONTEND:
const userOrders = async (req, res) => {
  try {
    // authMiddleware attaches the authenticated user's id to req.userId
    const userId = req.userId || req.body.userId;
    const orders = await orderModel.find({ userId: userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

//LISTING ORDERS FOR ADMIN PANEL
const listOrders = async (req,res)=>{
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
}

//UPDATE ORDER STATUS
const updateStatus = async (req,res)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    res.json({success:true,message:"Status updated"});
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error updating status"});
  }
}

export { placeOrder, verifyOrder, userOrders , listOrders , updateStatus };
