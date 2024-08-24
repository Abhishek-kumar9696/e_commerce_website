import express from "express";
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../controllers/productController.js";

import { protect,Admin } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect,Admin,createProduct);

router.route("/:id").get(getProductById).delete(protect,Admin,deleteProduct).put(protect,Admin,updateProduct);

// router.post("/createProduct", createProduct);


export default router;
