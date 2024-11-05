const express = require("express");
const { getAllVariantTypes } = require("../controllers/variantController");

const router = express.Router();
router.get("/all", getAllVariantTypes);

module.exports = router;
