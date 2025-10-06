import React, { useState } from "react";
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
    const [user, setUser] = useState("Virelight");
    const [isMod, setIsMod] = useState(false);

    function logout() {
        setUser(null);
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={user ? <HomepageUser user={user} logout={logout} /> : <HomepageGuest />}
                />
                <Route
                    path="/home"
                    element={user ? <HomepageUser user={user} logout={logout} /> : <HomepageGuest />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/mod" element={<ModPage user={user} logout={logout} />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/publiceren" element={<PublishPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
