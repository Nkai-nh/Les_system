const VariantType = require("../models/variantType");
const Variant = require("../models/variant");
const { formatResponse } = require("../utils/responseFormatter");

exports.getAllVariantTypes = async (req, res, next) => {
  try {
    const variantTypes = await VariantType.findAll({
      include: [
        {
          model: Variant,
          as: 'variants',
        },
      ],
    });
    res
      .status(200)
      .json(
        formatResponse("Variant types retrieved successfully", variantTypes)
      );
  } catch (error) {
    next(error);
  }
};