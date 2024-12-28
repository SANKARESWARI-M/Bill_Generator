import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.user);
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        if (!user) {
            axios.get('http://localhost:3001/user', { withCredentials: true })
                .then(response => {
                    if (response.data.user) {
                        setUser(response.data.user);
                    } else {
                        navigate("/login");
                    }
                })
                .catch(() => navigate("/login"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user, navigate]);

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }

    // Button handlers for navigating to admin and employee sections
    const handleAdminClick = () => {
        navigate("/admin-dashboard"); // Replace with the actual admin route
    };

    const handleEmployeeClick = () => {
        navigate("/EmployeePage"); // Replace with the actual employee route
    };

    return (
        <center>
            <h1 style={{ color: "black", fontSize: "5rem" }}>Welcome Home {user && user.name}!!!</h1>

            {/* Admin and Employee buttons */}
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
                <button onClick={handleAdminClick} style={buttonStyle}>
                    Admin
                </button>
                <button onClick={handleEmployeeClick} style={buttonStyle}>
                    Employee
                </button>
            </div>
        </center>
    );
}

// Inline button styling
const buttonStyle = {
    padding: "10px 20px",
    fontSize: "1.2rem",
    margin: "10px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    width: "200px",  // Ensures buttons are wide enough
    height: "50px",  // Ensures buttons are tall enough
};

export default Home;
