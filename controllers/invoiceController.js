const  Invoice = require("../models/invoice")

exports.getAllIvoice = async( req,res,next )=>{
    try {
        const discounts = await Invoice.findAll();
        res.status(200).json(discounts);
      } catch (error) {
        next(error);
      }
}