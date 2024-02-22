import { Router } from "express";
import { isAuthenticate } from "../../middlewares/iaAuthenticate.middleware.js";
import { isAuthorize } from "../../middlewares/isAuthorize.middleware.js";
import { fileUpload } from "../../../utlis/fileUpload.js";
import * as brandSchema from "./brand.schema.js";
import * as brandController from "./brand.controller.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";

const router = new Router();

// &create
router.post(
  "/",
  isAuthenticate,
  isAuthorize("admin"),
  fileUpload().single("brandLogo"),
  validation(brandSchema.createBrandSchema),
  catchError(brandController.createBrand)
);

// &update
router.patch(
  "/:id",
  isAuthenticate,
  isAuthorize("admin"),
  fileUpload().single("brandLogo"),
  validation(brandSchema.updateBrandSchema),
  catchError(brandController.updateBrand)
);

// &delete
router.delete(
  "/:id",
  isAuthenticate,
  isAuthorize("admin"),
  validation(brandSchema.deleteBrandSchema),
  catchError(brandController.deleteBrand)
);

// &get
router.get(
  "/",
  catchError(brandController.getBrand)
);

export default router;
