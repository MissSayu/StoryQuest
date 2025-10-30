import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Logo from "../components/Logo";
import "../styles/login.css";

function Login() {
    const [error, setError] = useState("");

    const handleLogin = async (values) => {
        setError("");
        try {
            const response = await fetch("http://localhost:8081/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", values.username);
                localStorage.setItem("isMod", data.isMod);
                window.location.href = "/homepage";
            } else {
                setError(data.message || "Invalid username or password");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Er is iets misgegaan, probeer het opnieuw.");
        }
    };

    const LoginSchema = Yup.object().shape({
        username: Yup.string().required("Gebruikersnaam is verplicht"),
        password: Yup.string()
            .min(6, "Wachtwoord minimaal 6 tekens")
            .required("Wachtwoord is verplicht"),
    });

    return (
        <div className="center-container">
            <Logo />

            <div className="login-box">
                <h1>Log in</h1>

                <Formik
                    initialValues={{ username: "", password: "" }}
                    validationSchema={LoginSchema}
                    onSubmit={handleLogin}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">Gebruikersnaam:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Virelight"
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.username && touched.username && (
                                <p className="error">{errors.username}</p>
                            )}

                            <label htmlFor="password">Wachtwoord:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Wachtwoord"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.password && touched.password && (
                                <p className="error">{errors.password}</p>
                            )}

                            <button type="submit" className="button">
                                Log in
                            </button>

                            <a href="#" className="forgot-password">
                                Wachtwoord vergeten?
                            </a>

                            {error && <p className="error">{error}</p>}

                            <div className="register-text">
                                <p>Nog geen account?</p>
                                <a href="/register">Registreren</a>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default Login;