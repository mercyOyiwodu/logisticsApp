const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    pickupLocation: { 
        type: String, 
        required: true 
    },
    deliveryLocation: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "in_transit", "delivered", "canceled"], 
        default: "pending" 
    },
    trackingId: { type: String, 
        unique: true 
    },
},{timestamps: true});

const orderModel = mongoose.model("Order", OrderSchema);
module.exports = orderModel;
