const express = require("express");
const router = express.Router();
const {authenticateAccessToken} = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");
const Product = require("../models/productModel");

router.post("/create", authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { title, description, price, currency, category, stock, gallery } = req.body;
        const newProduct = new Product({title,description,price,currency,category,stock,gallery});
        await newProduct.save();
        res.status(200).send("OK");
    } 
    catch (err) {
        res.status(400).send(err);
    }
});

router.put("/edit/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try {    
        const updateSuccessful = await Product.findByIdAndUpdate(req.params.id, req.body);
        updateSuccessful ? res.status(201).json(updateSuccessful) : res.status(400).json({message: "Error while updating product"})
    }
    catch {
        res.status(400).json({ message: 'Invalid product ID' });
    }
});


router.delete('/delete/:id', authenticateAccessToken,isAdmin, async (req, res) => {
    try {
      const productDeleted = await Product.findByIdAndDelete(req.params.id);
      productDeleted ? res.status(204).json({ message: 'Product deleted' }) : res.status(400).json({ message: 'Error while deleting product' })
    } catch {
      res.status(400).json({ message: 'Invalid product ID' });
    }
});