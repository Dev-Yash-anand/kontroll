const express = require('express');
const router = express.Router();
const ownerModel = require('../models/ownerModel');
const productModel = require('../models/productModel');
const isOwner = require('../middlewares/isOwner');
const dotenv = require('dotenv');
const upload = require('../config/multer-config');

dotenv.config();

router.get('/', function(req, res) {
    res.send('hey its working...');
})

if(process.env.NODE_ENV === "development") {
    router.post('/create',async (req, res ) => {
        let owner = await ownerModel.find();
        if (owner.length > 0) {
            return res.
            status(500).send('owner already created')
        }

        let {fullname, email, password} = req.body;

        let createdOwner =await ownerModel.create({
            fullname, 
            email, 
            password
        });

        res.status(200).send(createdOwner);
    })
}

router.get('/login', function(req, res) {
    res.render('login', { 
        error: req.flash('error'),
        success: req.flash('success')
    });
})

router.post('/login', function(req, res) {
    const { username, password } = req.body;
    
    // Hardcoded credentials
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
        // Successful login
        req.session.isOwner = true; // Set a session variable to remember the login\
        req.flash('success', 'Logged in successfully');
        res.redirect('/owners/admin');
    } else {
        req.flash('error', 'Invalid credentials');
        res.redirect('/owners/login');
    }
});

router.get('/admin', isOwner, function(req, res) {
    let success = req.flash('success')
    res.render("createproducts", {success})
})

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/owners/login');
})

router.get('/all-products', isOwner, async function(req, res) {
    try {
        let products = await productModel.find();
        res.render("allproducts", {products, success: req.flash('success')});
    } catch (error) {
        console.error('Error fetching products:', error);
        req.flash('error', 'An error occurred while fetching products');
    }
})

router.post('/delete-product/:id', isOwner, async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        req.flash('success', 'Product deleted successfully');
        res.redirect('/owners/all-products');
    } catch (error) {
        console.error('Error deleting product:', error);
        req.flash('error', 'An error occurred while deleting the product');
        res.redirect('/owners/all-products');
    }
});

router.get('/edit-product/:id', isOwner, upload.single('image'), async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/owners/all-products');
        }
        res.render('editproduct', { product , error: req.flash('error') });
    } catch (error) {
        console.error('Error fetching product:', error);
        req.flash('error', 'An error occurred while fetching the product');
        res.redirect('/owners/all-products');
    }
});

router.post('/update-product/:id', isOwner, upload.single('image'), async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        let {price, discount, name, bgcolor, panelcolor, textcolor} = req.body;
        
        // Prepare the update object
        let updateData = {
            price,
            discount,
            name,
            bgcolor,
            panelcolor,
            textcolor
        };

        // If a new image is uploaded, add it to the update data
        if (req.file) {
            updateData.image = req.file.filename;
        }

        console.log('Update data:', updateData);

        // Perform the update in a single operation
        let updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id, 
            updateData,
            {new: true, runValidators: true}
        );

        console.log('Updated product:', updatedProduct);

        req.flash('success', 'Product updated successfully');
        res.redirect('/owners/all-products');
    } catch (error) {
        console.error('Error updating product:', error);
        req.flash('error', 'An error occurred while updating the product');
        res.redirect('/owners/all-products');
    }
});

module.exports = router;