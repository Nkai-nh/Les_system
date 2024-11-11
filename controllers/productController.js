const { formatResponse } = require("../utils/responseFormatter");
const { Op } = require("sequelize");
const Product = require("../models/product");
const Image = require("../models/image");
const ProductReview = require("../models/productReview");
const Variant = require("../models/variant");

exports.getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      minPrice,
      maxPrice,
      sort = "asc",
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where.prod_name = { [Op.like]: `%${search}%` };
    }

    if (minPrice) {
      where.price = { ...where.price, [Op.gte]: parseFloat(minPrice) };
    }

    if (maxPrice) {
      where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
    }

    const order = [["price", sort === "desc" ? "DESC" : "ASC"]];

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
      include: [
        {
          model: Variant,
          as: "variants",
          through: { attributes: [] },
        },
        {
          model: Image,
          as: "images",
        },
        {
          model: ProductReview,
          as: "reviews",
        },
      ],
    });

    res.status(200).json(
      formatResponse("Products retrieved successfully", {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        products: rows,
      })
    );
  } catch (error) {
    next(error);
  }
};

// get by id

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
  

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Variant,
          as: "variants",
          through: { attributes: [] },
        },
        {
          model: Image,
          as: "images",
        },
        {
          model: ProductReview,
          as: "reviews",
        },
      ],
    });

    if (!product) {
      return res
        .status(404)
        .json(formatResponse("Product not found", null, false));
    }

    res
      .status(200)
      .json(formatResponse("Product retrieved successfully", product));
  } catch (error) {
    next(error);
  }
};
exports.monitorInventory = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [["quantity", "ASC"]],
    });
    res
      .status(200)
      .json(formatResponse("Inventory monitored successfully", products));
  } catch (error) {
    next(error);
  }
};

