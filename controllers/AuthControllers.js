import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import OrderModel from "../models/OrderModel.js";

//register
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validation
    if (!name) {
      return res.status(401).send({ message: "Name is Reqired" });
    }
    if (!email) {
      return res.status(401).send({ message: "Email is Reqired" });
    }
    if (!password) {
      return res.status(401).send({ message: "Password is Reqired" });
    }
    if (!phone) {
      return res.status(401).send({ message: "Phone is Reqired" });
    }
    if (!address) {
      return res.status(401).send({ message: "Address is Reqired" });
    }
    if (!answer) {
      return res.status(401).send({ message: "answer is Reqired" });
    }

    // for existing user
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User already Exist please login",
      });
    }
    //register User
    const hashedPassword = await hashPassword(password);
    //local save data
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Sucessfull",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register",
      error,
    });
  }
};

//login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.status(404).send({
        success: false,
        message: "Invalid Creditials ",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found please register",
      });
    }
    //pasword check
    const matchPassword = await comparePassword(password, user.password);
    // validation password
    if (!matchPassword) {
      res.status(200).send({
        success: false,
        message: "invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_Key, {
      expiresIn: "7d",
    });

    //send responce to user
    res.status(200).send({
      success: true,
      message: "login Sucessfull",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
//forgot Password

export const forgotPasswordController = async (req, res) => {
  try {
    let { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is Required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is Required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is Required" });
    }

    //check user in DB
    const user = await userModel.findOne({ email, answer });
    // verify user
    if (!user) {
      return res.status(404).send({ message: "Invalid Email or Answer" });
    }
    //Password to hashed
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Sucessfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

//protected with token to check

export const protectController = (req, res) => {
  res.status(200).send("protected Route");
};

//update profile

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password && password.length > 8) {
      return res.json({ error: "password required with minimum 8 digits" });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updateUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Sucessfully",
      updateUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong in update profile",
      error,
    });
  }
};

//get orders

export const getOrdersController = async (req, res) => {
  try {
    const getOrders = await OrderModel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(getOrders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong in get Orders",
      error,
    });
  }
};

//get all users

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({ role: 0 }).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      userCount: users.length,
      users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong in get all users",
      error,
    });
  }
};
