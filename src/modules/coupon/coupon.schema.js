import joi from "joi";
import { validObjectId } from "../../middlewares/validation.middleware.js";

export const createSchema = joi
  .object({
    discount: joi.number().required(),
    expiredAt: joi.date().greater(Date.now()),
  })
  .required();

  export const updateSchema=joi.object({
    id:joi.string().custom(validObjectId).required(),
    discount: joi.number(),
    expiredAt: joi.date().greater(Date.now()),
  }).required()

  export const deleteSchema=joi.object({
    id:joi.string().custom(validObjectId).required(),
  }).required()