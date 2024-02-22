import { Schema, Types, model } from "mongoose";
import cloudinary from "../../utlis/cloud.js";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 20,
      lowercase: true,
    },
    discription: {
      type: String,
      min: 10,
      max: 200,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      min: 1,
      max: 100,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
    },
    subcategory: {
      type: Types.ObjectId,
      ref: "Subcategory",
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
    },
    availableItems: {
      type: Number,
      min: 1,
      required: true,
    },
    solidItems: {
      type: Number,
      default: 0,
    },
    cloudFolder: {
      type: String,
      unique: true,
      required: true,
    },
    ratingAverage: { type: Number },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true, //!  Ignore anything in query that dosent found in model during filteration
  }
);

// ~virtual ===> review
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});

// ~virtual Calculate discount
productSchema.virtual("finalPrice").get(function () {
  //   if (this.discount > 0) return this.price - (this.price * this.discount) / 100;
  //   return this.price;
  // !OR
  return Number.parseFloat(
    this.price - (this.price * this.discount || 0) / 100
  ).toFixed(2);
});

// ~hook ==> deleteOne
productSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const ids = this.images.map((image) => image.id);
    ids.push(this.defaultImage.id);
    await cloudinary.api.delete_resources(ids);
    //delete folder
    await cloudinary.api.delete_folder(
      `${process.env.CLOUD_FOLDER_NAME}/product/${this.cloudFolder}`
    );
  }
);

// ~query helper ===> pagination
productSchema.query.paginate = function (page) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;
  const limit = 2; //product per page
  const skip = limit * (page - 1);
  return this.skip(skip).limit(limit);
};

// ~query helper ===> search
productSchema.query.search = function (keyword) {
  if (keyword) {
    return this.find({ name: { $regex: keyword, $options: "i" } });
  }
  return this;
};

// ~method ===> inStock
productSchema.methods.inStock = function (requiredQuentity) {
  return this.availableItems >= requiredQuentity ? true : false;
};

export const productModel = model("Product", productSchema);
