import CategoryModel from "../models/CategoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is Reqired" });
    }
    const exisitingCategory = await CategoryModel.findOne({ name });
    if (exisitingCategory) {
      return res.status(200).send({
        success: false,
        message: "category already Exist ",
      });
    }
    const category = await new CategoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New Category is created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in category",
      error,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated Sucessfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in category",
      error,
    });
  }
};

//category for all
export const categoryController = async (req, res) => {
  try {
    const category = await CategoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Category listed",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in category",
      error,
    });
  }
};

//get single Category

export const singleCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    res.status(201).send({
      success: true,
      message: "Requested Category List",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in category",
      error,
    });
  }
};

//delete Category

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Sucessfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in category",
      error,
    });
  }
};
