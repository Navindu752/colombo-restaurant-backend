const Joi = require('joi');

const itemSchema = (data) => {
    Schema = Joi.object({
        name: Joi.string().required(),
        type : Joi.string().required(),
        price : Joi.number().required()
    }).unknown();

    return Schema.validate(data);
};

module.exports = { itemSchema };