// controllers/cartController.js
const Cart = require("../models/cart");
const Product = require("../models/product");
const { formatResponse } = require("../utils/responseFormatter");

exports.addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;
    if (!quantity) {
      return res
        .status(400)
        .json(formatResponse("Quantity is required", null));
    }
    if (!product_id) {
      return res
        .status(400)
        .json(formatResponse("Product ID is required", null));
    }

    // Validate product existence
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json(formatResponse("Product not found", null));
    }

    // Check if the product is already in the cart
    let cartItem = await Cart.findOne({ where: { user_id, product_id } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Add new product to the cart
      cartItem = await Cart.create({
        user_id,
        product_id,
        quantity,
        prod_name: product.prod_name,
        description: product.prod_description,
        price: product.price,
        product_total: product.price * quantity,
      });
    }

    res
      .status(201)
      .json(formatResponse("Product added to cart successfully", cartItem));
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;
    // check if count is a number
    if (isNaN(quantity)) {
      return res
        .status(400)
        .json(formatResponse("Count should be a number", null));
    }
    // check if count is greater than 0
    if (quantity <= 0) {
      return res
        .status(400)
        .json(formatResponse("Count should be greater than 0", null));
    }

    // Validate product existence
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json(formatResponse("Product not found", null));
    }

    // Check if the product is already in the cart
    let cartItem = await Cart.findOne({
      where: { user_id, product_id: productId },
    });
    if (!cartItem) {
      return res
        .status(404)
        .json(formatResponse("Product not found in cart", null));
    }

    cartItem.quantity = quantity;
    cartItem.product_total = product.price * quantity;
    await cartItem.save();

    res
      .status(200)
      .json(formatResponse("Cart item updated successfully", cartItem));
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user_id = req.user.id;

    // Check if the product is already in the cart
    let cartItem = await Cart.findOne({
      where: { user_id, product_id: productId },
    });
    if (!cartItem) {
      return res
        .status(404)
        .json(formatResponse("Product not found in cart", null));
    }

    await cartItem.destroy();

    res
      .status(200)
      .json(formatResponse("Product removed from cart successfully", null));
  } catch (error) {
    next(error);
  }
};

exports.getAllCartItems = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const cartItems = await Cart.findAll({ where: { user_id } });

    res
      .status(200)
      .json(formatResponse("Cart items retrieved successfully", cartItems));
  } catch (error) {
    next(error);
  }
};
exports.clearCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    await Cart.destroy({ where: { user_id } });

    res.status(200).json(formatResponse("Cart cleared successfully", null));
  } catch (error) {
    next(error);
  }
}