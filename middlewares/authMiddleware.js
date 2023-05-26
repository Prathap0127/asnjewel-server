import JWT from "jsonwebtoken";

import userModel from "../models/userModel.js";

//protected Login

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(req.headers.authorization, process.env.JWT_Key);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin route

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized User",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "your not admin",
      error,
    });
  }
};
