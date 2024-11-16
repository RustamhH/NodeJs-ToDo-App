const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    require: true,
  },
  currency: {
    type: String,
    enum: ["$", "€", "₼"],
  },
  category: {
    type: String,
    enum: ["Tech", "Fashion", "Cars"],
  },
  stock: {
    type: Number,
  },
  gallery: {
    type: [String],
  },
});


const Product = mongoose.model("Product", productSchema);

module.exports = Product;