const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    isLoggedin: {
        type: Boolean,
        default: false
    },
    role: { 
        type: String, 
        enum: ["admin", "customer", "driver"],
        default: "customer" },
},{timestamps: true});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;