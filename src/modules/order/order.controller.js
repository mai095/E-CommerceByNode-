import { couponModel } from "../../../DB/models/coupon.model.js";
import { cartModel } from "../../../DB/models/cart.model.js";
import { productModel } from "../../../DB/models/product.model.js";
import { orderModel } from "../../../DB/models/order.model.js";
import createInvoice from "../../../utlis/pdfkt.invoices.js";
import { sendEmail } from "../../../utlis/email.validation.js";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../../../utlis/cloud.js";
import { clearCart, updateStock } from "./order.service.js";
import Stripe from "stripe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// &createOrder
export const createOrder = async (req, res, next) => {
  //*get data
  const { address, coupon, phone, payment } = req.body;

  //*check coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await couponModel.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() },
    });
    if (!checkCoupon) return next(new Error("Invalid Coupon", { cause: 400 }));
  }

  //*get product in cart
  const cart = await cartModel.findOne({ user: req.userData._id });
  const products = cart.product; //array of object
  if (products.length < 1) return next(new Error("Empty Cart"));

  //*check product existance
  let orderProducts = [];
  let orderPrice = 0;

  for (let i = 0; i < products.length; i++) {
    const product = await productModel.findById(products[i].productId);
    if (!product)
      return next(
        new Error(`This product ${products[i].productId} not found`, {
          casue: 404,
        })
      );
    //*check stock
    if (!product.inStock(products[i].quantity))
      return next(
        new Error(`Sorry, only ${product.availableItems} items are avaliable`)
      );
    //*create object of product
    orderProducts.push({
      productId: products[i].productId,
      quantity: products[i].quantity,
      name: product.name,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
    });
    orderPrice += product.finalPrice * products[i].quantity;
  }
  //*create order in db
  const order = await orderModel.create({
    products: orderProducts,
    price: orderPrice,
    user: req.userData._id,
    address,
    phone,
    payment,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
  });
  //*create invoice
  const user = req.userData;

  const invoice = {
    shipping: {
      name: user.userName,
      address: order.address,
      country: "Egypt",
    },
    items: order.products,
    subtotal: order.price, //order price before discount
    paid: order.finalPrice, //order price after discount create as a hook
    invoice_nr: order._id,
  };

  //*create path
  const pdfPath = path.join(__dirname, `../../tempInvoices/${order._id}.pdf`);
  createInvoice(invoice, pdfPath);

  //*upload invoice in cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.CLOUD_FOLDER_NAME}/orders/invoices`,
  });

  order.invoice = {
    url: secure_url,
    id: public_id,
  };
  await order.save();

  //*send email to user
  const isSent = sendEmail({
    to: user.email,
    subject: "Order Invoice",
    attachments: [{ path: secure_url, contantType: "application/pdf" }],
  });
  if (!isSent) return next(new Error("Somethind went wrong!"));

  //*update stock
  updateStock(order.products, true);

  //*clear cart
  clearCart(user._id);

  // *visa payment
  const stripe = new Stripe(process.env.STRIPE_KEY);
  if (order.payment === "visa") {
    let stripeCoupon;
    if (order.coupon.name !== "undefined") {
      stripeCoupon = await stripe.coupons.create({
        percent_off: order.coupon.discount,
        duration: "once",
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: process.env.SUCCESS_URL,
      cancel_url:  process.env.CANCEL_URL,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product.name,
              // image: [product.defaultImage.url],
            },
            unit_amount: product.itemPrice * 100,
          },
          quantity: product.quantity,
        };
      }),
      discounts: [{ coupon: stripeCoupon.id }],
    });
    return res.json({url:session.url})
  }

  //*res
  return res.json({
    success: true,
    order,
  });
};

// &cancelOrder
export const cancelOrder = async (req, res, next) => {
  //check order
  const order = await orderModel.findById(req.params.id);
  if (!order) return next(new Error("Order not found", { cause: 404 }));
  //check status
  if (
    (order.status == "delivered" || order.status == "shipped",
    order.status == "canceled")
  )
    return next(
      new Error(`Sorry order can't be canceled at status ${order.status}`)
    );
  //cancel order
  order.status = "canceled";
  await order.save();
  //update stock
  updateStock(order.products, false);
  //res
  return res.json({
    success: true,
    message: "Order Canceled",
  });
};
