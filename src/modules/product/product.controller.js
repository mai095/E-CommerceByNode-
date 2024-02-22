import { categoryModel } from "../../../DB/models/category.model.js";
import { subcategoryModel } from "../../../DB/models/subcategory.model.js";
import { brandModel } from "../../../DB/models/brand.model.js";
import { nanoid } from "nanoid";
import cloudinary from "./../../../utlis/cloud.js";
import { productModel } from "../../../DB/models/product.model.js";

// &createProduct
export const createProduct = async (req, res, next) => {
  //check category
  const category = await categoryModel.findById(req.body.category);
  if (!category)
    return next(new Error("This category not found", { cause: 404 }));
  //check subcategory
  const subcategory = await subcategoryModel.findById(req.body.subcategory);
  if (!subcategory)
    return next(new Error("This subcategory not found", { cause: 404 }));
  //check brand
  const brand = await brandModel.findById(req.body.brand);
  if (!brand) return next(new Error("This brand not found", { cause: 404 }));
  //check images
  if (!req.files)
    return next(new Error("Product image is required", { cause: 400 }));
  //create cloudFolder
  const cloudFolder = nanoid();
  //upload subImages
  let images = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}/product/${cloudFolder}/subImages`,
      }
    );
    images.push({
      id: public_id,
      url: secure_url,
    });
  }
  //upload default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/product/${cloudFolder}/defaultImage`,
    }
  );
  //create in DB
  await productModel.create({
    ...req.body,
    images,
    defaultImage: {
      id: public_id,
      url: secure_url,
    },
    createdBy: req.userData._id,
    cloudFolder,
  });
  //res
  return res.json({
    success: true,
    message: "Product created successfully",
  });
};

// &deleteProduct
export const deleteProduct = async (req, res, next) => {
  //check product
  const product = await productModel.findById(req.params.id);
  if (!product)
    return next(new Error("This product not found", { cause: 404 }));
  //check owner
  if (req.userData._id.toString() !== product.createdBy.toString())
    return next(new Error("Not Authorized", { cause: 401 }));

  // !build as hook in model
  //delete images from cloudinary
  //   const ids = product.images.map((image) => image.id);
  //   ids.push(product.defaultImage.id);
  //   await cloudinary.api.delete_resources(ids);
  //   //delete folder
  //   await cloudinary.api.delete_folder(
  //     `${process.env.CLOUD_FOLDER_NAME}/product/${product.cloudFolder}`
  //   );
  //delete from DB
  await product.deleteOne();
  //res
  return res.json({
    success: true,
    message: "Product deleted successfully",
  });
};

// &getProduct
//export const getProduct = async (req, res, next) => {
// *Search By Name
// const products = await productModel.find({
//   name: { $regex: keyword, $options: "i" },
// });

// *Filter
// const products = await productModel.find({ ...req.query});
// if (products.length == 0) return next(new Error("Not Found", { cause: 404 }));

// *sort
// const { keyword, sort, page } = req.query;
// const products = await productModel.find().sort(sort);

// *pagenation
// let { page } = req.query;
// page = page < 1 || isNaN(page) || !page ? 1 : page;
// const limit = 2; // product per page
// const skip = limit * (page - 1);
// const products = await productModel.find().skip(skip).limit(limit);

//   const products = await productModel.find({ ...req.query })
//     .sort(sort)
//     .paginate(page)
//     // .search(keyword);
// console.log(products);

//   return res.json({
//     success: true,
//     products,
//   });
//};
export const getProduct = async (req, res, next) => {
  const { sort, page, keyword } = req.query;
  console.log(req.query);
  const products = await productModel
    .find({ ...req.query })
    .sort(sort)
    .search(keyword)
    // .paginate(page)
  return res.json({
    success: true,
    products,
  });
};
