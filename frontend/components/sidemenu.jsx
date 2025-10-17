import React from "react";
import avatarPlaceholder from "../assets/avatar-placeholder.png";
import statisticsIcon from "../assets/statistics-icon.png";
import profileIcon from "../assets/person-icon.png";
import settingsIcon from "../assets/settings-icon.png";
import "./sidebarmenu.css";
import Button from "../components/button.jsx";

function ProfileSidebar({ user }) {
    if (!user) return <p>Loading sidebar...</p>;

    const username = user.username || "Onbekende gebruiker";
    const bio = user.bio || "Nog geen bio ingesteld.";
    const profileImg = user.avatarUrl || avatarPlaceholder;

    return (
        <aside className="profile-sidebar">
            <div className="profile-info">
                <img src={profileImg} alt="Profile" className="profile-photo" />
                <h3 className="username">{username}</h3>
                <p>{bio}</p>
                <Button onClick={() => {}}>Profiel bewerken</Button>
            </div>

            <nav className="sidebar-menu">
                <a href="#">
                    <img src={statisticsIcon} alt="Dashboard" className="menu-icon" />
                    Dashboard
                </a>
                <a href="#">
                    <img src={profileIcon} alt="Profiel gegevens" className="menu-icon" />
                    Profiel gegevens
                </a>
                <a href="#">
                    <img src={settingsIcon} alt="Instellingen" className="menu-icon" />
                    Instellingen
                </a>
            </nav>
        </aside>
    );
}

export default ProfileSidebar;
