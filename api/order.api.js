const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const { ORDER_CREATE_SUCCESS, MAIN_DISHES, SIDE_DISHES } = require("../utils/constants");

async function insertNewOrder(payload) {
    // Start a new session
    const session = await mongoose.startSession();
    try {
        // Start a transaction
        session.startTransaction();
        // Create a new order with payload
        const invoiceNumber = await Order.find({}).count();
        const newPayload = { ...payload, invoiceNumber: invoiceNumber + 100 };
        const orderData = new Order(newPayload);
        // Save the order document to the database using the session
        await orderData.save({ session });
        // Commit the transaction
        await session.commitTransaction();
        // Return success message and status
        return { message: ORDER_CREATE_SUCCESS, status: 200 };
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

async function getAllOrder(page_number) {
    try {
        let start = (parseInt(page_number) - 1) * 10
        let end = (parseInt(page_number)) * 10
        // find all orders in descending order
        const result = await Order.find().sort({ createdAt: -1 }).populate('items');
        // slice the result to get 10 orders at a time
        const doc = await result.slice(start, end);
        return { data: doc, status: 200 };
    } catch (error) {
        return error;
    }
}

async function getAllOrderPageCount() {
    try {
        // Find all orders
        const doc = await Order.find({}, '_id')
        // Calculate total number of pages
        let totalNumberOfPages = ((doc?.length / 10) + 0.4).toFixed();
        return totalNumberOfPages
    } catch (error) {
        return error;
    }
}

// Function to find most consumed main and side dishes
function findMostConsumedDishes(orders) {
    // Initialize counters
    const mainDishesCounter = {};
    const sideDishesCounter = {};
    const mainAndSideCombinationsCounter = {};
    // Loop through orders
    for (const order of orders) {
        // Loop through items
        for (const item of order.items) {
            const dishName = item.name;
            const dishType = item.type;
            // Count main and side dishes
            if (dishType === MAIN_DISHES) {
                mainDishesCounter[dishName] = (mainDishesCounter[dishName] || 0) + 1;
            } else if (dishType === SIDE_DISHES) {
                sideDishesCounter[dishName] = (sideDishesCounter[dishName] || 0) + 1;

                // Count combinations of main and side dishes
                for (const mainDish of order.items.filter(i => i.type === MAIN_DISHES)) {
                    const combinationKey = `${mainDish.name}-${dishName}`;
                    mainAndSideCombinationsCounter[combinationKey] = (mainAndSideCombinationsCounter[combinationKey] || 0) + 1;
                }
            }
        }
    }

    // Find most consumed main and side dishes
    const mostConsumedMainDish = Object.keys(mainDishesCounter).reduce((a, b) => mainDishesCounter[a] > mainDishesCounter[b] ? a : b);
    const mostConsumedSideDish = Object.keys(sideDishesCounter).reduce((a, b) => sideDishesCounter[a] > sideDishesCounter[b] ? a : b);

    // Find most consumed combination
    const mostConsumedCombination = Object.keys(mainAndSideCombinationsCounter).reduce((a, b) => mainAndSideCombinationsCounter[a] > mainAndSideCombinationsCounter[b] ? a : b);

    return {
        mostConsumedMainDish,
        mostConsumedSideDish,
        mostConsumedCombination
    };
}

async function getAllReports(date) {
    try {
        // Find all orders created on the given date
        const doc = await Order.find({ createdAt: { $gte: new Date(date) } }).populate('items');
        // get all orders from the database
        const allOrders = await Order.find().populate('items');
        // Calculate total daily revenue
        const totalDailyRevenue = doc?.reduce((acc, item) => acc + item?.totalAmount, 0);
        // Find most consumed main and side dishes and combinations using the helper function
        const { mostConsumedMainDish, mostConsumedSideDish, mostConsumedCombination } = findMostConsumedDishes(allOrders);
        // modified return data
        const returnData = [
            { value: `Rs.${totalDailyRevenue ? totalDailyRevenue : 0}`, name: "Daily sales revenue" },
            { value: mostConsumedMainDish, name: "Most famous main dish" },
            { value: mostConsumedSideDish, name: "Most famous side dish" },
            { value: mostConsumedCombination, name: "Most famous combination" }
        ]
        return { data: returnData, status: 200 }
    } catch (error) {
        return error;
    }
}

module.exports = { insertNewOrder, getAllOrder, getAllOrderPageCount, getAllReports }
