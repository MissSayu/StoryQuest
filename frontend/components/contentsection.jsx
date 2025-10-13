import React, { useEffect, useState } from "react";
import ProfileSidebar from "../components/sidemenu.jsx";
import ContentSection from "../components/contentsection.jsx";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import AvatarMenu from "../components/Avatar";
import "../styles/profile.css";

export default function ProfilePage({ user, logout, isMod }) {
    const [stories, setStories] = useState([]);
    const [comics, setComics] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch user's stories & comics
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(`http://localhost:8081/api/stories?userId=${user.id}`);
                if (!res.ok) throw new Error("Failed to fetch stories");
                const data = await res.json();

                // Separate stories and comics
                setStories(data.filter(item => item.type === "story"));
                setComics(data.filter(item => item.type === "comic"));
            } catch (err) {
                console.error(err);
            }
        };
        fetchContent();
    }, [user.id]);

    // Search filter
    const handleSearch = (term) => {
        setSearchTerm(term.toLowerCase());
    };

    const filterItems = (items) =>
        items.filter(item => item.title.toLowerCase().includes(searchTerm));

    return (
        <>
            <header className="header-user">
                <div className="header-left"><Logo /></div>
                <div className="header-center"><Navbar /></div>
                <div className="header-right">
                    <AvatarMenu user={user} logout={logout} isMod={isMod} />
                </div>
            </header>

            <div className="profile-page">
                <ProfileSidebar user={user} />

                <main className="profile-main">
                    {/* Stories Section */}
                    <ContentSection
                        title="Verhalen"
                        items={filterItems(stories).map(s => ({
                            title: s.title,
                            cover: s.coverImage || "/default-cover.png",
                            id: s.id
                        }))}
                        onSearch={handleSearch}
                    />

                    {/* Comics Section */}
                    <ContentSection
                        title="Comics"
                        items={filterItems(comics).map(c => ({
                            title: c.title,
                            cover: c.coverImage || "/default-cover.png",
                            id: c.id
                        }))}
                        onSearch={handleSearch}
                    />
                </main>
            </div>
        </>
    );
}
