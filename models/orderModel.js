const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    invoiceNumber: {
        type: Number,
        required: true
    },
    items: {
        type: Array,
        ref: 'Item',
    },
    totalAmount: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;