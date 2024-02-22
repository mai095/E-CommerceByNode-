import joi from "joi";
import { validObjectId } from "../../middlewares/validation.middleware.js";

export const createSchema = joi
  .object({
    name: joi.string().required().min(3).max(20),
    category: joi.string().custom(validObjectId).required(),
  })
  .required();

export const updateSchema = joi
  .object({
    name: joi.string().required().min(3).max(20),
    category: joi.string().custom(validObjectId).required(),
    id: joi.string().custom(validObjectId).required(),
  })
  .required();

export const deleteSchema = joi
  .object({
    category: joi.string().custom(validObjectId).required(),
    id: joi.string().custom(validObjectId).required(),
  })
  .required();

export const getSchema = joi
  .object({
    category: joi.string().custom(validObjectId),
  })
  .required();
