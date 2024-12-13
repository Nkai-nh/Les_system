require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./config/database");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const blogRoutes = require("./routes/blogRoutes");
const orderRoutes = require("./routes/orderRoutes");
const variantRoutes = require("./routes/variantRoutes");
const errorHandler = require("./middlewares/errorHandler");
const adminRoutes = require('./routes/adminRoutes');
const manageRoutes = require('./routes/manageRoutes');
const PaymentRoutes = require('./routes/paymentRoutes');
const AddressRoutes = require('./routes/deliveryAddressRoutes');
const FavoriteRoutes = require('./routes/favorites');
const { authorize } = require("./middlewares/authMiddleware");
const { authenticate } = require("./middlewares/authMiddleware");

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Thay 'http://localhost:5000' bằng URL của frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization'] // Các headers được phép
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static('uploads'));

app.use('/api/blog',blogRoutes )
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/payment", PaymentRoutes);
app.use("/api/address", AddressRoutes);
app.use("/api/favorites", FavoriteRoutes);
// Route cho quản trị viên (Admin)
app.use('/api/admin', adminRoutes);
app.use('/api/manager', manageRoutes);

app.get("/user",authenticate,authorize(["user"]), (req, res) => {
  res.send("Welcome to the API");
});
app.get("/admin",authenticate, authorize(["admin"]), (req, res) => {
  res.send("Welcome to the API");
});

app.use(errorHandler);

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
