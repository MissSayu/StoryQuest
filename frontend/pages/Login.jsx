import React from "react";
import button from "../components/Button";
import "../styles/login.css";
import Logo from "../components/Logo";

function Login() {
    return (
        <div className="center-container">
            <Logo />

            <div className="login-box">
                <h1>Log in</h1>

                <label htmlFor="email">Gebruikersnaam:</label>
                <input type="email" id="username" placeholder="Virelight" />

                <label htmlFor="password">Wachtwoord:</label>
                <input type="password" id="password" placeholder="Wachtwoord" />

                <a href="#" className="forgot-password">Wachtwoord vergeten?</a>

                <button className="button">Log in</button>

                <div className="register-text">
                    <p>Nog geen account?</p>
                    <a href="/register">Registreren</a>
                </div>
            </div>
        </div>
    );
}
export default Login;