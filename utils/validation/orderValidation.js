const Joi = require('joi');

const orderSchema = (data) => {
    Schema = Joi.object({
        items : Joi.array().required(),
        totalAmount : Joi.number().required()
    }).unknown();

    return Schema.validate(data);
};

module.exports = { orderSchema };