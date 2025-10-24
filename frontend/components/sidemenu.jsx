import React, { useEffect, useState } from "react";
import avatarPlaceholder from "../assets/avatar-placeholder.png";
import statisticsIcon from "../assets/statistics-icon.png";
import profileIcon from "../assets/person-icon.png";
import settingsIcon from "../assets/settings-icon.png";
import "./sidebarmenu.css";
import Button from "../components/button.jsx";

function ProfileSidebar({ user, author, episodes, onSelectEpisode, selectedEpisode }) {
    const isReadPage = !!author; // only true if author exists
    const [isFollowing, setIsFollowing] = useState(false);

    const displayName = author?.username || user?.username || "Onbekende gebruiker";
    const bio = author?.bio || user?.bio || "Nog geen bio beschikbaar.";
    const profileImg = author?.avatarUrl || user?.avatarUrl || avatarPlaceholder;

    // Check if the current user is following this author
    useEffect(() => {
        if (!isReadPage || !user) return;

        async function checkFollowStatus() {
            try {
                const res = await fetch(
                    `http://localhost:8081/api/follow/${user.id}/isFollowing/${author.id}`
                );
                if (res.ok) {
                    const status = await res.json();
                    setIsFollowing(status);
                } else {
                    console.error("Failed to fetch follow status");
                }
            } catch (err) {
                console.error("Error checking follow status:", err);
            }
        }

        checkFollowStatus();
    }, [user, author, isReadPage]);

    // Toggle follow/unfollow author
    const toggleFollowAuthor = async () => {
        if (!user || !author) {
            alert("Je moet ingelogd zijn om een auteur te volgen.");
            return;
        }

        try {
            const url = `http://localhost:8081/api/follow/${user.id}/${isFollowing ? "unfollowAuthor" : "followAuthor"}/${author.id}`;
            const res = await fetch(url, { method: "POST" });

            if (res.ok) {
                setIsFollowing(!isFollowing);
            } else {
                alert("Kon auteur niet volgen/ontvolgen.");
                console.error(await res.text());
            }
        } catch (err) {
            console.error("Fout bij volgen/ontvolgen:", err);
        }
    };

    return (
        <aside className="profile-sidebar">
            <div className="profile-info">
                <img src={profileImg} alt="Profile" className="profile-photo" />
                <h3 className="username">{displayName}</h3>
                <p>{bio}</p>

                {isReadPage && (
                    <Button onClick={toggleFollowAuthor}>
                        {isFollowing ? "Auteur ontvolgen" : "Volg auteur"}
                    </Button>
                )}

                {!isReadPage && (
                    <Button onClick={() => alert("Profiel bewerken")}>Profiel bewerken</Button>
                )}
            </div>

            {isReadPage && episodes && episodes.length > 0 && (
                <nav className="sidebar-menu">
                    <h4>Hoofdstukken</h4>
                    {episodes.map((ep) => (
                        <a
                            key={ep.id}
                            onClick={() => onSelectEpisode(ep)}
                            className={selectedEpisode?.id === ep.id ? "active" : ""}
                        >
                            <span className="menu-icon">📖</span>
                            {ep.title}
                        </a>
                    ))}
                </nav>
            )}

            {!isReadPage && (
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
            )}
        </aside>
    );
}

export default ProfileSidebar;
