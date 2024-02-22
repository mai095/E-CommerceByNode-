import { Router } from "express";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { isAuthenticate } from "../../middlewares/iaAuthenticate.middleware.js";
import { isAuthorize } from "../../middlewares/isAuthorize.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as couponController from "./coupon.controller.js";
import * as couponSchema from "./coupon.schema.js";

const router = new Router();

// *create
router.post(
  "/",
  isAuthenticate,
  isAuthorize("seller"),
  validation(couponSchema.createSchema),
  catchError(couponController.createCoupon)
);

// *update
router.patch(
  "/:id",
  isAuthenticate,
  isAuthorize("seller"),
  validation(couponSchema.updateSchema),
  catchError(couponController.updateCoupon)
);

// *delete
router.delete(
  "/:id",
  isAuthenticate,
  isAuthorize("seller"),
  validation(couponSchema.deleteSchema),
  catchError(couponController.deleteCoupon)
);

// *get
router.get(
  "/",
  isAuthenticate,
  isAuthorize("seller",'admin'),
  catchError(couponController.getCoupon)
);

export default router;
