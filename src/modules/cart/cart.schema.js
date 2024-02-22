import joi from "joi";
import { validObjectId } from "../../middlewares/validation.middleware.js";

// ^addToCart
export const addToCart = joi
  .object({
    productId: joi.string().custom(validObjectId).required(),
    quantity: joi.number(),
  })
  .required();

// ^getCart
export const getCart = joi
  .object({
    cartId: joi.string().custom(validObjectId),
  })
  .required();

// ^updateCart
export const updateCart = joi
  .object({
    productId: joi.string().custom(validObjectId).required(),
    quantity: joi.number(),
  })
  .required();

// ^deleteItem
export const deleteItem = joi
  .object({
    productId: joi.string().custom(validObjectId).required(),
  })
  .required();
