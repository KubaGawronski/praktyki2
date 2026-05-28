const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const path = require("path");
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

app.post("/vehicle-data", async (req, res) => {
    try {
        const {
            brand,
            model,
            generation,
            tireSize,
            tirePressure,
            frontWipers,
            rearWiper
        } = req.body;

        const newVehicle = new VehicleData({
            brand,
            model,
            generation,
            tireSize,
            tirePressure,
            frontWipers,
            rearWiper
        });

        await newVehicle.save();

        const brandExists = await Brand.findOne({
            name: brand
        });

        if (!brandExists) {
            await Brand.create({
                name: brand
            });
        }

        const modelExists = await Model.findOne({
            brand,
            name: model
        });

        if (!modelExists) {
            await Model.create({
                brand,
                name: model
            });
        }

        res.status(201).json({
            message: "Pojazd dodany"
        });

    } catch (err) {
        res.status(500).json({
            error: "Błąd dodawania pojazdu"
        });
    }
});

app.get("/vehicle-data/all", async (req, res) => {
    try {
        const vehicles = await VehicleData.find();

        res.json(vehicles);

    } catch (err) {
        res.status(500).json({
            error: "Błąd pobierania pojazdów"
        });
    }
});

app.delete("/vehicle-data/:id", async (req, res) => {
    try {
        await VehicleData.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Pojazd usunięty"
        });

    } catch (err) {
        res.status(500).json({
            error: "Błąd usuwania pojazdu"
        });
    }
});

app.put("/vehicle-data/:id", async (req, res) => {
    try {
        const updatedVehicle =
            await VehicleData.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

        res.json(updatedVehicle);

    } catch (err) {
        res.status(500).json({
            error: "Błąd edycji pojazdu"
        });
    }
});

app.get("/vehicle-data/brand", async (req, res) => {
    try {
        const { brand } = req.query;

        const vehicles = await VehicleData.find({
            brand
        });

        res.json(vehicles);

    } catch (err) {
        res.status(500).json({
            error: "Błąd pobierania danych"
        });
    }
});

app.get("/pdf", async (req, res) => {
    try {
        const {
            brand,
            model,
            generation,
            category
        } = req.query;

        let vehicles = [];

        if (model && generation) {
            const vehicle = await VehicleData.findOne({
                brand,
                model,
                generation
            });

            if (vehicle) {
                vehicles.push(vehicle);
            }
        } else {
            vehicles = await VehicleData.find({
                brand
            });
        }

        const doc = new PDFDocument({
            margin: 40,
            size: "A4"
        });

        const regularFont = path.join(
            __dirname,
            "fonts",
            "DejaVuSans.ttf"
        );

        doc.registerFont(
            "Regular",
            regularFont
        );

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=raport.pdf"
        );

        doc.pipe(res);

        doc
            .font("Regular")
            .fontSize(24)
            .text("Raport pojazdów", {
                align: "center"
            });

        doc.moveDown(2);

        vehicles.forEach((vehicle) => {
            doc
                .fontSize(18)
                .text(
                    `${vehicle.brand} ${vehicle.model}`
                );

            doc.moveDown(0.5);

            doc
                .fontSize(12)
                .text(
                    `Generacja: ${vehicle.generation}`
                );

            if (category === "opony") {
                doc.text(
                    `Rozmiar opon: ${vehicle.tireSize || "-"}`
                );

                doc.text(
                    `Ciśnienie: ${vehicle.tirePressure || "-"} bar`
                );
            }

            if (category === "wycieraczki") {
                doc.text(
                    `Przód: ${vehicle.frontWipers || "-"} mm`
                );

                doc.text(
                    `Tył: ${vehicle.rearWiper || "-"} mm`
                );
            }

            doc.moveDown(2);
        });

        doc.end();

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: "Błąd generowania PDF"
        });
    }
});

app.listen(3001, () => {
    console.log("Server 3001");
});