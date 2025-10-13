import React, { useEffect, useState } from "react";
import avatarPlaceholder from "../assets/avatar-placeholder.png";
import statisticsIcon from "../assets/statistics-icon.png";
import profileIcon from "../assets/person-icon.png";
import settingsIcon from "../assets/settings-icon.png";
import "./sidebarmenu.css";
import Button from "../components/button.jsx";

function ProfileSidebar({ user }) {
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        if (!user) return;


        const fetchUserData = async () => {
            try {
                const res = await fetch(`http://localhost:8081/api/users/username/${user}`);
                if (!res.ok) throw new Error(`User not found: ${res.status}`);
                const data = await res.json();
                console.log("Fetched user data:", data);
                setUserData(data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setUserData(null);
            }
        };

        fetchUserData();
    }, [user]);


    const username = userData?.username || user || "Onbekende gebruiker";
    const bio = userData?.bio || "Nog geen bio ingesteld.";
    const profileImg = userData?.avatarUrl
        ? userData.avatarUrl
        : avatarPlaceholder;

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
