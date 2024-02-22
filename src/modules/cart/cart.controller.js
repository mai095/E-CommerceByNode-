import { cartModel } from "../../../DB/models/cart.model.js";
import { productModel } from "../../../DB/models/product.model.js";

// &addToCart
export const addToCart = async (req, res, next) => {
  //find user cart
  const { productId, quantity } = req.body;

  //check productId
  const product = await productModel.findById(productId);
  if (!product) return next(new Error("Product not found", { cause: 404 }));

  //check product In Cart
  const productInCart = await cartModel.findOne({
    user: req.userData._id,
    "product.productId": productId,
  });

  if (productInCart) {
    const theProduct = productInCart.product.find(
      (prd) => prd.productId.toString() === productId.toString()
    );
    if (product.inStock(theProduct.quantity + quantity)) {
      theProduct.quantity += quantity;
      await productInCart.save();
    } else {
      return next(
        new Error(`Sorry, Only ${product.availableItems} items are available`)
      );
    }
  }else{
  
  //check stock
  if (!product.inStock(quantity))
    return next(
      new Error(`Sorry only ${product.availableItems} item are avaliable`, {
        cause: 400,
      })
    );

  await cartModel.findOneAndUpdate(
    { user: req.userData._id },
    { $push: { product: { productId, quantity } } },
    { new: true }
  );
  }
  return res.json({
    success: true,
    message: "Product add to cart successfully",
  });
};

// &getCart
export const getCart = async (req, res, next) => {
  if (req.userData.role == "user") {
    const cart = await cartModel.findOne({ user: req.userData._id });
    return res.json({
      success: true,
      cart,
    });
  }
  if (req.userData.role == "admin" && !req.body.cartId)
    //validation
    return next(new Error("cartId is required", { cause: 400 }));

  const cart = await cartModel.findById(req.body.cartId);
  return res.json({
    success: true,
    cart,
  });
};

// &updateCart
export const updateCart = async (req, res, next) => {
  const { quantity, productId } = req.body;
  //check productId
  const product = await productModel.findById(productId);
  if (!product) return next(new Error("Product not found", { cause: 404 }));

  //check stock
  if (!product.inStock(quantity)) {
    return next(
      new Error(`Sorry only ${product.availableItems} item are avaliable`, {
        cause: 400,
      })
    );
  }
  const productInCart = await cartModel.findOneAndUpdate(
    { user: req.userData._id, "product.productId": productId }, //!search in array
    { "product.$.quantity": quantity }, //!  $ ===> this
    { new: true }
  );

  //check product in the cart
  if (!productInCart)
    return next(new Error("Product not found in the cart", { cause: 404 }));

  //res
  return res.json({
    success: true,
    message: "Cart updated successfully",
  });
};

// &deleteItem
export const deleteItem = async (req, res, next) => {
  //check productId
  const { productId } = req.body;
  const product = await cartModel.findOne({ "product.productId": productId });

  if (!product) return next(new Error("Product not found", { cause: 404 }));
  await cartModel.findOneAndUpdate(
    { user: req.userData._id },
    { $pull: { product: { productId } } },
    { new: true }
  );
  //res
  return res.json({
    success: true,
    message: "Item deleted successfully",
  });
};

// &clearCart
export const clearCart = async (req, res, next) => {
  await cartModel.findOneAndUpdate(
    { user: req.userData._id },
    { product: [] },
    { new: true }
  );
  //res
  return res.json({
    success: true,
    message: "Your cart is empty now!",
  });
};
