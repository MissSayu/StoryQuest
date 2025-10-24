import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "../frontend/styles/global.css";

import HomepageGuest from "../frontend/pages/HomepageGuest.jsx";
import HomepageUser from "../frontend/pages/HomepageUser.jsx";
import ModPage from "../frontend/pages/Modpage.jsx";
import ProfilePage from "../frontend/pages/Profilepage.jsx";
import Login from "../frontend/pages/Login.jsx";
import Register from "../frontend/pages/Register.jsx";
import PublishPage from "../frontend/pages/Publishpage.jsx";
import ReadPage from "../frontend/pages/ReadPage.jsx";

function App() {
    const [user, setUser] = useState(null);
    const [isMod, setIsMod] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");

        async function fetchUser() {
            if (storedUsername) {
                try {
                    const res = await fetch(`http://localhost:8081/api/users/username/${storedUsername}`);
                    if (!res.ok) throw new Error("Failed to fetch user");
                    const data = await res.json();
                    setUser(data);
                    setIsMod(data.role === "MOD");
                } catch (err) {
                    console.error("Failed to load user:", err);
                    setUser(null);
                    setIsMod(false);
                }
            }
            setLoading(false);
        }

        fetchUser();
    }, []);

    // ✅ Fixed logout that clears storage and instantly redirects to HomepageGuest
    function logout() {
        // Remove all saved user/session data
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("isMod");

        // Reset app state
        setUser(null);
        setIsMod(false);

        // Force a redirect to guest homepage (guaranteed clean state)
        window.location.href = "/";
    }

    if (loading) return <p>⏳ Gebruiker laden...</p>;

    return (
        <Router>
            <Routes>
                {/* Homepage */}
                <Route
                    path="/"
                    element={user ? (
                        <HomepageUser user={user} logout={logout} isMod={isMod} />
                    ) : (
                        <HomepageGuest />
                    )}
                />
                <Route
                    path="/home"
                    element={user ? (
                        <HomepageUser user={user} logout={logout} isMod={isMod} />
                    ) : (
                        <HomepageGuest />
                    )}
                />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Mod page (restricted) */}
                {isMod && (
                    <Route path="/mod" element={<ModPage user={user} logout={logout} />} />
                )}

                {/* Profile + Publishing */}
                <Route
                    path="/profile/:username"
                    element={<ProfilePage user={user} logout={logout} isMod={isMod} />}
                />
                <Route
                    path="/publiceren"
                    element={<PublishPage user={user} logout={logout} isMod={isMod} />}
                />

                {/* Read page */}
                <Route
                    path="/read/:storyId"
                    element={<ReadPage user={user} />}
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
