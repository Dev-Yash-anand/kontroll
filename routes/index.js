const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const userModel = require('../models/userModel')
const productModel = require('../models/productModel')

router.get("/", function(req, res) {
    const error = req.flash("error");
    res.render("index", { error, loggedIn: false })
})

router.get('/shop', isLoggedIn, async function(req, res) {
    try {
        const sortby = req.query.sortby || 'popular'; // Default to 'popular' if no sort option is provided
        let sortOption = {};

        if (sortby === 'newest') {
            sortOption = { createdAt: -1 }; // Sort by creation date, newest first
        } else {
            // For 'popular', you might want to implement your own logic
            // For now, we'll leave it as default (which is typically by _id)
            sortOption = {};
        }

        let products = await productModel.find().sort(sortOption);
        let success = req.flash("success");
        
        res.render('shop', { products, success, sortby });
    } catch (error) {
        console.error('Error fetching products:', error);
        req.flash('error', 'An error occurred while fetching products');
        res.redirect('/'); // Redirect to home page or error page
    }
});

router.get('/addtocart/:productid', isLoggedIn, async function(req, res) {
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect('/shop');
})

module.exports = router