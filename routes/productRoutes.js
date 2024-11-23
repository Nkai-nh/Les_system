const express = require("express");
const {
  getAllProducts,
  getProductById,
  monitorInventory,
   
} = require("../controllers/productController");
const  { createProduct, updateProduct, deleteProduct } = require("../controllers/productManageController");
const upload = require("../middlewares/uploadMiddleware");
const { getAllIvoice } = require("../controllers/invoiceController");
const { getAllCoupons } = require("../controllers/couponController");
const { getALlFeedback } = require("../controllers/feedbackController");
const router = express.Router();
router.get("/inventory", monitorInventory);
router.get("/all", getAllProducts);
router.get("/:id", getProductById);
router.post("/manage/add", upload.array("image", 5), createProduct);
router.put("/manage/update/:id", upload.array("image", 5), updateProduct);
router.delete("/manage/delete/:id", deleteProduct);


router.get("/feedback/all", getALlFeedback);
router.get("/coupons/all", getAllCoupons)

router.get("/invoices/all", getAllIvoice);
module.exports = router;
