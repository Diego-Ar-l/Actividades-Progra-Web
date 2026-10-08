import { Router } from "express";
import { ProductController } from "../controllers/products.controller.ts";

const router = Router();
const productController = new ProductController();

router.get("/getAll", productController.getAll);
router.get("/getById/:id", productController.getById);
router.post("/create", productController.createProduct);
router.put("/update/:id", productController.updateProductById);
router.delete("/delete/:id", productController.deleteProduct);
router.patch("/change-price/:id", productController.changePrice);

export default router;