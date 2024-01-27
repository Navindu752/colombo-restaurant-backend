const Joi = require('joi');
const { PASSWORD_VALIDATION } = require('../constants');

const userSchema = (data) => {
    Schema = Joi.object({
        userName: Joi.string().trim().required(),
        password: Joi.string().pattern(PASSWORD_VALIDATION).required(),
    }).unknown();

    return Schema.validate(data);
};

module.exports = { userSchema };