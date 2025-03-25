const joi = require('joi')

exports. registerUserSchema = joi.object().keys({
    fullName: joi.string().min(3).max(20).required(),
    username: joi.string().min(3).max(20).required(),
    email: joi.string().trim().email().required(),
    password :joi.string().trim().required(),
    gender : joi.string().trim().valid('Male','Female').required()
})

exports. loginUserSchema = joi.object().keys({
    email: joi.string().max(20).required(),
    password: joi.string().trim().required()
})