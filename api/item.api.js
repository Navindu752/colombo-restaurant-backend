const mongoose = require("mongoose");
const Item = require("../models/itemModel");
const { ITEM_ALREADY_EXISTS, ITEM_CREATE_SUCCESS } = require("../utils/constants");

async function insertNewItem(payload) {
    // Start a new session
    const session = await mongoose.startSession();
    try {
        // Start a transaction
        session.startTransaction();
        // Create a new item with payload
        const findItemName = await Item.findOne({ name: payload.name });
        // if item already exists
        if (findItemName) {
            return { message: ITEM_ALREADY_EXISTS, status: 400 };
        }
        const itemData = new Item(payload);
        // Save the item document to the database using the session
        await itemData.save({ session });
        // Commit the transaction
        await session.commitTransaction();
        // Return success message and status
        return { message: ITEM_CREATE_SUCCESS, status: 200 };
    } catch (error) {
        console.log(error); // do-not remove
        // Abort the transaction on error
        await session.abortTransaction();
        // Return error status and message
        return { status: 400, message: error };
    } finally {
        // End the session
        await session.endSession();
    }
}

async function getAllItems() {
    try {
        // Find all items
        const result = await Item.find();
        return { data: result, status: 200 };
    } catch (error) {
        return error;
    }
}

module.exports = { insertNewItem, getAllItems }
