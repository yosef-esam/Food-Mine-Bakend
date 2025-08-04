import { Router } from "express";
import handler from "express-async-handler";
import authenticateToken from "../middleware/auth.mid.js";
import { OrderModel } from "../models/order.model.js";
import { UserModel } from "../models/user.model.js";
import { mailSender } from "../config/mail.config.js";

const router = Router();
router.use(authenticateToken);

router.post(
  "/create",
  handler(async (req, res) => {
    const order = req.body;
    if (order.items.length <= 0) res.status(400).send("Cart Is Empty");
    await OrderModel.deleteOne({
      user: req.user.id,
      status: "new",
    });
    const newOrder = new OrderModel({ ...order, user: req.user.id });
    await newOrder.save();
    res.send(newOrder);
  })
);
router.put(
  "/pay",
  handler(async (req, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) return res.status(404).send("Order Not Found");
    order.paymentId = paymentId;
    order.status = "paid";
    await order.save();

    mailSender(order);
    res.send(order._id);
  })
);
router.get(
  "/track/:orderId",
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);
    const filter = {
      _id: orderId,
    };
    if (user && !user.isAdmin) {
      filter.user = user._id;
    }

    const order = await OrderModel.findOne(filter);
    if (!order) return res.status(401).send();
    res.send(order);
  })
);
router.get(
  "/newOrderForCurrentUser",
  handler(async (req, res) => {
    const order = await getNewOrderForCurrentUser(req);

    if (order) {
      res.send(order);
    } else res.status(404).send();
  })
);

router.get(
  "/getAllStatus",
  handler(async (req, res) => {
    const allStatus = await ["new", "paid", "shipped", "canceled"];
    res.send(allStatus);
  })
);

router.get(
  "/:status?",
  handler(async (req, res) => {
    const status = req.params.status;
    const user = await UserModel.findById(req.user.id);
    const filter = {};
    if (!user.isAdmin) filter.user = user._id;
    if (status) filter.status = status;
    const orders = await OrderModel.find(filter).sort("-createdAt");
    res.send(orders);
  })
);

const getNewOrderForCurrentUser = async (req) => {
  return await OrderModel.findOne({
    user: req.user.id,
    status: "new",
  }).populate("user");
};

export default router;
