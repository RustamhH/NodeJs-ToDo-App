const mongoose = require("mongoose");

const basketSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
    },
  ],
  currency: {
    type: String,
    enum: ["$", "€", "₼"],
  },
  status: {
    type: String,
    enum: ["pending", "cancelled", "confirmed"],
    default:"pending"
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
});

const Basket = mongoose.model("Basket", basketSchema);

module.exports = Basket;