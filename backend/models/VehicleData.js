const mongoose = require("mongoose");

const VehicleDataSchema = new mongoose.Schema({
    brand: String,
    model: String,
    generation: String,

    tireSize: String,
    tirePressure: Number,

    frontWipers: String,
    rearWiper: Number
});

module.exports = mongoose.model(
    "VehicleData",
    VehicleDataSchema
);