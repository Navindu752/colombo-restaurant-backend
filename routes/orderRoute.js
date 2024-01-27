const router = require('express').Router();
const { validateInput } = require('../utils/common-functions');
const { verifyToken } = require('../utils/middleware/auth');
const { itemSchema } = require('../utils/validation/itemvalidation');
const { insertNewOrder, getAllOrder, getAllOrderPageCount, getAllReports } = require('../api/order.api');
const { orderSchema } = require('../utils/validation/orderValidation');

/**
 * @swagger
 * components:
 *   schemas:
 *      Order:
 *       type: object
 *       required:
 *         - invoiceNumber
 *         - items
 *         - totalAmount
 *       properties:
 *         invoiceNumber:
 *           type: string
 *           description: Invoice number of the order
 *         items:
 *           type: array
 *           description: bulks of the order
 *         totalAmount:
 *           type: number
 *           description: total amount of the order
 *       example:
 *          invoiceNumber: sampleInvoiceNumber
 *          items: sampleBulks
 *          totalAmount: sampleTotalAmount
 */


/**
 * @swagger
 * tags:
 *  name: Order
 *  description: Order management API, Application of authorization token is required when using PUT and DELETE methods. Use the login method of the user API and copy the returned access token. Click on authorize button and paste the copied token in the pop-up window to authorize
 */

/**
 * @swagger
 * /order:
 *  post:
 *      summary: Create a new Order
 *      tags: [Order]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Order'
 *      responses:
 *          200:
 *              description: Order created successfully
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref:   '#/components/schemas/Order'
 *          400:
 *              description: Bad Request
 *                  
 */

router.post('/', verifyToken, (req, res) => {
    //joi validation
    const validInvitation = validateInput(orderSchema, req.body);
    if (!validInvitation.value) {
        return res.status(400).json(validInvitation)
    }
    //call api
    insertNewOrder(req.body).then(async (result) => {
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
 * /order:
 *  get:
 *      summary: Get all Orders
 *      tags: [Order]
 *      responses:
 *          200:
 *              description: The list of Order
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              $ref:   '#/components/schemas/Order'
 *                  
 */

router.get('/', verifyToken, async (req, res) => {
    //call api
    getAllOrder(req.query.page_number).then(async (result) => {
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

/**
 * @swagger
 * /order/pageCount:
 *  get:
 *      summary: Get orders page count
 *      tags: [Order]
 *      responses:
 *          200:
 *              description: Total number of pages
 *          400:
 *              description: A Bad Request 
 */

router.get('/pageCount', verifyToken, async (req, res) => {
    try {
        const result = await getAllOrderPageCount()
        if (result?.status) {
            res.status(result?.status).json(result?.message);
        } else {
            res.json(result);
        }

    }
    catch (error) {
        res.status(400).json(error);
    }
})

/**
 * @swagger
 * /order/reports/:date:
 *  get:
 *      summary: Get report by date
 *      tags: [Order]
 *      responses:
 *          200:
 *              description: Total reports
 *          400:
 *              description: A Bad Request 
 */

router.get('/reports/:date', verifyToken, async (req, res) => {
    try {
        const result = await getAllReports(req.params.date)
        if (result?.status) {
            res.status(result?.status).json({ message: result?.message, data: result?.data })
        } else {
            res.json(result);
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
})


module.exports = router;
