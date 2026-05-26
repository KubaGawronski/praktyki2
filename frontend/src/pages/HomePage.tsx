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
    const [searchedCategory, setSearchedCategory] = useState("");
    const [vehicleData, setVehicleData] = useState<any>(null);
    const [selectedVehicle, setSelectedVehicle] =
        useState<any>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchSpecificModel, setSearchSpecificModel] = useState(true);

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
        if (
            !selectedBrand ||
            !selectedCategory ||
            (
                searchSpecificModel &&
                (
                    !selectedModel ||
                    !selectedGeneration
                )
            )
        ) {
            setError("Uzupełnij wszystkie pola");
            return;
        }

        setError("");
        setSearchedCategory(selectedCategory);
        setVehicleData(null);
        setLoading(true);

        try {
            let res;

            if (searchSpecificModel) {
                res = await fetch(
                    `${API_URL}/vehicle-data?brand=${selectedBrand}&model=${selectedModel}&generation=${selectedGeneration}`
                );
            } else {
                res = await fetch(
                    `${API_URL}/vehicle-data/brand?brand=${selectedBrand}`
                );
            }

            const data = await res.json();

            setVehicleData(data);

            if (
                !data ||
                (Array.isArray(data) && data.length === 0)
            ) {
                setError("Brak danych dla wybranego pojazdu");
            }
        } catch (err) {
            setError("Błąd pobierania danych");
        }

        setLoading(false);
    };

    const resetForm = () => {
        setSelectedBrand("");
        setSelectedModel("");
        setSelectedGeneration("");
        setSelectedCategory("");

        setModels([]);
        setGenerations([]);

        setVehicleData(null);

        setError("");

        setSearchSpecificModel(true);
    };

    const getVehicleImage = (vehicle: any) => {
        return `https://cdn.imagin.studio/getimage?customer=img&make=${vehicle.brand}&modelFamily=${vehicle.model}&zoomType=fullscreen&width=1200`;
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

    useEffect(() => {
        setVehicleData(null);
        setSelectedVehicle(null);
        setError("");

        if (!searchSpecificModel) {
            setSelectedModel("");
            setSelectedGeneration("");
        }
    }, [searchSpecificModel]);

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

                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "16px"
                    }}
                >
                    <input
                        type="checkbox"
                        checked={searchSpecificModel}
                        onChange={(e) =>
                            setSearchSpecificModel(e.target.checked)
                        }
                    />

                    Wyszukaj konkretny model
                </label>
                {searchSpecificModel && (
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
                )}
                {searchSpecificModel && (
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
                )}
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
                    disabled={
                        !selectedBrand ||
                        (
                            searchSpecificModel &&
                            !selectedGeneration
                        )
                    }
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
                    disabled={loading}
                >
                    {loading ? "Ładowanie..." : "Wyszukaj"}
                </button>

                <button
                    onClick={resetForm}
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "none",
                        backgroundColor: "#ef4444",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                >
                    Resetuj
                </button>


            </div>
            {error && (
                <p
                    style={{
                        marginTop: "20px",
                        color: "#ef4444",
                        fontWeight: "bold",
                        textAlign: "center"
                    }}
                >
                    {error}
                </p>
            )}
            {vehicleData && (
                searchSpecificModel ? (

                    <div
                        style={{
                            marginTop: "40px",
                            maxWidth: "900px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            backgroundColor: "#1e293b",
                            padding: "35px",
                            borderRadius: "24px",
                            border: "1px solid #334155",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
                        }}
                    >
                        <h2
                            style={{
                                marginTop: 0,
                                marginBottom: "35px",
                                textAlign: "center",
                                fontSize: "34px"
                            }}
                        >
                            Wyniki wyszukiwania 🔍
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(260px, 1fr))",
                                gap: "24px"
                            }}
                        >
                            <div style={cardStyle}>
                                <h3 style={titleStyle}>
                                    🚗 Pojazd
                                </h3>

                                <p>
                                    <strong>Marka:</strong>{" "}
                                    {vehicleData.brand}
                                </p>

                                <p>
                                    <strong>Model:</strong>{" "}
                                    {vehicleData.model}
                                </p>

                                <p>
                                    <strong>Generacja:</strong>{" "}
                                    {vehicleData.generation}
                                </p>
                            </div>

                            {searchedCategory === "opony" && (
                                <div style={cardStyle}>
                                    <h3 style={titleStyle}>
                                        🛞 Opony
                                    </h3>

                                    <p>
                                        <strong>Rozmiar:</strong>{" "}
                                        {vehicleData.tireSize}
                                    </p>

                                    <p>
                                        <strong>Ciśnienie:</strong>{" "}
                                        {vehicleData.tirePressure} bar
                                    </p>
                                </div>
                            )}

                            {searchedCategory === "wycieraczki" && (
                                <div style={cardStyle}>
                                    <h3 style={titleStyle}>
                                        🧼 Wycieraczki
                                    </h3>

                                    <p>
                                        <strong>Przód:</strong>{" "}
                                        {vehicleData.frontWipers} mm
                                    </p>

                                    <p>
                                        <strong>Tył:</strong>{" "}
                                        {vehicleData.rearWiper} mm
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                ) : (

                    <div
                        style={{
                            marginTop: "40px",
                            maxWidth: "1200px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "24px"
                        }}
                    >
                        {Array.isArray(vehicleData) &&
                            vehicleData.map((vehicle: any) => (
                                <div
                                    key={vehicle._id}
                                    onClick={() => {
                                        setImageLoaded(false);
                                        setSelectedVehicle(vehicle);
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.03)";
                                        e.currentTarget.style.borderColor = "#3b82f6";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.borderColor = "#334155";
                                    }}
                                    style={{
                                        backgroundColor: "#1e293b",
                                        padding: "24px",
                                        borderRadius: "20px",
                                        border: "1px solid #334155",
                                        cursor: "pointer",
                                        transition: "0.2s",
                                        transform: "scale(1)"
                                    }}
                                >
                                <h3 style={titleStyle}>
                                    🚗 {vehicle.brand} {vehicle.model}
                                </h3>

                                <p>
                                    <strong>Generacja:</strong>{" "}
                                    {vehicle.generation}
                                </p>

                                {searchedCategory === "opony" && (
                                    <>
                                        <p>
                                            <strong>Rozmiar opon:</strong>{" "}
                                            {vehicle.tireSize}
                                        </p>

                                        <p>
                                            <strong>Ciśnienie:</strong>{" "}
                                            {vehicle.tirePressure} bar
                                        </p>
                                    </>
                                )}

                                {searchedCategory === "wycieraczki" && (
                                    <>
                                        <p>
                                            <strong>Przód:</strong>{" "}
                                            {vehicle.frontWipers} mm
                                        </p>

                                        <p>
                                            <strong>Tył:</strong>{" "}
                                            {vehicle.rearWiper} mm
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )
            )}

            {selectedVehicle && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000
                    }}
                    onClick={() => setSelectedVehicle(null)}
                >
                    <div
                        style={{
                            backgroundColor: "#1e293b",
                            borderRadius: "24px",
                            padding: "30px",
                            width: "90%",
                            maxWidth: "700px",
                            color: "white",
                            position: "relative"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedVehicle(null)}
                            style={{
                                position: "absolute",
                                top: "15px",
                                right: "15px",
                                background: "none",
                                border: "none",
                                color: "white",
                                fontSize: "24px",
                                cursor: "pointer"
                            }}
                        >
                            ✕
                        </button>

                        {!imageLoaded && (
                            <div
                                style={{
                                    width: "100%",
                                    height: "350px",
                                    borderRadius: "18px",
                                    backgroundColor: "#334155",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: "24px"
                                }}
                            >
                                Ładowanie zdjęcia...
                            </div>
                        )}

                        <img
                            src={getVehicleImage(selectedVehicle)}
                            alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://via.placeholder.com/1200x700?text=Brak+zdjecia";
                            }}
                            style={{
                                width: "100%",
                                borderRadius: "18px",
                                marginBottom: "24px",
                                maxHeight: "350px",
                                objectFit: "cover",
                                display: imageLoaded ? "block" : "none"
                            }}
                        />

                        <h2
                            style={{
                                marginBottom: "20px",
                                fontSize: "32px"
                            }}
                        >
                            🚗 {selectedVehicle.brand}{" "}
                            {selectedVehicle.model}
                        </h2>

                        <p>
                            <strong>Generacja:</strong>{" "}
                            {selectedVehicle.generation}
                        </p>

                        {searchedCategory === "opony" && (
                            <>
                                <p>
                                    <strong>Rozmiar opon:</strong>{" "}
                                    {selectedVehicle.tireSize}
                                </p>

                                <p>
                                    <strong>Ciśnienie:</strong>{" "}
                                    {selectedVehicle.tirePressure} bar
                                </p>
                            </>
                        )}

                        {searchedCategory === "wycieraczki" && (
                            <>
                                <p>
                                    <strong>Przód:</strong>{" "}
                                    {selectedVehicle.frontWipers} mm
                                </p>

                                <p>
                                    <strong>Tył:</strong>{" "}
                                    {selectedVehicle.rearWiper} mm
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

const cardStyle: React.CSSProperties = {
    backgroundColor: "#0f172a",
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid #334155",
    fontSize: "17px",
    lineHeight: "1.8"
};

const titleStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "24px"
};

export default HomePage;