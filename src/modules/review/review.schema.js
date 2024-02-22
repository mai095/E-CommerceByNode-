import joi from "joi";
import { validObjectId } from "../../middlewares/validation.middleware.js";

export const createReview = joi
  .object({
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().required(),
    productId: joi.string().custom(validObjectId).required(),
  })
  .required();

export const updateReview = joi
  .object({
    id: joi.string().custom(validObjectId).required(),
    productId: joi.string().custom(validObjectId).required(),
    rating: joi.number().min(1).max(5),
    comment: joi.string(),
  })
  .required();
