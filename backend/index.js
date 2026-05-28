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
        const vehicle =
            await VehicleData.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                error: "Pojazd nie istnieje"
            });
        }

        const {
            brand,
            model
        } = vehicle;

        await VehicleData.findByIdAndDelete(
            req.params.id
        );

        const existingModel =
            await VehicleData.findOne({
                brand,
                model
            });

        if (!existingModel) {
            await Model.findOneAndDelete({
                brand,
                name: model
            });
        }

        const existingBrand =
            await VehicleData.findOne({
                brand
            });

        if (!existingBrand) {
            await Brand.findOneAndDelete({
                name: brand
            });
        }

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

        doc.rect(0, 0, doc.page.width, 90)
            .fill("#1e293b");

        doc
            .fillColor("white")
            .font("Regular")
            .fontSize(26)
            .text("Raport pojazdów", 0, 30, {
                align: "center"
            });

        doc.moveDown(4);

        const tableTop = 140;
        const rowHeight = 35;

        const columns =
            category === "opony"
                ? [
                    "Marka",
                    "Model",
                    "Generacja",
                    "Rozmiar opon",
                    "Ciśnienie"
                ]
                : [
                    "Marka",
                    "Model",
                    "Generacja",
                    "Przód",
                    "Tył"
                ];

        const columnWidths =
            category === "opony"
                ? [90, 90, 110, 120, 85]
                : [90, 90, 110, 120, 85];

        let currentX = 40;

        columns.forEach((column, index) => {
            doc
                .rect(
                    currentX,
                    tableTop,
                    columnWidths[index],
                    rowHeight
                )
                .fillAndStroke(
                    "#2563eb",
                    "#1e40af"
                );

            doc
                .fillColor("white")
                .fontSize(12)
                .text(
                    column,
                    currentX + 8,
                    tableTop + 10,
                    {
                        width: columnWidths[index] - 16,
                        align: "center"
                    }
                );

            currentX += columnWidths[index];
        });

        let currentY = tableTop + rowHeight;

        vehicles.forEach((vehicle, index) => {
            const rowColor =
                index % 2 === 0
                    ? "#f8fafc"
                    : "#e2e8f0";

            let rowX = 40;

            const rowData =
                category === "opony"
                    ? [
                        vehicle.brand,
                        vehicle.model,
                        vehicle.generation,
                        vehicle.tireSize || "-",
                        `${vehicle.tirePressure || "-"} bar`
                    ]
                    : [
                        vehicle.brand,
                        vehicle.model,
                        vehicle.generation,
                        `${vehicle.frontWipers || "-"} mm`,
                        `${vehicle.rearWiper || "-"} mm`
                    ];

            rowData.forEach((data, i) => {
                doc
                    .rect(
                        rowX,
                        currentY,
                        columnWidths[i],
                        rowHeight
                    )
                    .fillAndStroke(
                        rowColor,
                        "#cbd5e1"
                    );

                doc
                    .fillColor("#0f172a")
                    .fontSize(11)
                    .text(
                        data,
                        rowX + 6,
                        currentY + 10,
                        {
                            width: columnWidths[i] - 12,
                            align: "center"
                        }
                    );

                rowX += columnWidths[i];
            });

            currentY += rowHeight;
        });

        doc.moveDown(2);

        doc
            .fillColor("#64748b")
            .fontSize(10)
            .text(
                "Wygenerowano przez Vehicle Finder",
                0,
                currentY + 30,
                {
                    align: "center"
                }
            );

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