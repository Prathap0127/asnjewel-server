import fs from "fs";
import slugify from "slugify";
import ProductModel from "./../models/ProductModel.js";
import CategoryModel from "./../models/CategoryModel.js";
import OrderModel from "./../models/OrderModel.js";
export const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      weight,
      making,
      price,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { photo } = req.files;
    //validation with Switch
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Reqired" });
      case !description:
        return res.status(500).send({ error: "Description is Reqired" });
      case !weight:
        return res.status(500).send({ error: "Weight is Reqired" });
      case !price:
        return res.status(500).send({ error: "price is Reqired" });
      case !category:
        return res.status(500).send({ error: "category is Reqired" });
      case !quantity:
        return res.status(500).send({ error: "quantity is Reqired" });
      case !shipping:
        return res.status(500).send({ error: "Shipping is Reqired" });
      case photo && photo.size > 100000:
        return res.status(500).send({
          error: "photo is Reqired and size should be less than 2 mb",
        });
    }
    const products = new ProductModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create Products",
      error,
    });
  }
};

// get Products

export const getProductController = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate("category")
      .select("-photo")
      .limit(10)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "Product Listed",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create Products",
      error,
    });
  }
};

// get single Product

export const singleProductController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "single Product",
      product,
    });
    console.log(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create Products",
      error,
    });
  }
};

//get Product Photos

export const productPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Photo",
      error,
    });
  }
};

//update Product

export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      weight,
      making,
      price,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { photo } = req.files;
    //validation with Switch
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Reqired" });
      case !description:
        return res.status(500).send({ error: "Description is Reqired" });
      case !weight:
        return res.status(500).send({ error: "Weight is Reqired" });
      case !making:
        return res.status(500).send({ error: "making is Reqired" });
      case !price:
        return res.status(500).send({ error: "price is Reqired" });
      case !category:
        return res.status(500).send({ error: "category is Reqired" });
      case !quantity:
        return res.status(500).send({ error: "quantity is Reqired" });
      case !shipping:
        return res.status(500).send({ error: "Shipping is Reqired" });
      case photo && photo.size > 1000000:
        return res.status(500).send({
          error: "photo is Reqired and size should be less than 2 mb",
        });
    }
    const products = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update Products",
      error,
    });
  }
};

//delete Product

export const deleteProductController = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.pid).select(
      "-photo"
    );
    res.status(200).send({
      success: true,
      message: "product Deleted Sucessfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting Product",
      error,
    });
  }
};

//filter product

export const filterProductController = async (req, res) => {
  try {
    const { checked } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

//product count

export const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in count Products",
      error,
    });
  }
};

//no of product list

export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in  page Products list",
      error,
    });
  }
};

//search product

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in  search Products ",
      error,
    });
  }
};

//related products in more details page

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await ProductModel.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in  Related Products ",
      error,
    });
  }
};

//category wise product

export const productCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    const products = await ProductModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in  category wise Products ",
      error,
    });
  }
};

//order contoller

export const productOrderController = async (req, res) => {
  try {
    const { cart } = req.body;
    console.log(cart);
    const order = new OrderModel({
      products: cart,
      buyer: req.user._id,
    }).save();
    console.log(order);
    res.status(201).send({
      success: true,
      message: "Order Placed Sucessfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in  user Orders ",
      error,
    });
  }
};

//admin orders

export const allProductOrderController = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    console.log(orders);
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in  admin order ",
      error,
    });
  }
};

//change order status

export const orderStatusController = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const orders = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in  order status ",
      error,
    });
  }
};
