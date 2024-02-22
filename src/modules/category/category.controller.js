import slugify from "slugify";
import { categoryModel } from "../../../DB/models/category.model.js";
import cloudinary from "../../../utlis/cloud.js";

// *createCategory
export const createCategory = async (req, res, next) => {
  const isExist = await categoryModel.findOne({ name: req.body.name });
  if (isExist)
    return next(new Error("Category name is already exist!", { cause: 400 }));
  //check file
  if (!req.file)
    return next(new Error("Category image not found", { cause: 400 }));
  //upload image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/category`,
    }
  );
  //create in Db
  await categoryModel.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.userData._id,
    image: {
      id: public_id,
      url: secure_url,
    },
  });
  //res
  return res.json({
    success: true,
    message: "Category created successfully!",
  });
};

// *updateCategory
export const updateCategory = async (req, res, next) => {
  //check category
  const category = await categoryModel.findById(req.params.id);
  if (!category)
    return next(new Error("This category is not Found!", { cause: 404 }));
  //check owner
  if (category.createdBy.toString() !== req.userData._id.toString())
    return next(
      new Error("Not allowed to update this category", { cause: 403 })
    );
  //check file
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.image.id }
    );
    category.image = {
      id: public_id,
      url: secure_url,
    };
  }
  //update if found
  category.name = req.body.name ? req.body.name : category.name;
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;
  await category.save();
  //res
  return res.json({
    success: true,
    message: "category updated successfully",
  });
};

// *deleteCategory
export const deleteCategory = async (req, res, next) => {
  //check category
  const category = await categoryModel.findById(req.params.id);
  if (!category)
    return next(new Error("This category is not Found!", { cause: 404 }));
  //check owner
  if (category.createdBy.toString() !== req.userData._id.toString())
    return next(
      new Error("Not allowed to delete this category", { cause: 403 })
    );
  //delete
  // await categoryModel.findByIdAndDelete(req.params.id);
  await category.deleteOne()
  //delete image from cloudinary
  await cloudinary.uploader.destroy(category.image.id);
  //res
  return res.json({
    success: true,
    message: "Category deleted successfully!",
  });
};

// *allCategories
export const allCategories = async (req, res, next) => {
  const categories = await categoryModel
    .find()
    .populate({ path: "subcategory", populate: "createdBy" });
  return res.json({
    success: true,
    results: categories,
  });
};
