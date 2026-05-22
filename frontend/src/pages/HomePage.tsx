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
            </div>
        </div>
    );
}

export default HomePage;