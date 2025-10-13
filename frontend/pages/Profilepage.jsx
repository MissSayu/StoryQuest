import React from "react";
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



export default function ProfilePage({ user, logout, isMod }) {
    const { username } = useParams();

    function handleSearch(query) {
        console.log("Zoekterm:", query);
    }

    const stories = [
        { title: "Mystic Adventures", cover: book1 },
        { title: "Romance in the City", cover: book2 },
        { title: "Fantasy Tales", cover: book3 },
    ];

    const comics = [
        { title: "Cyberpunk Dreams", cover: book2 },
        { title: "Space Odyssey", cover: book3 },
        { title: "Magic Chronicles", cover: book1 },
    ];

    return (
        <>
            {/* Header */}
            <header className="header-user">
                <div className="header-left">
                    <Logo/>
                </div>

                <div className="header-center">
                    <Navbar onSearch={handleSearch}/>
                </div>

                <div className="header-right">
                    <AvatarMenu user={user=user} logout={logout} isMod={isMod} />
                </div>
            </header>

            <div className="profile-page">
                <ProfileSidebar user={user} />

                <main className="profile-main">
                    <div className="profile-stats">
                        <StatsCard type="stories" value="6 "/>
                        <StatsCard type="followers" value="120 "/>
                        <StatsCard type="following" value="45 "/>
                    </div>

                    <ContentSection title="Verhalen" items={stories} onSearch={handleSearch}/>
                    <ContentSection title="Comics" items={comics} onSearch={handleSearch}/>
                </main>
            </div>
        </>
    );
}
