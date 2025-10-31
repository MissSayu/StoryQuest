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

import api from "./api";

function AppWrapper() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isMod, setIsMod] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");

        async function fetchUser() {
            if (token && storedUsername) {
                try {
                    // gebruik axios instance, headers worden automatisch toegevoegd
                    const res = await api.get(`/users/username/${storedUsername}`);
                    setUser(res.data);
                    setIsMod(res.data.role === "MOD");
                } catch (err) {
                    console.error("Failed to load user:", err);
                    // token niet geldig? logout en clear localStorage
                    logout(true);
                }
            }
            setLoading(false);
        }

        fetchUser();
    }, []);

    function logout(clearToken = true) {
        if (clearToken) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("isMod");
        }

        setUser(null);
        setIsMod(false);
        navigate("/", { replace: true });
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
