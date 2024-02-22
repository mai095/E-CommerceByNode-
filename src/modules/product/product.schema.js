import joi from "joi";
import { validObjectId } from "../../middlewares/validation.middleware.js";

// ^createProduct
export const createProduct = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    discription: joi.string().min(10).max(200),
    price: joi.number().integer().required(),
    discount: joi.number().integer().min(1).max(100),
    availaleItems: joi.number().integer().required().min(1),
    category: joi.string().custom(validObjectId).required(),
    subcategory: joi.string().custom(validObjectId).required(),
    brand: joi.string().custom(validObjectId).required(),
  })
  .required();

// ^deleteProduct
export const deleteProduct = joi
  .object({
    id: joi.string().custom(validObjectId).required(),
  })
  .required();
