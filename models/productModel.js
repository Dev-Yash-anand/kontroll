const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: Buffer,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    name: String,
    bgcolor: String, 
    panelcolor: String,
    textcolor: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

module.exports = mongoose.model('product', productSchema);