import voucherCode from "voucher-code-generator";
import { couponModel } from "../../../DB/models/coupon.model.js";

// ^createCoupon
export const createCoupon = async (req, res, next) => {
  //generate coupon
  const coupon = voucherCode.generate({ length: 5 });
  //save in Db
  await couponModel.create({
    name: coupon[0],
    createdBy: req.userData._id,
    discount: req.body.discount,
    expiredAt: new Date(req.body.expiredAt).getTime(),
  });
  //res
  return res.json({
    success: true,
    message: `Coupon created successfully`,
  });
};

// ^updateCoupon
export const updateCoupon = async (req, res, next) => {
  //check coupon
  const coupon = await couponModel.findOne({
    _id: req.params.id,
    expiredAt: { $gt: Date.now() },
  });
  if (!coupon) return next(new Error("This coupon not found", { cause: 404 }));
  //owner
  if (req.userData._id.toString() !== coupon.createdBy.toString())
    return next(new Error("Not Authorized", { cause: 403 }));
  //update
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt
    ? new Date(req.body.expiredAt).getTime()
    : coupon.expiredAt;
  await coupon.save();
  //res
  return res.json({
    success: true,
    message: "coupon updated successfully",
  });
};

// ^deleteCoupon
export const deleteCoupon = async (req, res, next) => {
  //check coupon
  const coupon = await couponModel.findOne({
    _id: req.params.id,
    expiredAt: { $gt: Date.now() },
  });
  if (!coupon) return next(new Error("This coupon not found", { cause: 404 }));
  //owner
  if (req.userData._id.toString() !== coupon.createdBy.toString())
    return next(new Error("Not Authorized", { cause: 403 }));
  //delete
  await coupon.deleteOne();
  //res
  return res.json({
    success: true,
    message: "coupon deleted successfully",
  });
};

// ^getCoupon
export const getCoupon = async (req, res, next) => {
  if (req.userData.role == "seller") {
    const coupons = await couponModel.find({ createdBy: req.userData._id });
    return res.json({
      success: true,
      coupons,
    });
  }
  const coupons = await couponModel.find();
  return res.json({
    success: true,
    coupons,
  });
};
