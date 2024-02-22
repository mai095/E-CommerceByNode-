import { Schema, Types, model } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    discount: {
      type: Number,
      min: 1,
      max: 100,
      required: true,
    },
    expiredAt:{
        type:Number,
        required:true
    }
  },
  { timestamps: true }
);

export const couponModel = model("Coupon", couponSchema);
