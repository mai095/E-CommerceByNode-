import joi from "joi";
import { validObjectId } from "../../middlewares/validation.middleware.js";

export const createBrandSchema = joi
  .object({
    name: joi.string().required().min(2).max(20),
    categories: joi
      .array()
      .items(joi.string().custom(validObjectId).required())
      .required(),
  })
  .required();

export const updateBrandSchema = joi
  .object({
    name: joi.string().min(2).max(20),
    id: joi.string().custom(validObjectId).required(),
  })
  .required();

export const deleteBrandSchema = joi
  .object({
    id: joi.string().custom(validObjectId).required(),
  })
  .required();
