const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const productRoutes = require('./routes/product');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Use the product routes
app.use('/products', productRoutes);

// Create uploads directory if it does not exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
