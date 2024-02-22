import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Randomstring from "randomstring";
import { tokenModel } from "../../../DB/models/token.model.js";
import { userModel } from "../../../DB/models/user.model.js";
import { sendEmail } from "../../../utlis/email.validation.js";
import { cartModel } from "../../../DB/models/cart.model.js";

// &register
export const register = async (req, res, next) => {
  const isExist = await userModel.findOne({ email: req.body.email });
  if (isExist) return next(new Error("This Email already Exist!"));

  const user = await userModel.create({ ...req.body}); //!create ==> call save
  await cartModel.create({ user: user._id }); //!create user cart
  const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY);
  const confirmMsg = await sendEmail({
    to: req.body.email,
    subject: "Activation Account",
    html: `<a href='http://localhost:2000/auth/activation/${token}'>Click to activate</a>`,
  });

  if (!confirmMsg) return next(new Error("Invalid Email"));
  return res.json({
    success: true,
    message: "Check your Email to Activation",
  });
};

// &activation
export const activation = async (req, res, next) => {
  const { token } = req.params;
  if (!token) return next(new Error("Invalid URL"));
  const payload = jwt.verify(token, process.env.SECRET_KEY);
  await userModel.findOneAndUpdate(
    { email: payload.email },
    { isConfirmed: true },
    { new: true }
  );
  return res.json({
    success: true,
    message: "Your Email is activated successfully, you can login now!",
  });
};

// &login
export const login = async (req, res, next) => {
  //1-check email &isConfirm
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new Error("Email not found, you must sign up first"));
  if (!bcrypt.compareSync(req.body.password, user.password))
    return next(new Error("Wrong Password!"));

  if (!user.isConfirmed) return next(new Error("Activate your account first!"));

  //2-create token
  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.SECRET_KEY
  );
  //4-create token model
  await tokenModel.create({
    token,
    user: user._id,
    agent: req.headers["agent"],
  });
  user.isDeleted = false;
  //5-response
  return res.json({
    success: true,
    token: token,
  });
};

// &forgetCode
export const forgetCode = async (req, res, next) => {
  //check email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new Error("Email not found"));
  if (!user.isConfirmed) return next(new Error("Activate your account first!"));
  //generate code
  const restCode = Randomstring.generate({
    length: 5,
    charset: "numeric",
  });
  //send code
  const resetMsg = await sendEmail({
    to: user.email,
    subject: "Forget Code",
    html: `<div>${restCode}</div>`,
  });

  //update forgetCode
  user.forgetCode = restCode;
  await user.save();
  //res
  return res.json({
    success: true,
    message: "Check your Email",
  });
};

// &resetPass
export const resetPass = async (req, res, next) => {
  //check email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new Error("Email not found"));
  if (!user.isConfirmed) return next(new Error("Activate your account first!"));
  //compare code  db with body
  if (user.forgetCode !== req.body.forgetCode)
    return next(new Error("Invalid Code"));
  //logout
  const tokens = await tokenModel.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  //res
  return res.json({
    success: true,
    message: "Password is updated successfully",
  });
};
