import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/avatar-placeholder.png";
import "./avatar.css";

export default function AvatarMenu({ user, isMod = false, logout }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    function handleLogout() {
        if (logout) logout();
        navigate("/");
    }

    return (
        <div className="profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img src={avatar} alt="Profielfoto" className="avatar" />
            {dropdownOpen && (
                <div className="dropdown-menu">
                    <Link to={`/profile/${user}`} className="dropdown-item">
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
