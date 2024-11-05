const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {timestamps: true})

const Todo = mongoose.model("Todo", todoSchema)

module.exports = Todo