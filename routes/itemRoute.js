const router = require('express').Router();
const { validateInput } = require('../utils/common-functions');
const { verifyToken } = require('../utils/middleware/auth');
const { itemSchema } = require('../utils/validation/itemvalidation');
const { insertNewItem, getAllItems } = require('../api/item.api');

/**
 * @swagger
 * components:
 *   schemas:
 *      Item:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: name of the item
 *         type:
 *           type: string
 *           description: item type
 *         price:
 *           type: string
 *           description: item price
 *       example:
 *          name: sampleName
 *          type: sampleType
 *          price: 100
 */


/**
 * @swagger
 * tags:
 *  name: Item
 *  description: Item management API, Application of authorization token is required when using PUT and DELETE methods. Use the login method of the user API and copy the returned access token. Click on authorize button and paste the copied token in the pop-up window to authorize
 */

/**
 * @swagger
 * /items:
 *  post:
 *      summary: Create a new item
 *      tags: [Item]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Item'
 *      responses:
 *          200:
 *              description: Item created successfully
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref:   '#/components/schemas/Item'
 *          400:
 *              description: Bad Request
 *                  
 */

router.post('/', verifyToken, (req, res) => {
    //joi validation
    const validInvitation = validateInput(itemSchema, req.body);
    if (!validInvitation.value) {
        return res.status(400).json(validInvitation)
    }
    // insert new item function call
    insertNewItem(req.body).then(async (result) => {
        if (result?.status) {
            res.status(result?.status).json({ message: result?.message })
        } else {
            res.json(result);
        }
    }).catch(async (err) => {
        if (err?.status) {
            res.status(err?.status).json({ message: result?.message })
        } else {
            res.status(400).json(err);
        }
    });
});

/**
 * @swagger
 * /items:
 *  get:
 *      summary: Get all items
 *      tags: [Item]
 *      responses:
 *          200:
 *              description: The list of items
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              $ref:   '#/components/schemas/Item'
 *                  
 */

router.get('/', verifyToken, async (req, res) => {
    // get all items function call
    getAllItems().then(async (result) => {
        if (result?.status) {
            res.status(result?.status).json({ message: result?.message, data: result?.data })
        } else {
            res.json(result);
        }
    }).catch(async (err) => {
        if (err?.status) {
            res.status(err?.status).json({ message: result?.message })
        } else {
            res.status(400).json(err);
        }
    });
})


module.exports = router;
