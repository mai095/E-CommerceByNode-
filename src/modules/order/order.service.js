import { cartModel } from "../../../DB/models/cart.model.js";
import { productModel } from "../../../DB/models/product.model.js";

export const updateStock = async (products, createOrder) => {
  if (createOrder) {
    for (const product of products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: {
          solidItems: product.quantity,
          availableItems: -product.quantity,
        },
      });
    }
  } else {
    for (const product of products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: {
          solidItems: -product.quantity,
          availableItems: product.quantity,
        },
      });
    }
  }
};

export const clearCart = async (userId) => {
  await cartModel.findOneAndUpdate(
    { user: userId },
    {
      product: [],
    }
  );
};
