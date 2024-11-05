const express = require("express")
const { connectToDb } = require("./utilfol/dbutils")
require('dotenv').config();
const userRoutes = require('./routefol/userRoutes');
const todoRoutes = require('./routefol/todoRoutes');
const authRoutes = require('./routefol/authRoutes');
const { authenticateToken, authorizeUser } = require('./middleware/authMiddleware');

const app = express()
app.use(express.json())

connectToDb()

app.use("/todos", todoRoutes)
app.use("/users", userRoutes)
app.use("/auth", authRoutes)
app.use(authenticateToken)
app.use(authorizeUser)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});