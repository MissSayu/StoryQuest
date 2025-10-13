import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarPlaceholder from "../assets/avatar-placeholder.png";
import "./avatar.css";

export default function AvatarMenu({ user, logout }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchUserData = async () => {
            try {
                const res = await fetch(`http://localhost:8081/api/users/username/${user}`);
                if (!res.ok) throw new Error(`User not found: ${res.status}`);
                const data = await res.json();
                setUserData(data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setUserData(null);
            }
        };

        fetchUserData();
    }, [user]);

    const username = userData?.username || user || "Onbekende gebruiker";
    const role = userData?.role || "USER";
    const profileImg = userData?.avatarUrl ? userData.avatarUrl : avatarPlaceholder;
    const isMod = role === "MOD";

    const handleLogout = () => {
        if (logout) logout();
        navigate("/");
    };

    return (
        <div className="profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img
                src={profileImg}
                alt="Profielfoto"
                className="avatar"
            />

            {dropdownOpen && (
                <div className="dropdown-menu">
                    <Link to={`/profile/${username}`} className="dropdown-item">
                        Profiel
                    </Link>
                    <button className="dropdown-item">Instellingen</button>

                    {isMod && (
                        <Link to="/mod" className="dropdown-item">
                            ModPage
                        </Link>
                    )}

                    <button className="dropdown-item" onClick={handleLogout}>
                        Uitloggen
                    </button>
                </div>
            )}
        </div>
    );
}
