import { Router } from "express";
import { isAuthenticate } from "../../middlewares/iaAuthenticate.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { isAuthorize } from "../../middlewares/isAuthorize.middleware.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { fileUpload } from "../../../utlis/fileUpload.js";
import * as cartCotroller from "../cart/cart.controller.js";
import * as cartSchema from "../cart/cart.schema.js";

const router = new Router();

//^add
router.post(
  "/",
  isAuthenticate,
  isAuthorize("user"),
  validation(cartSchema.addToCart),
  catchError(cartCotroller.addToCart)
);

// ^get
router.get(
  "/",
  isAuthenticate,
  isAuthorize("user", "admin"),
  validation(cartSchema.getCart),
  catchError(cartCotroller.getCart)
);

// ^update
router.patch(
  "/",
  isAuthenticate,
  isAuthorize("user"),
  validation(cartSchema.updateCart),
  catchError(cartCotroller.updateCart)
);

// ^delete item from cart
router.patch(
  "/deleteItem",
  isAuthenticate,
  isAuthorize("user"),
  validation(cartSchema.deleteItem),
  catchError(cartCotroller.deleteItem)
);

// ^clear cart
router.put(
  "/",
  isAuthenticate,
  isAuthorize("user"),
  catchError(cartCotroller.clearCart)
);
export default router;
