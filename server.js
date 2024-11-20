const express = require("express")
const { connectToDb } = require("./utils/dbutils")
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const basketRoutes = require('./routes/basketRoutes');
const { rateLimit } = require("express-rate-limit");
const cluster = require("cluster");
const os = require("os");
const cors=require("cors");

const { authenticateAccessToken } = require('./middleware/authMiddleware');

const app = express()
app.use(express.json())
app.use(
  cors()
)

connectToDb()

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/baskets", basketRoutes);

app.use(authenticateAccessToken)

const PORT = process.env.PORT

const limiter = rateLimit({
    limit: 100,
    headers: true,
});

app.use(limiter);

if (cluster.isMaster) {
  const CPUs = os.cpus().length;
  for (let i = 0; i < CPUs; i++) {
    cluster.fork();
  }
} else {
  app.listen(PORT, () => {
    console.log(`worker process ${process.pid} is listening on port ${PORT}`);
  });
}