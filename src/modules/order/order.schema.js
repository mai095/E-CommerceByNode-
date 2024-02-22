import joi from "joi";
import { validObjectId } from "../../middlewares/validation.middleware.js";

// *createOrder
export const createOrder = joi
  .object({
    phone: joi.string().required(),
    address: joi.string().required(),
    payment: joi.string().valid("cash", "visa"),
    coupon: joi.string().length(5),
  })
  .required();

// *cancelOrder
export const cancelOrder = joi
  .object({
    id: joi.string().custom(validObjectId).required(),
  })
  .required();
