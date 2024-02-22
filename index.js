import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DB/connection.js";
import authRouter from "./src/modules/auth/auth.router.js";
import categoryRouter from "./src/modules/category/category.router.js";
import brandRouter from "./src/modules/brand/brand.router.js";
import subcategoryRouter from "./src/modules/subcategory/subcategory.router.js";
import couponRouter from "./src/modules/coupon/coupon.router.js";
import productRouter from "./src/modules/product/product.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import orderRouter from "./src/modules/order/order.router.js";
import reviewRouter from "./src/modules/review/review.router.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT;

// ^configration with frontEnd
// const whiteList = [""]; //front end url
// app.use((req, res, next) => {
//   if (req.originalUrl.includes("/auth/activation")) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET");
//     return next();
//   }

//   if (!whiteList.includes(req.header("origin"))) {
//     return next(new Error("Blocked by CORS!"));
//   }
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.setHeader("Access-Control-Allow-Private-Network", true);
//   return next();
// });

app.use(cors());
app.use(express.json());
await connectDB();

// &Routers
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/brand", brandRouter);
app.use("/subcategory", subcategoryRouter);
app.use("/coupon", couponRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/review", reviewRouter);

app.use("*", (req, res, next) => {
  return next(new Error("Page Not Found", { cause: 404 }));
});

// &Global error handler
app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res.status(statusCode).json({
    message: false,
    error: error.message,
    stack: error.stack,
  });
});

app.listen(port, () =>
  console.log(`E-Commerce app listening on port ${port}!`)
);
