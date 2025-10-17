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

function App() {
    const [user, setUser] = useState(null);
    const [isMod, setIsMod] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");

        async function fetchUser() {
            if (storedUsername) {
                try {
                    console.log("📡 Fetching user data for:", storedUsername);
                    const res = await fetch(`http://localhost:8081/api/users/username/${storedUsername}`);
                    if (!res.ok) throw new Error("Failed to fetch user");
                    const data = await res.json();
                    console.log("👤 Loaded full user from backend:", data);

                    setUser(data); // now the full object
                    setIsMod(data.role === "MOD");
                } catch (err) {
                    console.error("❌ Failed to load user:", err);
                    setUser(null);
                }
            }
            setLoading(false);
        }

        fetchUser();
    }, []);

    function logout() {
        console.log("🚪 Logging out...");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("isMod");
        setUser(null);
        setIsMod(false);
    }

    if (loading) return <p>⏳ Gebruiker laden...</p>;

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? (
                            <HomepageUser
                                user={user}
                                logout={logout}
                                isMod={isMod}
                                onUserLoaded={setUser}
                            />
                        ) : (
                            <HomepageGuest />
                        )
                    }
                />
                <Route
                    path="/home"
                    element={
                        user ? (
                            <HomepageUser user={user} logout={logout} isMod={isMod} />
                        ) : (
                            <HomepageGuest />
                        )
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {isMod && (
                    <Route
                        path="/mod"
                        element={<ModPage user={user} logout={logout} />}
                    />
                )}

                <Route
                    path="/profile/:username"
                    element={<ProfilePage user={user} logout={logout} isMod={isMod} />}
                />

                <Route
                    path="/publiceren"
                    element={<PublishPage user={user} logout={logout} isMod={isMod} />}
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
