const mongoose = require("mongoose");

const VehicleDataSchema = new mongoose.Schema({
    brand: String,
    model: String,
    generation: String,

    tires: {
        width: Number,
        profile: Number,
        diameter: Number,
        class: String
    },

    wipers: {
        front: Number,
        rear: Number
    }
});

module.exports = mongoose.model(
    "VehicleData",
    VehicleDataSchema
);