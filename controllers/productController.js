const Product = require('../models/product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

const createProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body;

    try {
        if( req.user.isAdmin == true )
        {const newProduct = new Product({ name, description, price, stock, category });
        const product = await newProduct.save();
        res.json(product);}
        else{
            res.status(500).send('Only admin Allowed');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
};

const updateProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body;

    try {
        if( req.user.isAdmin == true )
        {let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.category = category || product.category;

        await product.save();
        res.json(product);}
        else
        {
            res.status(500).send('Only admin Allowed');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
};

const deleteProduct = async (req, res) => {
    try {

        if( req.user.isAdmin == true ){   
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        await product.remove();
        res.json({ msg: 'Product removed' });
        }
        else
        {
            res.status(500).send('Only admin Allowed');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
