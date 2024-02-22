import { Router } from "express";
import { isAuthenticate } from "../../middlewares/iaAuthenticate.middleware.js";
import { isAuthorize } from "../../middlewares/isAuthorize.middleware.js";
import { fileUpload } from "../../../utlis/fileUpload.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import * as productSchema from "./product.schema.js";
import * as productController from "./product.controller.js";
import reviewRouter from "./../review/review.router.js";
const router = new Router();


router.use("/:productId/review", reviewRouter);

// *create
router.post(
  "/",
  isAuthenticate,
  isAuthorize("seller"),
  fileUpload().fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  validation(productSchema.createProduct),
  catchError(productController.createProduct)
);

// *delete
router.delete(
  "/:id",
  isAuthenticate,
  isAuthorize("seller"),
  validation(productSchema.deleteProduct),
  catchError(productController.deleteProduct)
);

// *get
router.get("/", catchError(productController.getProduct));

export default router;
