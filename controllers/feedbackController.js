
const FeedBack= require('../models/productFeedback');

exports.getALlFeedback = async (req,res,next)=>{
    try {
        const feedback = await FeedBack.findAll();
        res.status(200).json(feedback)
    } catch (error) {
        next(error)
    }
}