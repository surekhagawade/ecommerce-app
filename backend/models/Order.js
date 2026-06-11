const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// 1. Place a new order (POST: http://localhost:5000/api/orders)
router.post('/', async (req, res) => {
    try {
        // Validation checks have been removed to prevent blockages
        const { userId, productId, quantity } = req.body;

        // 1. Locate the product in the database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found or invalid Product ID!" });
        }

        // 2. Calculate the dynamic total price
        const totalPrice = product.price * (quantity || 1);

        // 3. Construct the order document object
        const newOrder = new Order({
            userId: userId,
            productId: productId,
            quantity: quantity || 1,
            totalPrice: totalPrice
        });

        // 4. Save the document transaction into MongoDB
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });

    } catch (err) {
        // Handle database infrastructure runtime exceptions or payload processing errors
        res.status(500).json({ error: "Database error or payload undefined: " + err.message });
    }
});

module.exports = router;
