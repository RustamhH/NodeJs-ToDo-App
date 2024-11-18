const express = require("express")
const { connectToDb } = require("./utils/dbutils")
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const basketRoutes = require('./routes/basketRoutes');

const { authenticateAccessToken, authorizeUser } = require('./middleware/authMiddleware');

const app = express()
app.use(express.json())

connectToDb()

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/baskets", basketRoutes);

app.use(authenticateAccessToken)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});