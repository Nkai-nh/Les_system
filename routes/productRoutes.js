const express = require("express");
const {
  getAllProducts,
  getProductById,
  monitorInventory,
   
} = require("../controllers/productController");
const  { createProduct, updateProduct, deleteProduct } = require("../controllers/productManageController");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();
router.get("/inventory", monitorInventory);
router.get("/all", getAllProducts);
router.get("/:id", getProductById);
router.post("/manage/add", upload.array("image", 5), createProduct);
router.put("/manage/update/:id", upload.array("image", 5), updateProduct);
router.delete("/manage/delete/:id", deleteProduct);

module.exports = router;
