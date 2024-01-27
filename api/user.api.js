const User = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USER_NAME_ALREADY_EXISTS, ACCOUNT_CREATE_SUCCESS, PASSWORD_IS_REQUIRED, PLEASE_INSERT_USER_NAME_AND_PASSWORD, USER_NAME_NOT_FOUND, LOGIN_SUCCESS, INVALID_PASSWORD } = require('../utils/constants');
const mongoose = require("mongoose");
require('dotenv').config(); // to load .env file content


async function insertNewUser(payload) {
    const session = await mongoose.startSession();
    try {
        // Start a transaction
        session.startTransaction();
        // Check if user already exists
        const result = await User.findOne({ userName: { $regex: payload.userName, $options: 'i' } }).session(session);
        if (result) {
            // return error if user already exists
            return { message: USER_NAME_ALREADY_EXISTS, status: 400 };
        } else {
            // check if password is provided
            if (payload.password) {
                // Hash the password
                const hashedPassword = await bcrypt.hash(payload.password, 12)
                const data = { ...payload, password: hashedPassword }
                // Create a new user
                const newUser = new User(data);
                await newUser.save({ session });
                await session.commitTransaction();
                return { message: ACCOUNT_CREATE_SUCCESS, status: 200 };
            }else {
                // return error if password is not provided
                return { message: PASSWORD_IS_REQUIRED, status: 400 };
            }
        }
    } catch (error) {
        console.log(error); // do-not remove
        // Abort the transaction on error
        await session.abortTransaction();
        return { status: 400, message: err };
    } finally {
        // End the session
        await session.endSession();
    }
};

async function loginUser(payload) {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { userName, password } = payload;
        // Check if userName and password are provided
        if (!userName || !password) {
            return { message: PLEASE_INSERT_USER_NAME_AND_PASSWORD, status: 400 };
        }
        // Find the user with the provided email
        const savedUser = await User.findOne({ userName: userName }).session(session);
        // Check if the user exists
        if (!savedUser) {
            return { message: USER_NAME_NOT_FOUND, status: 404 };
        }
        // Compare the provided password with the saved user's password
        const doMatch = await bcrypt.compare(password, savedUser.password);
        if (doMatch) {
            // Generate an access token with user information
            const accessToken = jwt.sign({
                id: savedUser._id,
                userName: savedUser.userName
            }, process.env.JWT_KEY, { expiresIn: '1d' });
            // Update the user's token in the database
            await User.updateOne({ _id: savedUser._id }, { accessToken: accessToken }).session(session);
            let returnUser = await User.findOne({ _id: savedUser._id },'_id userName accessToken').session(session);
            // Return the login success message and user data
            await session.commitTransaction();
            return ({
                message: LOGIN_SUCCESS,
                data: returnUser,
                status: 200
            });
        } else {
            return { message: INVALID_PASSWORD, status: 403 };
        }
    } catch (error) {
        console.log(error); // do-not remove
        await session.abortTransaction();
        return { status: 400, message: err };
    } finally {
        await session.endSession();
    }
}

async function logoutUser(id) {
    try {
        // Update the user's token in the database
        const doc = await User.updateOne({ _id: id }, { accessToken: null });
        return doc
    } catch (error) {
        return error;
    }
}

module.exports = { loginUser, logoutUser, insertNewUser }
