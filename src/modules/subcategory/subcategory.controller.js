import slugify from "slugify";
import { categoryModel } from "../../../DB/models/category.model.js";
import { subcategoryModel } from "../../../DB/models/subcategory.model.js";
import cloudinary from "../../../utlis/cloud.js";

// *createSubcategory
export const createSubcategory = async (req, res, next) => {
  //check category
  const category = await categoryModel.findById(req.params.category);
  if (!category)
    return next(new Error("This category is not found", { casue: 404 }));
  //check file upload
  if (!req.file)
    return next(new Error("Subcategory image is required", { casue: 404 }));
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/Subcategory`,
    }
  );
  //create
  await subcategoryModel.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.userData._id,
    image: {
      id: public_id,
      url: secure_url,
    },
    category: req.params.category,
  });
  //res
  return res.json({
    success: true,
    message: "Subcategory created successfully!",
  });
};

// *updateSubcategory
export const updateSubcategory = async (req, res, next) => {
  //check category
  const category = await categoryModel.findById(req.params.category);
  if (!category)
    return next(new Error("This category is not found", { casue: 404 }));
  //check subcategory
  const subcategory = await subcategoryModel.findOne({
    _id: req.params.id,
    category: req.params.category,
  });
  if (!subcategory)
    return next(new Error("This Subcategory is not found", { casue: 404 }));
  //check owner
  if (subcategory.createdBy.toString() !== req.userData._id.toString())
    return next(
      new Error("Not allowed to update this subcategory", { cause: 403 })
    );
  //fileupload
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: subcategory.image.id,
      }
    );
    subcategory.image = {
      id: public_id,
      url: secure_url,
    };
  }
  //update if found
  subcategory.name = req.body.name ? req.body.name : subcategory.name;
  subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;
  //save
  await subcategory.save();
  //res
  return res.json({
    success: true,
    message: "Subcategory updated successfully!",
  });
};

// *deleteSubcategory
export const deleteSubcategory = async (req, res, next) => {
  //check category
  const category = await categoryModel.findById(req.params.category);
  if (!category)
    return next(new Error("This category is not found", { casue: 404 }));
  //check subcategory
  const subcategory = await subcategoryModel.findOne({
    _id: req.params.id,
    category: req.params.category,
  });
  if (!subcategory)
    return next(new Error("This Subcategory is not found", { casue: 404 }));
  //check owner
  if (subcategory.createdBy.toString() !== req.userData._id.toString())
    return next(
      new Error("Not allowed to update this subcategory", { cause: 403 })
    );
  await subcategoryModel.findByIdAndDelete(req.params.id);
  await cloudinary.uploader.destroy(subcategory.image.id);
  return res.json({
    success: true,
    message: "Subcategory deleted successfully!",
  });
};

// *getSubcategory
export const getSubcategory = async (req, res, next) => {
  if (req.params.category) {
    const category = await categoryModel.findById(req.params.category);
    if (!category)
      return next(new Error("This category is not found", { casue: 404 }));
    const results = await subcategoryModel.find({
      category: req.params.category,
    });
  }
  const results = await subcategoryModel.find();
  return res.json({
    success: true,
    results: results,
  });
};
