// Import Models
const { Product } = require("../models/product.model");
const { AppError } = require("../utils/appError");
const { filterObj } = require("../utils/filterObj");

// Create new product
const createProduct = async (req, res, next) => {
  const { batchNumber, name, price, quantityAvailable } = req.body;
  const { id } = req.currentUser;

  try {
    const newProduct = await Product.create({
      batchNumber,
      name,
      price,
      quantityAvailable,
      userId: id
    });

    res.status(201).json({
      status: "success",
      data: {
        newProduct
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get all the products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({ where: { status: "active" } });

    res.status(200).json({
      status: "success",
      data: {
        products
      }
    });
  } catch (err) {
    next(err);
  }
};
// Get product by Id
const productById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ where: { status: "active", id } });

    if (!product) {
      throw new AppError(404, "No product found");
    }

    res.status(200).json({
      status: "success",
      data: {
        product
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ where: { status: "active", id } });

    if (!product) {
      throw new AppError(404, "No product found");
    }

    const data = filterObj(
      req.body,
      "batchNumber",
      "name",
      "price",
      "quantityAvailable"
    );

    await product.update(data);

    res.status(204).json({
      status: "success"
    });
  } catch (err) {
    next(err);
  }
};

// Delete product by Id
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ where: { status: "active", id } });

    if (!product) {
      throw new AppError(404, "No product found");
    }

    // This is a soft delete technical
    await product.update({ status: "deleted" });

    res.status(204).json({
      status: "success"
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  productById,
  updateProduct,
  deleteUser
};
