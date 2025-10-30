import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "../frontend/styles/global.css";

import HomepageGuest from "../frontend/pages/HomepageGuest.jsx";
import HomepageUser from "../frontend/pages/HomepageUser.jsx";
import ModPage from "../frontend/pages/Modpage.jsx";
import ProfilePage from "../frontend/pages/Profilepage.jsx";
import Login from "../frontend/pages/Login.jsx";
import Register from "../frontend/pages/Register.jsx";
import PublishPage from "../frontend/pages/Publishpage.jsx";
import ReadPage from "../frontend/pages/ReadPage.jsx";
import SearchResultsPage from "../frontend/pages/Seachpage";

// Wrap App in a Router-aware component to use navigate
function AppWrapper() {
    const navigate = useNavigate();
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

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("isMod");

        setUser(null);
        setIsMod(false);

        navigate("/", { replace: true }); // React Router navigation
    }

    if (loading) return <p>⏳ Gebruiker laden...</p>;

    return (
        <Routes>
            <Route
                path="/"
                element={user ? <HomepageUser user={user} logout={logout} isMod={isMod} /> : <HomepageGuest />}
            />
            <Route
                path="/home"
                element={user ? <HomepageUser user={user} logout={logout} isMod={isMod} /> : <HomepageGuest />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {isMod && <Route path="/mod" element={<ModPage user={user} logout={logout} />} />}
            <Route path="/profile/:username" element={<ProfilePage user={user} logout={logout} isMod={isMod} />} />
            <Route path="/publiceren" element={<PublishPage user={user} logout={logout} isMod={isMod} />} />
            <Route path="/read/:storyId" element={<ReadPage user={user} logout={logout} />} />
            <Route path="/search" element={<SearchResultsPage user={user} logout={logout} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
}
