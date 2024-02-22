import { Schema, Types, model } from "mongoose";

const subcategorySchema = new Schema(
  {
    name: { type: String, required: true, min: 3, max: 20 },
    slug: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    image: { id: String, url: String },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    brand: [{ type: Types.ObjectId, ref: "Brand" }],
  },
  { timestamps: true }
);



export const subcategoryModel = model("Subcategory", subcategorySchema);
