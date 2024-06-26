const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");

// Import Utils
const { globalErrorHandler } = require("./middlewares/error.middleware");
const { AppError } = require("./utils/appError");

// Import Router
const { userRouter } = require("./routes/user.routes");
const { productRouter } = require("./routes/product.routes");
const { cartRouter } = require("./routes/cart.routes");
const { orderRouter } = require("./routes/order.routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

// Middleware for page that not found
app.use("*", (req, res, next) => {
  next(new AppError(404, `${req.originalUrl} not found in this server.`));
});

app.use(globalErrorHandler);

module.exports = { app };
