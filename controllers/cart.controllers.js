// Import Models
const { Product } = require("../models/product.model");
const { Cart } = require("../models/cart.model");
const { Order } = require("../models/order.model");
const { User } = require("../models/user.model");
const { ProductInCart } = require("../models/productsInCart.model");
const { AppError } = require("../utils/appError");

// Get all users cart

const getUserCart = async (req, res, next) => {
  try {
    const { currentUser } = req;
    const cart = await Cart.findOne({
      where: { status: "active", userId: currentUser.id },
      include: [
        {
          model: Product,
          through: { where: { status: "active" } }
        }
      ]
    });
    if (!cart) {
      throw new AppError(404, "This user does not have a cart yet");
    }
    res.status(200).json({
      status: "success",
      data: {
        cart
      }
    });
  } catch (err) {
    next(err);
  }
};

// Add products to cart

const addProductToCart = async (req, res, next) => {
  const { currentUser } = req;
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findOne({
      where: { status: "active", id: productId }
    });

    if (!product) {
      throw new AppError(404, "Cant find the product with the given ID");
    }

    if (quantity > product.quantityAvailable) {
      throw new AppError(
        400,
        `This product only has ${product.quantityAvailable} items.`
      );
    }

    let cart = await Cart.findOne({
      where: {
        status: "active",
        userId: currentUser.id
      }
    });

    let addNewProduct;

    if (!cart) {
      cart = await Cart.create({ userId: currentUser.id });
      addNewProduct = await ProductInCart.create({
        productId,
        cartId: cart.id,
        quantity
      });
    } else {
      let productExists = await ProductInCart.findOne({
        where: { cartId: cart.id, productId }
      });

      if (productExists && productExists.status === "active") {
        throw new AppError(400, "This product is already in the cart");
      }

      if (productExists && productExists.status === "removed") {
        addNewProduct = await productExists.update({
          status: "active",
          quantity
        });
      }

      if (!productExists) {
        addNewProduct = await ProductInCart.create({
          cartId: cart.id,
          productId,
          quantity
        });
      }
    }

    res.status(201).json({
      status: "success",
      data: {
        addNewProduct
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update cart

const updateCartProduct = async (req, res, next) => {
  const { currentUser } = req;
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findOne({
      where: { status: "active", id: productId }
    });

    if (!product) {
      throw new AppError(404, "Cant find the product with the given ID");
    }

    if (quantity > product.quantityAvailable) {
      throw new AppError(
        400,
        `This product only has ${product.quantityAvailable} items`
      );
    }

    const cart = await Cart.findOne({
      where: { status: "active", userId: currentUser.id }
    });

    if (!cart) {
      throw new AppError(400, "This user does not have a cart yet");
    }

    const productInCart = await ProductInCart.findOne({
      where: { status: "active", cartId: cart.id, productId }
    });

    if (!productInCart) {
      throw new AppError(404, `Can't update product, is not in the cart yet`);
    }

    if (quantity === 0) {
      await productInCart.update({ quantity: 0, status: "removed" });
    }

    if (quantity > 0) {
      await productInCart.update({ quantity });
    }

    res.status(204).json({
      status: "success"
    });
  } catch (err) {
    next(err);
  }
};

// Remove products

const removeProductFromCart = async (req, res, next) => {
  const { currentUser } = req;

  const { productId } = req.params;

  console.log(currentUser, productId, "this is the params");

  try {
    const cart = await Cart.findOne({
      where: {
        status: "active",
        userId: currentUser.id
      }
    });

    if (!cart) {
      throw new AppError(404, "This user does not have a cart yet");
    }

    const productInCart = await ProductInCart.findOne({
      where: {
        status: "active",
        cartId: cart.id,
        productId
      }
    });

    if (!productInCart) {
      throw new AppError(404, "This product does not exist in this cart");
    }

    await productInCart.update({ status: "removed", quantity: 0 });

    res.status(204).json({
      status: "success"
    });
  } catch (err) {
    next(err);
  }
};

// Update status cart

const purchaseCart = async (req, res, next) => {
  const { currentUser } = req;

  const cart = await Cart.findOne({
    where: { status: "active", userId: currentUser.id },
    include: [
      { model: User, attributes: { exclude: ["password", "passwordConfirm"] } },
      {
        model: Product,
        through: { where: { status: "active" } }
      }
    ]
  });

  if (!cart) {
    return next(new AppError(404, "This user does not have a cart yet"));
  }

  let totalPrice = 0;

  for (const product of cart.products) {
    await product.productInCart.update({ status: "purchased" });

    const productPrice = product.price * product.productInCart.quantity;

    totalPrice += productPrice;

    const newQty = product.quantityAvailable - product.productInCart.quantity;

    await product.update({ quantityAvailable: newQty });
  }

  await cart.update({ status: "purchased" });

  await Order.create({
    userId: currentUser.id,
    cartId: cart.id,
    issuedAt: new Date().toString(),
    totalPrice
  });

  res.status(201).json({
    status: "success",
    data: {
      cart
    }
  });
};

module.exports = {
  getUserCart,
  addProductToCart,
  updateCartProduct,
  removeProductFromCart,
  purchaseCart
};
