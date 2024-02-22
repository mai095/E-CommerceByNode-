import { Router } from "express";
import { isAuthenticate } from "../../middlewares/iaAuthenticate.middleware.js";
import { isAuthorize } from "../../middlewares/isAuthorize.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as subcategorySchema from "./subcategory.schema.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import * as subcategoryController from "./subcategory.controller.js";
import { fileUpload } from "../../../utlis/fileUpload.js";

const router = new Router({ mergeParams: true });

// *create
router.post(
  "/createSubcategory",
  isAuthenticate,
  isAuthorize("admin"),
  fileUpload().single("subcategory"),
  validation(subcategorySchema.createSchema),
  catchError(subcategoryController.createSubcategory)
);

// *update
router.patch(
  "/updateSubcategory/:id",
  isAuthenticate,
  isAuthorize("admin"),
  fileUpload().single("subcategory"),
  validation(subcategorySchema.updateSchema),
  catchError(subcategoryController.updateSubcategory)
);

// *delete
router.delete(
  "/deleteSubcategory/:id",
  isAuthenticate,
  isAuthorize("admin"),
  validation(subcategorySchema.deleteSchema),
  catchError(subcategoryController.deleteSubcategory)
);

// *get
router.get(
  "/",
  validation(subcategorySchema.getSchema),
  catchError(subcategoryController.getSubcategory)
);
export default router;
