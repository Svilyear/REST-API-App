const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');

// Set up multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
});

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vill@4171#',
    database: 'nodejs_rest_api',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Get all products
router.get('/', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get a product by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const product = results[0];
            // Construct the image URL
            if (product.image) {
                product.imageUrl = `http://localhost:3000/uploads/${product.image}`;
            } else {
                product.imageUrl = null;
            }
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    });
});

// Create a new product with optional image
router.post('/', upload.single('image'), (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.filename : '';

    db.query('INSERT INTO products (name, description, image, price) VALUES (?, ?, ?, ?)', [name, description,image, price ], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Product added successfully', id: result.insertId });
    });
});

// Update a product
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    db.query('UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?', [name, description, price, id], (err) => {
        if (err) throw err;
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete a product
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Product deleted successfully' });
    });
});

module.exports = router;
