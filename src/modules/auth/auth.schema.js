import joi from "joi";

// *registerSchema
export const registerSchema = joi
  .object({
    userName: joi.string().required().min(3).max(10),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required().valid(joi.ref("password")),
    age: joi.number().min(18).max(90),
    role: joi.string(),
    gender: joi.string(),
    phone: joi.string(),
  })
  .required();

// *loginSchema
export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

// *forgetCode
export const forgetCode = joi
  .object({
    email: joi.string().required(),
  })
  .required();

// *resetPass
export const resetPass = joi
  .object({
    email: joi.string().required(),
    forgetCode: joi.string().required().length(5),
    newPassword: joi.string().required(),
    confirmPassword: joi.string().required().valid(joi.ref("newPassword")),
  })
  .required();
