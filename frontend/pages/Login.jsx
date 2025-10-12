import React, { useState } from "react";
import Logo from "../components/Logo";
import "../styles/login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8081/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem("token", data.token);
                localStorage.setItem("username", username);
                localStorage.setItem("isMod", data.isMod);
                console.log("Login succesvol! Token:", data.token);
                window.location.href = "/homepage";
            } else {

                setError(data.message || "Invalid username or password");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Er is iets misgegaan, probeer het opnieuw.");
        }
    };

    return (
        <div className="center-container">
            <Logo />

            <div className="login-box">
                <h1>Log in</h1>

                <label htmlFor="username">Gebruikersnaam:</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Virelight"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="password">Wachtwoord:</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <a href="#" className="forgot-password">Wachtwoord vergeten?</a>

                {error && <p className="error">{error}</p>}

                <button className="button" onClick={handleLogin}>Log in</button>

                <div className="register-text">
                    <p>Nog geen account?</p>
                    <a href="/register">Registreren</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
