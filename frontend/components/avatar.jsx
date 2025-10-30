import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarPlaceholder from "../assets/avatar-placeholder.png";
import "./avatar.css";

export default function AvatarMenu({ user, logout }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    if (!user) return null;

    const username = user.username || "Onbekende gebruiker";
    const role = user.role || "USER";
    const profileImg = user.avatarUrl || avatarPlaceholder;
    const isMod = role === "MOD";

    const handleLogout = () => {
        if (logout) logout();
        setDropdownOpen(false);
        navigate("/", { replace: true });
    };

    return (
        <div className="profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img src={profileImg} alt="Profielfoto" className="avatar" />

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
