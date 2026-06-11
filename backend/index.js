const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware Global Pipeline Configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. MongoDB Database Connection Lifecycles
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce')
    .then(() => console.log("MongoDB database connected successfully!"))
    .catch((err) => console.log("Database connection error: ", err));

// 3. Router Module Imports
const authRoutes = require('./routes/auth'); 
const productRoutes = require('./routes/products'); 
const purchaseRoutes = require('./routes/orders'); 

// 4. API Core Endpoints / Base URL Mapping Architecture
app.use('/api/auth', authRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/purchase', purchaseRoutes); 

// 5. Root Entry Point Probe Route
app.get('/', (req, res) => {
    res.send("Backend server is ready and operational!");
});

// 6. Establish Server Core Port Listener 
app.listen(PORT, () => {
    console.log(`Server is actively running on port ${PORT}`);
});
