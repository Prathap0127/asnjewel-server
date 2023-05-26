import express from "express";
import {
  createProductController,
  deleteProductController,
  filterProductController,
  getProductController,
  productCategoryController,
  productCountController,
  productListController,
  productOrderController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  singleProductController,
  updateProductController,
} from "../controllers/ProductController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

import formidable from "express-formidable";

const router = express.Router();

//routes

//create Products
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// get Product

router.get("/get-product", getProductController);

// get Single Product

router.get("/get-product/:slug", singleProductController);

//get Product Photos

router.get("/product-photo/:pid", productPhotoController);

//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);
//delete Product

router.delete("/product/:pid", requireSignIn, isAdmin, deleteProductController);

//filter product

router.post("/filter-products", filterProductController);

//product count

router.get("/product-count", productCountController);

//page product list

router.get("/product-list/:page", productListController);

//serach Product

router.get("/product-search/:keyword", searchProductController);

//get similar products

router.get("/related-product/:pid/:cid", relatedProductController);

//get category wise product

router.get("/product-category/:slug", productCategoryController);

//placed order

router.post("/orders", requireSignIn, productOrderController);

export default router;
