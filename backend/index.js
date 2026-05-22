const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Brand = require("./models/Brand");
const Model = require("./models/Model");
const VehicleData = require("./models/VehicleData");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("API działa");
});

app.get("/brands", async (req, res) => {
    const brands = await Brand.find();

    res.json(brands);
});

app.get("/models", async (req, res) => {
    const { brand } = req.query;

    const models = await Model.find({
        brand
    });

    res.json(models);
});

app.get("/vehicle-data", async (req, res) => {
    const { brand, model, generation } = req.query;

    const data = await VehicleData.findOne({
        brand,
        model,
        generation
    });

    res.json(data);
});

app.get("/generations", async (req, res) => {
    const { brand, model } = req.query;

    const generations = await VehicleData.distinct(
        "generation",
        {
            brand,
            model
        }
    );

    res.json(generations);
});

app.listen(3001, () => {
    console.log("Server 3001");
});