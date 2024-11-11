
const { formatResponse } = require("../utils/responseFormatter");
 const Product = require("../models/product");
const Image = require("../models/image");
 const Variant = require("../models/variant");
const { deleteFiles } = require("../utils/deleteFile");

exports.createProduct = async (req, res, next) => {
    const {
      prod_name,
      price,
      quantity,
      prod_description,
      cost,
      prod_percent,
      best_seller,
      variants,
    } = req.body;
    console.log(req.body);
  
    // check null
    if (!prod_name || !price || !quantity || !cost) {
      if (req.files) {
        deleteFiles(req.files);
      }
      return res
        .status(400)
        .json(formatResponse("Please provide all required fields", null, false));
    }
    if (req.files.length < 1) {
      return res
        .status(400)
        .json(formatResponse("Please provide at least one image", null, false
        ));
    }
   
  
    const product = await Product.create({
      prod_name,
      prod_description,
      price,
      quantity,
      cost,
      prod_percent,
      best_seller,
  
    });
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        const { variant_id, value } = variant;
        await product.addVariant(variant_id, { through: { value } });
      }
    }
    console.log(product.id);
    // lưu vaào baảnbarngg anảnh sau khi coó id của product
    const images = req.files.map((file) => ({
       product_id: product.id,
      url: file.path,
    }));
    await Image.bulkCreate(images);
  
  
    try {
      res
        .status(201)
        .json(formatResponse("Product created successfully", product));
    } catch (error) {
      next(error);
    }
  };
  
  
  
  exports.updateProduct = async (req, res, next) => {
    try {
      console.log(req.files);
      const { id } = req.params;
      const { prod_name, prod_description, price, quantity, cost, prod_percent, best_seller, variants } = req.body;
  
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
        ],
      });
  
      if (!product) {
        if (req.files) {
          await deleteFiles(req.files);
        }
        return res.status(404).json(formatResponse("Product not found", null));
      }
  
      product.prod_name = prod_name || product.prod_name;
      product.prod_description = prod_description || product.prod_description;
      product.price = price || product.price;
      product.quantity = quantity || product.quantity;
      product.cost = cost || product.cost;
      product.prod_percent = prod_percent || product.prod_percent;
      product.best_seller = best_seller || product.best_seller;
  
      await product.save();
  
      if (variants && variants.length > 0) {
        await product.setVariants([]); // Xóa các variant cũ
        for (const variantData of variants) {
          const variant = await Variant.create({
            name: variantData.name,
            variantType_id: variantData.variantType_id,
          });
          await product.addVariant(variant);
        }
      }
  
      // Xóa các ảnh cũ nếu có ảnh mới được upload
      if (req.files && req.files.length > 0) {
        const oldImages = await Image.findAll({ where: { product_id: product.id } });
        const oldImagePaths = oldImages.map(image => image.url);
        console.log(oldImagePaths);
         await deleteFiles(oldImagePaths);
  
        await Image.destroy({ where: { product_id: product.id } });
  
        const newImages = req.files.map((file) => {
          if (file.path) {
            return {
              product_id: product.id,
              url: file.path,
            };
          }
        }).filter(image => image !== undefined); // Lọc ra các giá trị undefined
  
        if (newImages.length > 0) {
          await Image.bulkCreate(newImages);
        }
      }
  
      res.status(200).json(formatResponse("Product updated successfully", product));
    } catch (error) {
      next(error);
    }
  };
  
  exports.deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const product = await Product.findByPk(id, {
        include: [
          {
            model: Image,
            as: "images",
          },
        ],
      });
  
      if (!product) {
        return res.status(404).json(formatResponse("Product not found", null));
      }
  
      // Xóa các ảnh liên quan
      const images = await Image.findAll({ where: { product_id: product.id } });
      const imagePaths = images.map(image => image.url);
      console.log(imagePaths);
      await  deleteFiles(imagePaths);
  
      await Image.destroy({ where: { product_id: product.id } });
  
      // Xóa sản phẩm
      await product.destroy();
  
      res.status(200).json(formatResponse("Product deleted successfully", null));
    } catch (error) {
      next(error);
    }
  };