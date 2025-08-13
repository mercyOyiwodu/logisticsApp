const orderModel = require("../models/order");
const trackingModel = require("../models/tracking");
const userModel = require("../models/user");
const { validate } = require('../helper/utilities');
const { createOrderSchema, updateOrderSchema } = require('../validation/order');
const crypto = require('crypto');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const validated = await validate(req.body, createOrderSchema);
        const { pickupLocation, deliveryLocation } = validated;
        
        // Generate unique tracking ID
        const trackingId = 'TRK' + crypto.randomBytes(6).toString('hex').toUpperCase();
        
        const newOrder = new orderModel({
            user: req.user._id,
            pickupLocation,
            deliveryLocation,
            trackingId
        });
        
        await newOrder.save();
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId: newOrder._id,
                trackingId: newOrder.trackingId,
                status: newOrder.status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user._id })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            message: 'All orders retrieved successfully',
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get order by tracking ID
exports.trackOrder = async (req, res) => {
    try {
        const { trackingId } = req.params;
        
        const order = await orderModel.findOne({ trackingId })
            .populate('user', 'name email');
            
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found with this tracking ID'
            });
        }
        
        // Get tracking history
        const trackingHistory = await trackingModel.find({ order: order._id })
            .populate('driver', 'name email')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            message: 'Order tracking information retrieved',
            data: {
                order,
                trackingHistory
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update order status (admin/driver only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const validated = await validate(req.body, updateOrderSchema);
        const { status } = validated;
        
        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        order.status = status;
        await order.save();
        
        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// Assign driver to order (admin only)
exports.assignDriver = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { driverId } = req.body;
        
        const order = await orderModel.findById(orderId);
        const driver = await userModel.findById(driverId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({
                success: false,
                message: 'Driver not found or invalid role'
            });
        }
        
        // Create initial tracking entry
        const tracking = new trackingModel({
            order: order._id,
            driver: driver._id,
            location: {
                latitude: 0, // Will be updated by driver
                longitude: 0
            }
        });
        
        await tracking.save();
        
        // Update order status to in_transit
        order.status = 'in_transit';
        await order.save();
        
        res.status(200).json({
            success: true,
            message: 'Driver assigned successfully',
            data: {
                order,
                driver: {
                    id: driver._id,
                    name: driver.name,
                    email: driver.email
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update location (driver only)
exports.updateLocation = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { latitude, longitude } = req.body;
        
        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }
        
        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Create new tracking entry
        const tracking = new trackingModel({
            order: order._id,
            driver: req.user._id,
            location: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            }
        });
        
        await tracking.save();
        
        res.status(200).json({
            success: true,
            message: 'Location updated successfully',
            data: tracking
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};