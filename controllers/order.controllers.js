// Import Models
const { Order } = require("../models/order.model");
const { Cart } = require("../models/cart.model");
const { Product } = require("../models/product.model");
const { User } = require("../models/user.model");
const { AppError } = require("../utils/appError");

// Get all the orders

const getAllOrders = async (req, res, next) => {
  const orders = await Order.findAll({
    include: [
      {
        model: Cart,
        include: [
          { model: Product, through: { where: { status: "purchased" } } }
        ]
      },
      { model: User, attributes: { exclude: ["password", "passwordConfirm"] } }
    ]
  });

  res.status(200).json({
    status: "success",
    data: {
      orders
    }
  });
};

// Get order by id

const getOrderById = async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { status: "active", id },
    include: [
      {
        model: Cart,
        include: [
          { model: Product, through: { where: { status: "purchased" } } }
        ]
      },
      { model: User, attributes: { exclude: ["password", "passwordConfirm"] } }
    ]
  });

  if (!order) {
    return next(new AppError(404, "No order found with that Id"));
  }

  res.status(200).json({
    status: "success",
    data: {
      order
    }
  });
};

// Get all own orders

const getAllOwnOrders = async (req, res, next) => {
  const { currentUser } = req;

  const orders = await Order.findAll({
    where: { userId: currentUser.id },
    include: [
      {
        model: Cart,
        include: [
          { model: Product, through: { where: { status: "purchased" } } }
        ]
      }
    ]
  });

  res.status(200).json({
    status: "success",
    data: {
      orders
    }
  });
};

// Get all own orders by id

const getOwnOrderById = async (req, res, next) => {
  const { id } = req.params;

  const { currentUser } = req;

  const order = await Order.findOne({
    where: { id },
    include: [
      {
        model: Cart,
        include: [
          { model: Product, through: { where: { status: "purchased" } } }
        ]
      }
    ]
  });

  if (!order) {
    return next(new AppError(404, "No order found with that id"));
  }

  if (currentUser.id !== order.userId) {
    return next(new AppError(403, "You can't see other users' purchases"));
  }

  res.status(200).json({
    status: "success",
    data: {
      order
    }
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  getAllOwnOrders,
  getOwnOrderById
};
