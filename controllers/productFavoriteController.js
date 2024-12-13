const ProductFavorite = require('../models/productFavorite');
const Product = require('../models/product');
const Image = require('../models/image');

// Lấy tất cả sản phẩm yêu thích của người dùng với thông tin tên, giá và hình ảnh
exports.getAllFavorites = async (req, res) => {
    const { user_id } = req.params;
    console.log('user_id', user_id);

    try {
        const favorites = await ProductFavorite.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'prod_name', 'price'], // Lấy cả id
                    include: [
                        {
                            model: Image,
                            as: 'images', // Đảm bảo alias đúng
                            attributes: ['url'],
                        },
                    ],
                },
            ],
        });

        console.log('favorites:', favorites);

        const result = favorites.map(favorite => {
            const product = favorite.Product || {}; // Nếu không có Product, trả về đối tượng rỗng
            return {
                favorite_id: favorite.id || null,
                product_id: product.id || null,
                prod_name: product.prod_name || 'Unknown',
                price: product.price || 0,
                images: product.images ? product.images.map(image => image.url) : [], // Sử dụng đúng alias
            };
        });

        console.log('result:', result);

        res.status(200).json({
            message: 'Lấy danh sách sản phẩm yêu thích thành công',
            data: result,
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm yêu thích', error });
    }
};
// Thêm sản phẩm yêu thích
exports.addFavorite = async (req, res) => {
    try {
        const newFavorite = await ProductFavorite.create(req.body);
        res.status(201).json(newFavorite);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm sản phẩm yêu thích', error });
    }
};

// Xóa sản phẩm yêu thích
exports.removeFavorite = async (req, res) => {
    const { id } = req.params;
    console.log('id',id)
    try {
        const deletedFavorite = await ProductFavorite.destroy({
            where: { id },
        });
        if (deletedFavorite) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Sản phẩm yêu thích không tìm thấy' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm yêu thích', error });
    }
};