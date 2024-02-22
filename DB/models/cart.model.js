import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
  {
    product: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
  },
  { timestamps: true }
);

export const cartModel = model("Cart", cartSchema);
