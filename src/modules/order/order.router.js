import { Router } from "express";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { isAuthenticate } from "../../middlewares/iaAuthenticate.middleware.js";
import { isAuthorize } from "../../middlewares/isAuthorize.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as orderController from "./order.controller.js";
import * as orderSchema from "./order.schema.js";

const router = new Router();

// &create
router.post(
  "/",
  isAuthenticate,
  isAuthorize("user"),
  validation(orderSchema.createOrder),
  catchError(orderController.createOrder)
);

// &create
router.patch(
  "/:id",
  isAuthenticate,
  isAuthorize("user"),
  validation(orderSchema.cancelOrder),
  catchError(orderController.cancelOrder)
);

export default router;
