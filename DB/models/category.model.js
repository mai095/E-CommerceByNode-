import { Schema, Types, model } from "mongoose";
import { subcategoryModel } from "./subcategory.model.js";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, min: 3, max: 20, unique: true },
    slug: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    image: { id: String, url: String },
    brand: [{ type: Types.ObjectId, ref: "Brand" }],
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

categorySchema.virtual("subcategory", {
  ref: "Subcategory",
  localField: "_id",
  foreignField: "category",
});

// ~hook
categorySchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await subcategoryModel.deleteMany({ category: this._id });
  }
);

export const categoryModel = model("Category", categorySchema);
