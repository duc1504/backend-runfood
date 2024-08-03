// models/order.model.js
const mongoose = require('mongoose');
const { use } = require('../routes/user.route');

const orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type:String,
            required: true
        },
        productId: {
            type: String,
            required: true
        },
        subTotal: {
            type: Number,
            required: true
        },
        image: {
            type: String
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    user: {
       type:String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        // required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    note: {
        type: String
        

    },
    status: {
        type: String,
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
