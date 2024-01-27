

// success messages
const ACCOUNT_CREATE_SUCCESS = "Account created successfully"
const ITEM_CREATE_SUCCESS ="Item created successfully"
const ORDER_CREATE_SUCCESS="Order created successfully"
const LOGIN_SUCCESS = "Login successful"

// error messages
const ITEM_ALREADY_EXISTS ="Item already exists!"
const USER_NAME_ALREADY_EXISTS ="User name already exists!"
const PASSWORD_IS_REQUIRED ="Password is required!"
const PLEASE_INSERT_USER_NAME_AND_PASSWORD ="Please insert user name and password!"
const USER_NAME_NOT_FOUND="User name not found!"
const INVALID_PASSWORD ="Invalid password!"

// item types
const MAIN_DISHES = "mainDishes";
const SIDE_DISHES = "sideDishes";
const DESSERTS = "desserts";

// validation
const PASSWORD_VALIDATION = /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/;

module.exports = {
    ACCOUNT_CREATE_SUCCESS,
    ITEM_ALREADY_EXISTS,
    ITEM_CREATE_SUCCESS,
    ORDER_CREATE_SUCCESS,
    MAIN_DISHES,
    SIDE_DISHES,
    DESSERTS,
    USER_NAME_ALREADY_EXISTS,
    PASSWORD_IS_REQUIRED,
    PLEASE_INSERT_USER_NAME_AND_PASSWORD,
    USER_NAME_NOT_FOUND,
    INVALID_PASSWORD,
    LOGIN_SUCCESS,
    PASSWORD_VALIDATION
}
