const express = require("express");
const router = express.Router();
const {authenticateAccessToken} = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");
const Basket = require("../models/basketModel");


router.get("/",authenticateAccessToken, async (req,res)=>{
    try {
        const baskets = await Basket.find();
        res.json(baskets);
    } catch (err) {
        res.status(400).send(err);
    }
});


router.get("/:id", authenticateAccessToken, async (req, res) => {
    const basket = await Basket.findById(req.params.id);
    if (basket) res.json(basket);
    else res.send("Invalid basket id"); 
});



router.post('/create', authenticateAccessToken, isAdmin, async (req, res) => {
    try {
        const { products , currency, status } = req.body;
        const basket = new Basket({products,currency,status});
        await basket.save();
        res.status(200).send("Basket created succesfully");
    } 
    catch (err) {
        res.status(400).send(err);
    }
});

router.put("/edit/:id", authenticateAccessToken, isAdmin, async (req, res) => {
    try {    
        const updateSuccessful = await Basket.findByIdAndUpdate(req.params.id, req.body);
        updateSuccessful ? res.status(201).json(updateSuccessful) : res.status(400).json({message: "Error while updating basket"})
    }
    catch {
        res.status(400).json({ message: 'Invalid basket ID' });
    }
});


router.delete('/delete/:id', authenticateAccessToken,isAdmin, async (req, res) => {
    try {
      const basketDeleted = await Basket.findByIdAndDelete(req.params.id);
      basketDeleted ? res.status(204).json({ message: 'Basket deleted' }) : res.status(400).json({ message: 'Error while deleting basket' })
    } catch {
      res.status(400).json({ message: 'Invalid basket ID' });
    }
});



router.put("/addProductToBasket/:id",authenticateAccessToken, async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const basket = await Basket.findById(req.params.id);
      if (basket==null) res.status(400).json({ message: 'Invalid basket ID' });
  
      basket.products.push({
        productId: productId,
        quantity: quantity,
      });
  
      await basket.save();
      res.status(200).send("Product added to your basket succesfully");

    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports=router;