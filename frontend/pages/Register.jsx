import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import "../styles/login.css";
import Logo from "../components/Logo";

function Register() {
    const [error, setError] = useState("");

    const handleRegister = async (values) => {
        setError("");
        try {
            const response = await fetch("http://localhost:8081/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (response.ok) {
                window.location.href = "/login"; // na registratie naar login
            } else {
                setError(data.message || "Er is iets misgegaan bij registratie");
            }
        } catch (err) {
            console.error("Register error:", err);
            setError("Er is iets misgegaan, probeer het opnieuw.");
        }
    };

    const RegisterSchema = Yup.object().shape({
        email: Yup.string()
            .email("Ongeldig emailadres")
            .required("Email is verplicht"),
        username: Yup.string().required("Gebruikersnaam is verplicht"),
        password: Yup.string()
            .min(6, "Wachtwoord minimaal 6 tekens")
            .required("Wachtwoord is verplicht"),
    });

    return (
        <div className="center-container">
            <Logo />

            <div className="login-box">
                <h1>Registreren</h1>

                <Formik
                    initialValues={{ email: "", username: "", password: "" }}
                    validationSchema={RegisterSchema}
                    onSubmit={handleRegister}
                >
                    {({ values, errors, touched,
                          handleChange, handleBlur,
                          handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Voer je email in"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.email && touched.email && (
                                <p className="error">{errors.email}</p>
                            )}

                            <label htmlFor="username">Gebruikersnaam:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Kies een gebruikersnaam"
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
                                placeholder="Voer je wachtwoord in"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.password && touched.password && (
                                <p className="error">{errors.password}</p>
                            )}

                            <button type="submit" className="button">Registreren</button>

                            {error && <p className="error">{error}</p>}

                            <div className="register-text">
                                <p>Heb je al een account?</p>
                                <a href="/login">Login</a>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default Register;