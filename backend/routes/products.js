const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); 

// 1. Add a new product (POST: http://localhost:5000/api/products)
router.post('/', async (req, res) => {
    try {
        const { title, description, imageUrl, price, category, stock } = req.body;

        const newProduct = new Product({
            title,
            description,
            imageUrl,
            price,
            category,
            stock
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully!", product: newProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Fetch all products (GET: http://localhost:5000/api/products)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Fetch a specific product by its ID (GET: http://localhost:5000/api/products/:id)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found!" });
        }
        
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
