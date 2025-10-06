import React from "react";
import "../styles/login.css";
import Logo from "../components/Logo";

function Register() {
    return (
        <div className="center-container">
            <Logo />

            <div className="login-box">
                <h1>Registreren</h1>

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" placeholder="Voer je email in" />

                <label htmlFor="username">Gebruikersnaam:</label>
                <input type="text" id="username" placeholder="Kies een gebruikersnaam" />

                <label htmlFor="password">Wachtwoord:</label>
                <input type="password" id="password" placeholder="Voer je wachtwoord in" />

                <button className="button">Registreren</button>

                <div className="register-text">
                    <p>Heb je al een account?</p>
                    <a href="/login">Login</a>
                </div>
            </div>
        </div>
    );
}

export default Register;
