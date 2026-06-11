const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const auth = require('../middleware/auth'); // Import authentication middleware

// 1. Process a new purchase order (POST: http://localhost:5000/api/purchase)
router.post('/', auth, async (req, res) => {
    try {
        const { productId, quantity, totalPrice } = req.body;

        // Construct the purchase document object
        const newPurchase = new Purchase({
            userId: req.user.id, // User ID is extracted automatically from the verified JWT token
            productId,
            quantity,
            totalPrice
        });

        // Save the transaction payload into the database collection
        await newPurchase.save();
        res.status(201).json({ message: "Order processed successfully!", order: newPurchase });
    } catch (err) {
        // Handle runtime exceptions or database validation query errors
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
