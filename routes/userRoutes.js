const router = require('express').Router();
const {  loginUser, logoutUser, insertNewUser} = require('../api/user.api');
const { validateInput } = require('../utils/common-functions');
const { userSchema } = require('../utils/validation/userValidation');
require('dotenv').config(); // to load .env file content

/**
 * @swagger
 * components:
 *   schemas:
 *      User:
 *       type: object
 *       required:
 *         - userName
 *         - password
 *       properties:
 *         userName:
 *           type: string
 *           description: Name of the user
 *         password:
 *           type: string
 *           description: Password of the user
 *       example:
 *          userName: sampleName
 *          password: samplePassword
 */


/**
 * @swagger
 * tags:
 *  name: User
 *  description: User management API, Application of authorization token is required when using PUT and DELETE methods. Use the login method of the user API and copy the returned access token. Click on authorize button and paste the copied token in the pop-up window to authorize
 */


/**
 * @swagger
 * /user:
 *  post:
 *      summary: Create a new user
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                     example:
 *                      userName: sampleName
 *                      password: samplePassword
 *      responses:
 *          200:
 *              description: User created successfully"
 *          400:
 *              description: Bad Request
 *                  
 */

router.post('/', async (req, res) => {
    const validUser = validateInput(userSchema, req.body);
    if (!validUser.value) {
        return res.status(400).json(validUser)
    }
    insertNewUser(req.body).then(async (result) => {
        if (result?.status) {
            res.status(result?.status).json(result)
        } else {
            res.json(result);
        }
    }).catch(async (err) => {
        if (err?.status) {
            res.status(err?.status).json(err);
        } else {
            res.status(400).json(err);
        }
    });

});


/**
 * @swagger
 * /user/login:
 *  post:
 *      summary: Login
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                     example:
 *                      userName: sampleName
 *                      password: samplePassword
 *      responses:
 *          200:
 *              description: The user is logged in successfully
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref:   '#/components/schemas/User'
 *          400:
 *              description: Bad Request
 *          403:
 *              description: Forbidden
 *          404:
 *              description: Not Found
 *                  
 */


router.post('/login', (req, res) => {
    loginUser(req.body).then((result) => {
        if (result?.status) {
            res.status(result?.status).json(result)
        } else {
            res.json(result);
        }
    }).catch((err) => {
        if (err?.status) {
            res.status(err?.status).json(err);
        } else {
            res.status(400).json(err);
        }
    });
});


/**
 * @swagger
 * /user/logout:
 *  put:
 *      summary: Logout
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                     example:
 *                      id: 61c41a72c6185738906263d7
 *      responses:
 *          200:
 *              description: The user is logged out successfully
 *                  
 */

router.put('/logout', async (req, res) => {
    try {
        const result = await logoutUser(req.body.id)
        res.json(result);
    }
    catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;
