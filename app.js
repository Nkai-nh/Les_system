require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./config/database");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const variantRoutes = require("./routes/variantRoutes");
const errorHandler = require("./middlewares/errorHandler");
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));


app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/variants", variantRoutes);
// Route cho quản trị viên (Admin)
app.use('/api/admin', adminRoutes);

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