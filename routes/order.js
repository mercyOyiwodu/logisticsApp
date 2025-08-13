const { 
    createOrder, 
    getUserOrders, 
    getAllOrders, 
    trackOrder, 
    updateOrderStatus, 
    assignDriver, 
    updateLocation 
} = require('../controllers/order');
const { authenticate, authenticateAdmin } = require('../middleware/authentication');

const router = require('express').Router();

// Public route - track order by tracking ID
router.get('/track/:trackingId', trackOrder);

// Protected routes - require authentication
router.post('/create', authenticate, createOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.put('/:orderId/location', authenticate, updateLocation);

// Admin only routes
router.get('/all', authenticateAdmin, getAllOrders);
router.put('/:orderId/status', authenticateAdmin, updateOrderStatus);
router.put('/:orderId/assign-driver', authenticateAdmin, assignDriver);

module.exports = router;