import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, min: 1, required: true },
        name: String,
        itemPrice: Number,
        totalPrice: Number,
      },
    ],
    price: { type: Number, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    payment: { type: String, default: "cash", enum: ["cash", "visa"] },
    status: {
      type: String,
      default: "placed",
      enum: ["placed", "shipped", "delivered", "canceled"],
    },
    coupon: {
      id: { type: Types.ObjectId, ref: "Coupon" },
      name: String,
      discount: { type: Number, min: 1, max: 100 },
    },
    invoice: {
      id: { type: String },
      url: { type: String },
    },
  },
  { timestamps: true }
);

// ~virtual Calculate discount
orderSchema.virtual("finalPrice").get(function () {
  //   if (this.discount > 0) return this.price - (this.price * this.discount) / 100;
  //   return this.price;
  // !OR
  return this.coupon
    ? Number.parseFloat(
        this.price - (this.price * this.coupon.discount || 0) / 100
      ).toFixed(2)
    : this.price;
});
export const orderModel = model("Order", orderSchema);
