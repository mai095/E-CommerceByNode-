import { Router } from "express";
import { isAuthenticate } from "../../middlewares/iaAuthenticate.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { isAuthorize } from "../../middlewares/isAuthorize.middleware.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { fileUpload } from "../../../utlis/fileUpload.js";
import * as categoryScehma from "./category.schema.js";
import * as categoryController from "./category.controller.js";
import subcategoryRouter from '../subcategory/subcategory.router.js'
const router = new Router();

router.use('/:category/subcategory',subcategoryRouter)

// *create
router.post(
  "/createCategory",
  isAuthenticate,
  isAuthorize("admin"),
  fileUpload().single("categoryImage"),
  validation(categoryScehma.createSchema),
  catchError(categoryController.createCategory)
);

// *update
router.patch(
  "/updateCategory/:id",
  isAuthenticate,
  isAuthorize("admin"),
  fileUpload().single("category"),
  validation(categoryScehma.updateSchema),
  catchError(categoryController.updateCategory)
);

// *delete
router.delete(
  "/deleteCategory/:id",
  isAuthenticate,
  isAuthorize("admin"),
  validation(categoryScehma.deleteSchema),
  catchError(categoryController.deleteCategory)
);

// *get
router.get(
  "/allCategories",
  isAuthenticate,
  catchError(categoryController.allCategories)
);

export default router;
