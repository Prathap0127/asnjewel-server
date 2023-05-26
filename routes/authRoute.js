import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  loginController,
  registerController,
  protectController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllUsers,
} from "../controllers/AuthControllers.js";
import {
  allProductOrderController,
  orderStatusController,
} from "../controllers/ProductController.js";

const router = express.Router();

//routes

//Register User
router.post("/register", registerController);
//login post
router.post("/login", loginController);

//forgot password

router.post("/forgot-password", forgotPasswordController);

//protected User route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected admin route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile

router.put("/profile", requireSignIn, updateProfileController);

//get orders

router.get("/get-orders", requireSignIn, getOrdersController);

//get all orders

router.get("/all-orders", requireSignIn, isAdmin, allProductOrderController);

//change order status

router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

//get all user
router.get("/all-users", requireSignIn, isAdmin, getAllUsers);

export default router;
