import { Router } from "express";
import * as reviewController from "./review.controller.js";
import * as reviewSchema from "./review.schema.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { isAuthenticate } from "../../middlewares/iaAuthenticate.middleware.js";
import { isAuthorize } from "../../middlewares/isAuthorize.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";

const router = new Router({ mergeParams: true });

// ^create
router.post(
  "/",
  isAuthenticate,
  isAuthorize("user"),
  validation(reviewSchema.createReview),
  catchError(reviewController.createReview)
);

// ^update
router.patch(
  "/:id",
  isAuthenticate,
  isAuthorize("user"),
  validation(reviewSchema.updateReview),
  catchError(reviewController.updateReview)
);

export default router;
