import { productModel } from "../../../DB/models/product.model.js";
import { reviewModel } from "../../../DB/models/review.model.js";

export const calcAvg = async(productId)=>{
    let calcRating = 0;
    const product = await productModel.findById(productId);
    const reviews = await reviewModel.find({ productId }); //array of reviews

  
    for (let i = 0; i < reviews.length; i++) {
      calcRating += reviews[i].rating;
    }
    product.ratingAverage = calcRating / reviews.length;
    await product.save();
  
}