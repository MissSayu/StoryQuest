import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/profile.css";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import AvatarMenu from "../components/Avatar";
import ProfileSidebar from "../components/sidemenu.jsx";
import StatsCard from "../components/statscard.jsx";
import ContentSection from "../components/ContentSection";
import book1 from "../assets/book-cover-placeholder.png";
import book2 from "../assets/book-cover-placeholder.png";
import book3 from "../assets/book-cover-placeholder.png";

export default function ProfilePage({ user: loggedInUser, logout, isMod }) {
    const { username } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the profile user based on URL param
    useEffect(() => {
        const fetchProfileUser = async () => {
            try {
                const res = await fetch(`http://localhost:8081/api/users/username/${username}`);
                if (!res.ok) throw new Error("User not found");
                const data = await res.json();
                setProfileUser(data);
            } catch (err) {
                console.error("Failed to fetch profile user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileUser();
    }, [username]);

    function handleSearch(query) {
        console.log("Zoekterm:", query);
    }


    return (
        <>
            {/* Header */}
            <header className="header-user">
                <div className="header-left">
                    <Logo />
                </div>
                <div className="header-center">
                    <Navbar onSearch={handleSearch} />
                </div>
                <div className="header-right">
                    {/* Pass loggedInUser object if available, otherwise null */}
                    <AvatarMenu user={loggedInUser || null} logout={logout} isMod={isMod} />
                </div>
            </header>

            <div className="profile-page">
                {/* Sidebar receives full user object or username string */}
                <ProfileSidebar user={loggedInUser || null} />

                <main className="profile-main">
                    <div className="profile-stats">
                        {profileUser && (
                            <>
                                <StatsCard type="stories" userId={profileUser.id}/>
                                <StatsCard type="followers" userId={profileUser.id}/>
                                <StatsCard type="following" userId={profileUser.id}/>
                            </>
                        )}
                    </div>

            {loading ? (
                <p style={{marginLeft: "15px"}}>Gebruiker laden...</p>
            ) : profileUser ? (
                <>
                    <ContentSection
                        title="Verhalen"
                        userId={profileUser.id}
                                username={profileUser.username}
                                type="story"
                                onSearch={handleSearch}
                            />
                            <ContentSection
                                title="Comics"
                                userId={profileUser.id}
                                username={profileUser.username}
                                type="comic"
                                onSearch={handleSearch}
                            />
                        </>
                    ) : (
                        <p style={{ marginLeft: "15px" }}>Gebruiker niet gevonden.</p>
                    )}
                </main>
            </div>
        </>
    );
}
