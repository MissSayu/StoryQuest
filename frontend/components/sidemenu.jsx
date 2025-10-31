import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatarPlaceholder from "../assets/avatar-placeholder.png";
import statisticsIcon from "../assets/statistics-icon.png";
import profileIcon from "../assets/person-icon.png";
import settingsIcon from "../assets/settings-icon.png";
import "./sidebarmenu.css";
import Button from "../components/button.jsx";
import api from "../../src/api"; // axios instance met JWT

function ProfileSidebar({
                            user,
                            author,
                            episodes,
                            onSelectEpisode,
                            selectedEpisode,
                            onEditProfile,
                        }) {
    const navigate = useNavigate();
    const isReadPage = !!episodes;
    const viewedUser = author || user;
    const displayName = viewedUser?.username || "Onbekende gebruiker";
    const bio = viewedUser?.bio || "Nog geen bio beschikbaar.";

    const [profileImg, setProfileImg] = useState(avatarPlaceholder);
    const [isFollowing, setIsFollowing] = useState(false);

    // Update profielafbeelding
    useEffect(() => {
        const url = viewedUser?.avatarUrl;
        setProfileImg(url ? (url.startsWith("http") ? url : `http://localhost:8081${url}`) : avatarPlaceholder);
    }, [viewedUser?.avatarUrl]);

    // Check of de ingelogde gebruiker de auteur volgt
    useEffect(() => {
        if (!author || !user || author.id === user.id) return;

        const checkFollowStatus = async () => {
            try {
                const res = await api.get(`/follow/${user.id}/isFollowing/${author.id}`);
                setIsFollowing(res.data);
            } catch (err) {
                console.error("Error checking follow status:", err);
            }
        };
        checkFollowStatus();
    }, [author, user]);

    // Volg/ontvolg auteur
    const toggleFollowAuthor = async () => {
        if (!user || !author) {
            alert("Je moet ingelogd zijn om een auteur te volgen.");
            return;
        }

        try {
            const action = isFollowing ? "unfollowAuthor" : "followAuthor";
            await api.post(`/follow/${user.id}/${action}/${author.id}`);
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error("Fout bij volgen/ontvolgen:", err);
            alert("Kon auteur niet volgen. Controleer of je bent ingelogd.");
        }
    };

    const goToProfile = () => {
        if (viewedUser) navigate(`/profile/${viewedUser.username}`);
    };

    return (
        <aside className="profile-sidebar">
            <div className="profile-info">
                <img
                    src={profileImg}
                    alt="Profile"
                    className="profile-photo"
                    onError={(e) => (e.target.src = avatarPlaceholder)}
                />

                <h3
                    className="username"
                    style={isReadPage ? { cursor: "pointer", textDecoration: "underline" } : {}}
                    onClick={isReadPage ? goToProfile : undefined}
                >
                    {displayName}
                </h3>
                <p>{bio}</p>

                {author && user && author.id !== user.id ? (
                    <Button onClick={toggleFollowAuthor}>
                        {isFollowing ? "Auteur ontvolgen" : "Volg auteur"}
                    </Button>
                ) : (
                    user && viewedUser.id === user.id && (
                        <Button onClick={onEditProfile}>Profiel bewerken</Button>
                    )
                )}
            </div>

            {isReadPage && episodes && episodes.length > 0 && (
                <nav className="sidebar-menu">
                    <h4>Hoofdstukken</h4>
                    {episodes.map((ep) => (
                        <a
                            key={ep.id}
                            onClick={() => onSelectEpisode?.(ep)}
                            className={selectedEpisode?.id === ep.id ? "active" : ""}
                        >
                            <span className="menu-icon">📖</span>
                            {ep.title}
                        </a>
                    ))}
                </nav>
            )}

            {!isReadPage && user && viewedUser.id === user.id && (
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
