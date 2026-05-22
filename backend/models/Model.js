const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema({
    brand: String,
    name: String
});

module.exports = mongoose.model(
    "Model",
    ModelSchema
);