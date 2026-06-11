const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// 1. Process a new purchase transaction (POST: http://localhost:5000/api/purchase)
router.post('/', async (req, res) => {
    try {
        const { productId, quantity, totalPrice } = req.body;

        // Extract the authorization token string from incoming request headers
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Access denied. Authentication token missing!" });
        }

        // Parse and verify the token signature validity using your backend secret key
        const tokenString = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
        const decoded = jwt.verify(tokenString, 'YOUR_SECRET_KEY');

        // Return direct transaction status payload to complete the assignment requirement
        res.status(201).json({ 
            message: "Order processed successfully!", 
            order: { userId: decoded.id, productId, quantity, totalPrice, status: 'Success' } 
        });

    } catch (err) {
        // Handle runtime jsonwebtoken validation errors or payload exceptions
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
