require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const sequelize = require('./config/database');
const User = require('./models/user');
const Product = require('./models/product');
const ProductReview = require('./models/productReview');
const ProductFavorite = require('./models/productFavorite');
const ProductVariant = require('./models/productVariant');
const ProductVariantAttribute = require('./models/productVariantAttribute');
const Cart = require('./models/cart');
const Order = require('./models/order');
const OrderDetail = require('./models/orderDetail');
const Category = require('./models/category');
const DeliveryAddress = require('./models/deliveryAddress');
const Image = require('./models/image');
const ProvidedUser = require('./models/providedUser');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });

        // Create Users
        const users = await User.bulkCreate([
            {
                id: uuidv4(),
                name: 'John Doe',
                password: 'password123',
                email: 'john@example.com',
                provider: 'local',
                phone: '1234567890',
                registration_token: null,
                confirmation_status: 'confirmed',
                subject: 'subject1',
                default_address: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Jane Smith',
                password: 'password123',
                email: 'jane@example.com',
                provider: 'local',
                phone: '0987654321',
                registration_token: null,
                confirmation_status: 'confirmed',
                subject: 'subject2',
                default_address: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Create Categories
        const categories = await Category.bulkCreate([
            {
                category_id: uuidv4(),
                name: 'Electronics',
                description: 'Electronic gadgets and devices',
                createdAt: new Date(),
                updatedAt: new Date(),
                slug: 'electronics'
            },
            {
                category_id: uuidv4(),
                name: 'Books',
                description: 'Books and literature',
                createdAt: new Date(),
                updatedAt: new Date(),
                slug: 'books'
            }
        ]);

        // Create Products
        const products = await Product.bulkCreate([
            {
                id: uuidv4(),
                category_id: categories[0].category_id,
                prod_name: 'Smartphone',
                prod_description: 'Latest model smartphone',
                price: 699.99,
                cost: 499.99,
                quantity: 100,
                prod_percent: 10,
                best_seller: true,
                ratings: 4,
                expiration_date: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                category_id: categories[1].category_id,
                prod_name: 'Novel',
                prod_description: 'Bestselling novel',
                price: 19.99,
                cost: 9.99,
                quantity: 200,
                prod_percent: 5,
                best_seller: false,
                ratings: 5,
                expiration_date: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Create Product Variants
        const productVariants = await ProductVariant.bulkCreate([
            {
                id: uuidv4(),
                product_id: products[0].id,
                price: 699.99,
                quantity: 50,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                product_id: products[1].id,
                price: 19.99,
                quantity: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Create Product Variant Attributes
        await ProductVariantAttribute.bulkCreate([
            {
                id: uuidv4(),
                variant_id: productVariants[0].id,
                key: 'color',
                value: 'black',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                variant_id: productVariants[1].id,
                key: 'size',
                value: 'large',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Create Product Reviews
        await ProductReview.bulkCreate([
            {
                id: uuidv4(),
                product_id: products[0].id,
                user_id: users[0].id,
                rating: 5,
                comment: 'Great product!',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                product_id: products[1].id,
                user_id: users[1].id,
                rating: 4,
                comment: 'Very interesting read.',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Create Product Favorites
        await ProductFavorite.bulkCreate([
            {
                id: uuidv4(),
                product_id: products[0].id,
                user_id: users[0].id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                product_id: products[1].id,
                user_id: users[1].id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Create Cart Items
        await Cart.bulkCreate([
            {
                user_id: users[0].id,
                product_id: products[0].id,
                prod_name: 'Smartphone',
                description: 'Latest model smartphone',
                avatar: 'smartphone.jpg',
                price: 699.99,
                is_possible_to_order: true,
                count: 1,
                product_total: 699.99,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                user_id: users[1].id,
                product_id: products[1].id,
                prod_name: 'Novel',
                description: 'Bestselling novel',
                avatar: 'novel.jpg',
                price: 19.99,
                is_possible_to_order: true,
                count: 2,
                product_total: 39.98,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Create Orders
        const orders = await Order.bulkCreate([
            {
                id: uuidv4(),
                paymentMethods: 'Credit Card',
                name: 'John Doe',
                phone: '1234567890',
                address: '123 Main St',
                is_payment: true,
                is_transported: false,
                is_success: false,
                is_cancelled: false,
                cancel_at: null,
                total: 699.99,
                note: 'Please deliver between 9 AM and 5 PM',
                user_id: users[0].id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                paymentMethods: 'PayPal',
                name: 'Jane Smith',
                phone: '0987654321',
                address: '456 Elm St',
                is_payment: true,
                is_transported: true,
                is_success: true,
                is_cancelled: false,
                cancel_at: null,
                total: 39.98,
                note: 'Leave at the front door',
                user_id: users[1].id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Create Order Details
        await OrderDetail.bulkCreate([
            {
                product_id: products[0].id,
                order_id: orders[0].id,
                quantity: 1,
                price: 699.99,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                product_id: products[1].id,
                order_id: orders[1].id,
                quantity: 2,
                price: 19.99,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Create Delivery Addresses
        await DeliveryAddress.bulkCreate([
            {
                id: uuidv4(),
                user_id: users[0].id,
                detail_address: '123 Main St',
                province: 'Province1',
                district: 'District1',
                ward: 'Ward1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                user_id: users[1].id,
                detail_address: '456 Elm St',
                province: 'Province2',
                district: 'District2',
                ward: 'Ward2',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Create Images
        await Image.bulkCreate([
            {
                image_id: uuidv4(),
                product_id: products[0].id,
                url: 'smartphone.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                image_id: uuidv4(),
                product_id: products[1].id,
                url: 'novel.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Create Provided Users
        await ProvidedUser.bulkCreate([
            {
                user_id: users[0].id,
                name: 'John Doe',
                email: 'john@example.com',
                provider: 'local',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                user_id: users[1].id,
                name: 'Jane Smith',
                email: 'jane@example.com',
                provider: 'local',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
    }
};

seedDatabase();