const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get('/config-paypal', (req, res)=>{
    return res.status(200).json({
        status: 'OK',
        data: process.env.CLIENT_ID
    })
});

module.exports = router;
