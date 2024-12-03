const express = require('express');
 const blogCtrl= require("../controllers/blogController.js")
const router = express.Router();

   
router.get('/all', blogCtrl.getAllBlog);
module.exports = router;