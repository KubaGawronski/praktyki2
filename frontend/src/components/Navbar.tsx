import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav
            style={{
                width: "100%",
                backgroundColor: "#1e293b",
                padding: "20px 40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxSizing: "border-box",
                borderBottom: "1px solid #334155"
            }}
        >
            <h2
                style={{
                    margin: 0,
                    color: "white"
                }}
            >
                CarBase 🚗
            </h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px"
                }}
            >
                <Link
                    to="/"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontWeight: "bold"
                    }}
                >
                    Strona główna
                </Link>

                <Link
                    to="/admin"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontWeight: "bold"
                    }}
                >
                    Admin
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;