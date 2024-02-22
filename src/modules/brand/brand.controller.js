import slugify from "slugify";
import { brandModel } from "../../../DB/models/brand.model.js";
import { categoryModel } from "../../../DB/models/category.model.js";
import cloudinary from "../../../utlis/cloud.js";
import { subcategoryModel } from "../../../DB/models/subcategory.model.js";

// *createBrand
export const createBrand = async (req, res, next) => {
  //check category
  const { categories, name } = req.body;
  const isExist = await brandModel.findOne({ name });
  if (isExist)
    return next(new Error("Brand name is already exist!", { cause: 400 }));
  categories.forEach(async (categoryId) => {
    const category = await categoryModel.findById(categoryId);
    if (!category)
      return next(
        new Error(`This Category ${categoryId} not found`, { cause: 404 })
      );
  });
  //check image
  if (!req.file)
    return next(new Error("Brand image is required", { cause: 400 }));
  //upload cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/brand`,
    }
  );
  //create in DB
  const brand = await brandModel.create({
    name,
    slug: slugify(name),
    image: {
      url: secure_url,
      id: public_id,
    },
    createdBy: req.userData._id,
  });

  //add brand in categoryModel
  categories.forEach(async (categoryId) => {
    await categoryModel.findByIdAndUpdate(categoryId, {
      $push: { brand: brand._id },
    });
    // !OR
    //~ const category = await categoryModel.findById(categoryId);
    //~ category.brand.push(brand._id);
    //~ await category.save()
  });
  
 
  //res
  return res.json({
    success: true,
    message: "Brand created successfully",
  });
};

// *updateBrand
export const updateBrand = async (req, res, next) => {
  //check brand
  const brand = await brandModel.findById(req.params.id);
  if (!brand)
    return next(
      new Error(`This brand ${req.params.id} not found`, { casue: 404 })
    );
  //check owner
  if (req.userData._id.toString() !== brand.createdBy.toString())
    return next(
      new Error("Not authorize to update this brand", { cause: 403 })
    );
  //check file
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      // brand.image.id
      req.file.path
    );
    brand.image = {
      url: secure_url,
      id: public_id,
    };
  }
  brand.name = req.body.name ? req.body.name : brand.name;
  brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;
  await brand.save();

  //update  //save
  // await brandModel.findByIdAndUpdate(
  //   req.params.id,
  //   { ...req.body },
  //   { new: true }
  // );

  //res
  return res.json({
    success: true,
    message: "Brand updated successfully",
  });
};

// *deleteBrand
export const deleteBrand = async (req, res, next) => {
  //check brand
  const brand = await brandModel.findById(req.params.id);
  if (!brand)
    return next(
      new Error(`This brand ${req.params.id} not found`, { casue: 404 })
    );
  //check owner
  if (req.userData._id.toString() !== brand.createdBy.toString())
    return next(
      new Error("Not authorize to update this brand", { cause: 403 })
    );
  //delete from DB
  await brandModel.findByIdAndDelete(req.params.id, { new: true });
  //delete from cloudinary
  await cloudinary.uploader.destroy(brand.image.id);
  //delete from categoryModel
  await categoryModel.updateMany({}, { $pull: { brand: brand._id } });

  //res
  return res.json({
    success: true,
    message: "Brand deleted successfully!",
  });
};

// *getBrand
export const getBrand = async (req, res, next) => {
  if(req.query.categoryId){
  const category = await categoryModel.findById(req.query.categoryId).populate('brand');
  return res.json({
    success: true,
    category,
  });
  }
  const brands = await brandModel.find();
  return res.json({
    success: true,
    brands,
  });
};
