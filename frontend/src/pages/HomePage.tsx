import { useEffect, useState } from "react";
import axios from "axios";

import { API_URL } from "../config/api";

function HomePage() {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [generations, setGenerations] = useState([]);
    const [selectedGeneration, setSelectedGeneration] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [vehicleData, setVehicleData] = useState<any>(null);

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${API_URL}/brands`);

            setBrands(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchModels = async (brand: string) => {
        try {
            const res = await axios.get(
                `${API_URL}/models?brand=${brand}`
            );

            setModels(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchGenerations = async (
        brand: string,
        model: string
    ) => {
        try {
            const res = await axios.get(
                `${API_URL}/generations?brand=${brand}&model=${model}`
            );

            setGenerations(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchVehicleData = async () => {
        const res = await fetch(
            `http://localhost:3001/vehicle-data?brand=${selectedBrand}&model=${selectedModel}&generation=${selectedGeneration}`
        );

        const data = await res.json();

        setVehicleData(data);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        if (selectedBrand) {
            fetchModels(selectedBrand);
        }

        setSelectedModel("");
    }, [selectedBrand]);

    useEffect(() => {
        if (selectedBrand && selectedModel) {
            fetchGenerations(
                selectedBrand,
                selectedModel
            );
        }

        setSelectedGeneration("");
    }, [selectedModel]);

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0f172a",
                color: "white",
                padding: "40px"
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    marginBottom: "40px"
                }}
            >
                Wyszukiwarka samochodów 🚗
            </h1>

            <div
                style={{
                    maxWidth: "500px",
                    margin: "0 auto",
                    backgroundColor: "#1e293b",
                    padding: "30px",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}
            >
                <select
                    value={selectedBrand}
                    onChange={(e) =>
                        setSelectedBrand(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "none",
                        fontSize: "16px"
                    }}
                >
                    <option value="">
                        Wybierz markę
                    </option>

                    {brands.map((brand: any) => (
                        <option
                            key={brand._id}
                            value={brand.name}
                        >
                            {brand.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedModel}
                    onChange={(e) =>
                        setSelectedModel(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "none",
                        fontSize: "16px"
                    }}
                    disabled={!selectedBrand}
                >
                    <option value="">
                        Wybierz model
                    </option>

                    {models.map((model: any) => (
                        <option
                            key={model._id}
                            value={model.name}
                        >
                            {model.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedGeneration}
                    onChange={(e) =>
                        setSelectedGeneration(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "none",
                        fontSize: "16px"
                    }}
                    disabled={!selectedModel}
                >
                    <option value="">
                        Wybierz generację
                    </option>

                    {generations.map((generation, index) => (
                        <option
                            key={index}
                            value={generation}
                        >
                            {generation}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedCategory}
                    onChange={(e) =>
                        setSelectedCategory(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "none",
                        fontSize: "16px"
                    }}
                    disabled={!selectedGeneration}
                >
                    <option value="">
                        Wybierz kategorię
                    </option>

                    <option value="opony">
                        Opony
                    </option>

                    <option value="wycieraczki">
                        Wycieraczki
                    </option>
                </select>

                <button
                    onClick={fetchVehicleData}
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "none",
                        backgroundColor: "#2563eb",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                    disabled={!selectedCategory}
                >
                    Wyszukaj
                </button>

                {selectedBrand && (
                    <p>
                        Marka:
                        {" "}
                        <strong>
                            {selectedBrand}
                        </strong>
                    </p>
                )}

                {selectedModel && (
                    <p>
                        Model:
                        {" "}
                        <strong>
                            {selectedModel}
                        </strong>
                    </p>
                )}

                {selectedGeneration && (
                    <p>
                        Generacja:
                        {" "}
                        <strong>
                            {selectedGeneration}
                        </strong>
                    </p>
                )}

                {selectedCategory && (
                    <p>
                        Kategoria:
                        {" "}
                        <strong>
                            {selectedCategory}
                        </strong>
                    </p>
                )}
            </div>
            {vehicleData && (
                <div
                    style={{
                        marginTop: "30px",
                        backgroundColor: "#1e293b",
                        padding: "30px",
                        borderRadius: "20px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
                    }}
                >
                    <h2
                        style={{
                            marginTop: 0,
                            marginBottom: "25px",
                            textAlign: "center"
                        }}
                    >
                        Wyniki wyszukiwania 🔍
                    </h2>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px"
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "#0f172a",
                                padding: "20px",
                                borderRadius: "16px"
                            }}
                        >
                            <h3>
                                🚗 Pojazd
                            </h3>

                            <p>
                                <strong>Marka:</strong>
                                {" "}
                                {selectedBrand}
                            </p>

                            <p>
                                <strong>Model:</strong>
                                {" "}
                                {selectedModel}
                            </p>

                            <p>
                                <strong>Generacja:</strong>
                                {" "}
                                {selectedGeneration}
                            </p>
                        </div>

                        {selectedCategory === "opony" && (
                            <div
                                style={{
                                    backgroundColor: "#0f172a",
                                    padding: "20px",
                                    borderRadius: "16px"
                                }}
                            >
                                <h3>
                                    🛞 Opony
                                </h3>

                                <p>
                                    <strong>Rozmiar:</strong>
                                    {" "}
                                    {vehicleData.tireSize}
                                </p>

                                <p>
                                    <strong>Ciśnienie:</strong>
                                    {" "}
                                    {vehicleData.tirePressure}
                                </p>
                            </div>
                        )}

                        {selectedCategory === "wycieraczki" && (
                            <div
                                style={{
                                    backgroundColor: "#0f172a",
                                    padding: "20px",
                                    borderRadius: "16px"
                                }}
                            >
                                <h3>
                                    🧼 Wycieraczki
                                </h3>

                                <p>
                                    <strong>Przód:</strong>
                                    {" "}
                                    {vehicleData.frontWipers}
                                </p>

                                <p>
                                    <strong>Tył:</strong>
                                    {" "}
                                    {vehicleData.rearWiper}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;