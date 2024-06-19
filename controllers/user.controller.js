const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const { filterObj } = require("../utils/filterObj");
const { AppError } = require("../utils/appError");
dotenv.config({ path: "./.env" });

// Create a new user
const createNewUser = async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;

  try {
    const salt = await bcrypt.genSalt(12);
    const passwordCrypt = await bcrypt.hash(password, salt);
    const passwordConfirmCrypt = await bcrypt.hash(passwordConfirm, salt);

    if (password !== passwordConfirm) {
      throw new AppError(400, "Passwords don't match");
    }

    const newUser = await User.create({
      username,
      email,
      password: passwordCrypt,
      passwordConfirm: passwordConfirmCrypt
    });

    newUser.password = undefined;
    newUser.passwordConfirm = undefined;

    res.status(201).json({
      status: "success",
      data: {
        newUser
      }
    });
  } catch (err) {
    next(err);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, "Enter a valid email and password");
    }

    const user = await User.findOne({ where: { email, status: "active" } });

    if (!user) {
      throw new AppError(400, "User not found or inactive");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(400, "Credentials are invalid");
    }

    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN
        },
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        }
      );
    });

    res.status(200).json({
      status: "success",
      data: {
        token
      }
    });
  } catch (err) {
    return next(new AppError(500, "Internal Server Error"));
  }
};

// Get all the users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: { status: "active" },
      attributes: { exclude: ["password", "passwordConfirm"] }
    });

    res.status(200).json({
      status: "success",
      data: users
    });
  } catch (err) {
    return next(new AppError(500, "Internal Server Error"));
  }
};

// Get user by Id
const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: { status: "active", id },
      attributes: { exclude: ["password", "passwordConfirm"] }
    });

    if (!user) {
      throw new AppError(404, "Cant find the user with the given ID");
    }

    res.status(200).json({
      status: "success",
      data: user
    });
  } catch (err) {
    return next(err);
  }
};

// Update user by Id
const updateUser = async (req, res, next) => {
  try {
    const user = req.currentUser;

    const data = filterObj(req.body, "username", "email", "role");

    await user.update(data);

    res.status(204).json({ status: "success" });
  } catch (err) {
    return next(err);
  }
};

// Delete user by Id
const deleteUser = async (req, res, next) => {
  try {
    const user = req.currentUser;

    // This is a soft delete technical
    await user.update({ status: "deleted" });

    res.status(204).json({
      status: "success"
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createNewUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
