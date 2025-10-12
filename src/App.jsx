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
    const [user, setUser] = useState(localStorage.getItem("username") || null);
    const [isMod, setIsMod] = useState(localStorage.getItem("isMod") === "true");

    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        const storedIsMod = localStorage.getItem("isMod");

        if (storedUser) setUser(storedUser);
        if (storedIsMod) setIsMod(storedIsMod === "true");
    }, []);

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("isMod");
        setUser(null);
        setIsMod(false);
    }


    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? (
                            <HomepageUser user={user} isMod={isMod} logout={logout} />

                        ) : (
                            <HomepageGuest />
                        )
                    }
                />
                <Route
                    path="/home"
                    element={
                        user ? (
                            <HomepageUser user={user} logout={logout} />
                        ) : (
                            <HomepageGuest />
                        )
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {isMod && (
                    <Route path="/mod" element={<ModPage user={user} logout={logout} />} />)}
                <Route
                    path="/profile/:username"
                    element={<ProfilePage user={user} logout={logout} isMod={isMod} />}/>
                <Route
                    path="/publiceren"
                    element={<PublishPage user={user} logout={logout} isMod={isMod} />}/>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
