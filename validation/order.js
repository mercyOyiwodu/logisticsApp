const joi = require('joi');

exports.createOrderSchema = joi.object().keys({
    pickupLocation: joi.string().min(5).max(200).required(),
    deliveryLocation: joi.string().min(5).max(200).required()
});

exports.updateOrderSchema = joi.object().keys({
    status: joi.string().valid('pending', 'in_transit', 'delivered', 'canceled').required()
});

exports.assignDriverSchema = joi.object().keys({
    driverId: joi.string().required()
});

exports.updateLocationSchema = joi.object().keys({
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required()
});