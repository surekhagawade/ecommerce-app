const express = require('express');
const app = express();
const PORT = 5000;
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes'); 

// 1. Root route visible when opening http://localhost:5000 directly in the browser
app.get('/', (req, res) => {
    res.send("Welcome! The server has been successfully started.");
});

// 2. Base test API route configuration
app.get('/api/test', (req, res) => {
    res.json({ message: "API test executed successfully!" });
});

// 3. API Core Endpoints / Base URL Mapping Architecture
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/purchase', purchaseRoutes); 

// 4. Establish Server Core Port Listener
app.listen(PORT, () => {
    console.log(`Server is actively running on http://localhost:${PORT}`);
});
