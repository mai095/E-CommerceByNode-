import joi from "joi";
import { validObjectId } from "../../middlewares/validation.middleware.js";

// *createSchema
export const createSchema = joi
  .object({
    name: joi.string().required().min(3).max(20),
  })
  .required();

// *updateSchema
export const updateSchema = joi
  .object({
    name: joi.string().required().min(3).max(20),
    id: joi.string().required().custom(validObjectId),
  })
  .required();

// *deleteSchema
export const deleteSchema = joi
  .object({
    id: joi.string().required().custom(validObjectId),
  })
  .required();
