const mongoose = require("mongoose");
const TrackingSchema = new mongoose.Schema({
    order: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order" 
    },
    driver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    location: {
      latitude: { 
        type: Number, 
        required: true 
      },
      longitude: { 
        type: Number, 
        required: true 
      }
    },
  },{timestamps: true});
  
  const trackingModel = mongoose.model("Tracking", TrackingSchema);

  module.exports = trackingModel;
  