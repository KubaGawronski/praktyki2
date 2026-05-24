import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

function AdminPage() {
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [generation, setGeneration] = useState("");
    const [tireSize, setTireSize] = useState("");
    const [tirePressure, setTirePressure] = useState("");
    const [frontWipers, setFrontWipers] = useState("");
    const [rearWiper, setRearWiper] = useState("");
    const [vehicles, setVehicles] = useState<any[]>([]);

    const addVehicle = async () => {
        try {
            await axios.post(
                `${API_URL}/vehicle-data`,
                {
                    brand,
                    model,
                    generation,
                    tireSize,
                    tirePressure,
                    frontWipers,
                    rearWiper
                }
            );

            alert("Pojazd dodany 🚗");
            fetchVehicles();
            setBrand("");
            setModel("");
            setGeneration("");
            setTireSize("");
            setTirePressure("");
            setFrontWipers("");
            setRearWiper("");

        } catch (err) {
            alert("Błąd dodawania pojazdu");
        }
    };

    const fetchVehicles = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/vehicle-data/all`
            );

            setVehicles(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0f172a",
                color: "white",
                padding: "40px"
            }}
        >
            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    backgroundColor: "#1e293b",
                    padding: "40px",
                    borderRadius: "20px"
                }}
            >
                <h1
                    style={{
                        marginTop: 0,
                        marginBottom: "30px",
                        textAlign: "center"
                    }}
                >
                    Panel administratora ⚙️
                </h1>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px"
                    }}
                >
                    <input
                        placeholder="Marka"
                        value={brand}
                        onChange={(e) =>
                            setBrand(e.target.value)
                        }
                        style={inputStyle}
                    />

                    <input
                        placeholder="Model"
                        value={model}
                        onChange={(e) =>
                            setModel(e.target.value)
                        }
                        style={inputStyle}
                    />

                    <input
                        placeholder="Generacja"
                        value={generation}
                        onChange={(e) =>
                            setGeneration(e.target.value)
                        }
                        style={inputStyle}
                    />

                    <input
                        placeholder="Rozmiar opon"
                        value={tireSize}
                        onChange={(e) =>
                            setTireSize(e.target.value)
                        }
                        style={inputStyle}
                    />

                    <input
                        placeholder="Ciśnienie opon (bar)"
                        type="number"
                        value={tirePressure}
                        onChange={(e) =>
                            setTirePressure(e.target.value)
                        }
                        style={inputStyle}
                    />

                    <input
                        placeholder="Wycieraczki przód (mm)"
                        value={frontWipers}
                        onChange={(e) =>
                            setFrontWipers(e.target.value)
                        }
                        style={inputStyle}
                    />

                    <input
                        placeholder="Wycieraczka tył (mm)"
                        type="number"
                        value={rearWiper}
                        onChange={(e) =>
                            setRearWiper(e.target.value)
                        }
                        style={inputStyle}
                    />

                    <button
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
                        onClick={addVehicle}
                    >
                        Dodaj pojazd
                    </button>
                </div>
            </div>

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
                        marginBottom: "30px",
                        textAlign: "center",
                        fontSize: "34px"
                    }}
                >
                    Wyniki wyszukiwania 🔍
                </h2>

                <div
                    style={{
                        marginTop: "40px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px"
                    }}
                >
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle._id}
                            style={{
                                backgroundColor: "#0f172a",
                                padding: "28px",
                                borderRadius: "18px",
                                border: "1px solid #334155"
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "18px",
                                    margin: "10px 0"
                                }}
                            >
                                <strong>Marka:</strong>
                                {" "}
                                {vehicle.brand}
                            </p>

                            <p
                                style={{
                                    fontSize: "18px",
                                    margin: "10px 0"
                                }}
                            >
                                <strong>Model:</strong>
                                {" "}
                                {vehicle.model}
                            </p>

                            <p
                                style={{
                                    fontSize: "18px",
                                    margin: "10px 0"
                                }}
                            >
                                <strong>Generacja:</strong>
                                {" "}
                                {vehicle.generation}
                            </p>

                            <p
                                style={{
                                    fontSize: "18px",
                                    margin: "10px 0"
                                }}
                            >
                                <strong>Rozmiar opon:</strong>
                                {" "}
                                {vehicle.tireSize}
                            </p>

                            <p
                                style={{
                                    fontSize: "18px",
                                    margin: "10px 0"
                                }}
                            >
                                <strong>Ciśnienie:</strong>
                                {" "}
                                {vehicle.tirePressure} bar
                            </p>

                            <p
                                style={{
                                    fontSize: "18px",
                                    margin: "10px 0"
                                }}
                            >
                                <strong>Wycieraczki przód:</strong>
                                {" "}
                                {vehicle.frontWipers} mm
                            </p>

                            <p
                                style={{
                                    fontSize: "18px",
                                    margin: "10px 0"
                                }}
                            >
                                <strong>Wycieraczka tył:</strong>
                                {" "}
                                {vehicle.rearWiper} mm
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
    boxSizing: "border-box",
    backgroundColor: "#0f172a",
    color: "white"
};

export default AdminPage;