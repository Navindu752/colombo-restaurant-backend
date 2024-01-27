const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { MAIN_DISHES, SIDE_DISHES, DESSERTS } = require("../utils/constants");

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [MAIN_DISHES, SIDE_DISHES, DESSERTS],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;