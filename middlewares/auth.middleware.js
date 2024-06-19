const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { promisify } = require("util");
const { User } = require("../models/user.model");
const { AppError } = require("../utils/appError");

dotenv.config({ path: "./.env" });

const validateSession = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(401, "Invalid session");
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      where: { id: decodedToken.id, status: "active" },
      attributes: {
        exclude: ["password"]
      }
    });

    if (!user) {
      throw new AppError(401, "Invalid session");
    }

    req.currentUser = user;

    next();
  } catch (error) {
    next(error);
  }
};

const protectAccountOwner = async (req, res, next) => {
  const { id } = req.params;

  const { currentUser } = req;

  try {
    const user = await User.findOne({
      where: { status: "active", id },
      attributes: { exclude: ["password", "passwordConfirm"] }
    });

    if (!user) {
      throw new AppError(404, "Cant find the user with the given ID");
    }

    if (currentUser.id !== +id) {
      throw new AppError(403, "You cant update others users accounts");
    }

    next();
  } catch (error) {
    next(error);
  }
};

const protectAdmin = async (req, res, next) => {
  try {
    if (req.currentUser.role !== "admin") {
      throw new AppError(403, "Access denied");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateSession,
  protectAccountOwner,
  protectAdmin
};
