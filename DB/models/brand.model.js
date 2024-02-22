import { Schema, Types, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true,
      lowercase:true,
      min:2,
      max:20
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      url: { type: String },
      id: { type: String },
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const brandModel = model("Brand", brandSchema);
