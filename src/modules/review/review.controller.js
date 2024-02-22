import { orderModel } from "../../../DB/models/order.model.js";
import { productModel } from "../../../DB/models/product.model.js";
import { reviewModel } from "../../../DB/models/review.model.js";
import { calcAvg } from "./review.services.js";

// &createReview
export const createReview = async (req, res, next) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;
  //check product in order
  const order = await orderModel.findOne({
    user: req.userData._id,
    status: "delivered",
    "products.productId": productId,
  });
  if (!order)
    return next(new Error("Can't review this product", { cause: 400 }));
  //check past reviews
  if (
    await reviewModel.findOne({
      createdBy: req.userData._id,
      productId,
      orderId: order._id,
    })
  )
    return next(
      new Error("This order already reviewed by you!", { cause: 400 })
    );

  //create review
  const review = await reviewModel.create({
    rating,
    comment,
    productId,
    orderId: order._id,
    createdBy: req.userData._id,
  });
  //calculate avg
  calcAvg(productId);

  //res
  return res.json({
    success: true,
    review,
  });
};

// &updateReview
export const updateReview = async (req, res, next) => {
  const { productId, id } = req.params;
  await reviewModel.updateOne(
    { createdBy: req.userData._id, productId },
    { ...req.body }
  );
  if (req.body.rating) {
    calcAvg(productId);
  }
  //res
  return res.json({
    success: true,
    message: "Review updated successfully!",
  });
};
