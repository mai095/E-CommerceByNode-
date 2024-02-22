import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware.js";
import * as authSchema from "./auth.schema.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import * as authController from "./auth.controller.js";

const router = new Router();

// *Register
router.post(
  "/register",
  validation(authSchema.registerSchema),
  catchError(authController.register)
);

// *activation
router.get("/activation/:token", catchError(authController.activation));

// *login
router.post(
  "/login",
  validation(authSchema.loginSchema),
  catchError(authController.login)
);

// *forgetCode
router.patch(
  "/forgetCode",
  validation(authSchema.forgetCode),
  catchError(authController.forgetCode)
);

// *resetPass
router.patch(
  "/resetPass",
  validation(authSchema.resetPass),
  catchError(authController.resetPass)
);

export default router;
