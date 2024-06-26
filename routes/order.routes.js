const express = require("express");
const router = express.Router();
const {
  getAllOwnOrders,
  getOwnOrderById,
  getAllOrders,
  getOrderById
} = require("../controllers/order.controllers");
const {
  validateSession,
  protectAdmin
} = require("../middlewares/auth.middleware");

// Routes
router.use(validateSession);
router.get("/get-all-own-orders", getAllOwnOrders);
router.get("/get-all-own-orders/:id", getOwnOrderById);
router.use(protectAdmin);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);

module.exports = { orderRouter: router };
