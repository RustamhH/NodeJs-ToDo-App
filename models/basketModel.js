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
  },
});

const Basket = mongoose.model("Basket", basketSchema);

module.exports = Basket;