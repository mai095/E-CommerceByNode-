import { Types } from "mongoose";

export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const validationResuls = schema.validate(data, { abortEarly: false });
    if (validationResuls.error) {
      const errMsg = validationResuls.error.details.map((obj) => obj.message);
      return next(new Error(errMsg, { cause: 400 }));
    } else {
      next();
    }
  };
};


export const validObjectId = (value, helper) => {
  if (Types.ObjectId.isValid(value)) return true
  return helper.message("Invalid ObjectId");
};
