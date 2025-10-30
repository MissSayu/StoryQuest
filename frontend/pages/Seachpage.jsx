import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import AvatarMenu from "../components/Avatar";
import Navbar from "../components/Navbar.jsx";
import "../styles/searchpage.css";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchResultsPage({ user, logout, isMod, handleSearch }) {
    const query = useQuery().get("q") || "";
    const [results, setResults] = useState({ stories: [], users: [], episodes: [] });
    const navigate = useNavigate();

    useEffect(() => {
        if (!query) return;

        async function fetchResults() {
            try {
                const res = await fetch(`http://localhost:8081/api/search?q=${encodeURIComponent(query)}`);
                if (!res.ok) throw new Error("Search failed");
                const data = await res.json();

                // Only include published stories and episodes
                const publishedStories = (data.stories || []).filter(story => story.status === "published");
                const publishedEpisodes = (data.episodes || []).filter(ep => ep.status === "published");

                setResults({
                    stories: publishedStories,
                    users: Array.isArray(data.users) ? data.users : [],
                    episodes: publishedEpisodes,
                });
            } catch (err) {
                console.error(err);
            }
        }

        fetchResults();
    }, [query]);

    return (
        <div className="search-results-page">
            <header className="header-user">
                <Logo user={user} />
                <Navbar onSearch={handleSearch} />
                <AvatarMenu user={user} logout={logout} isMod={isMod} />
            </header>

            <main className="search-results-main">
                <h2>Resultaten voor: "{query}"</h2>

                {results.stories.length > 0 && (
                    <>
                        <h3>Verhalen</h3>
                        <div className="grid stories-grid">
                            {results.stories.map(story => (
                                <div
                                    key={story.id}
                                    className="book-card"
                                    onClick={() => navigate(`/read/${story.id}`)}
                                >
                                    <img
                                        src={
                                            story.coverImage
                                                ? `http://localhost:8081${story.coverImage.replace("src/main/resources/static", "")}`
                                                : "http://localhost:8081/uploads/default-cover.png"
                                        }
                                        alt={story.title}
                                        className="book-cover"
                                    />
                                    <p>{story.title}</p>
                                    <small>Door {story.author?.username || "Onbekend"}</small>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {results.episodes.length > 0 && (
                    <>
                        <h3>Episodes</h3>
                        <div className="grid episodes-grid">
                            {results.episodes.map(ep => (
                                <div
                                    key={ep.id}
                                    className="episode-card"
                                    onClick={() => navigate(`/read/${ep.storyId}#${ep.id}`)}
                                >
                                    <img
                                        src={ep.coverUrl ? `http://localhost:8081${ep.coverUrl}` : `http://localhost:8081${ep.storyCoverImage}`}
                                        alt={ep.title}
                                        className="episode-cover"
                                    />
                                    <p>{ep.title}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {results.users.length > 0 && (
                    <>
                        <h3>Gebruikers</h3>
                        <div className="grid users-grid">
                            {results.users.map(u => (
                                <div
                                    key={u.id}
                                    className="user-card"
                                    onClick={() => navigate(`/profile/${u.username}`)}
                                >
                                    <img
                                        src={u.avatarUrl || "http://localhost:8081/avatars/default.jpg"}
                                        alt={u.username}
                                        className="user-avatar"
                                    />
                                    <p>{u.username}</p>
                                    <small>{u.bio || "Geen bio beschikbaar"}</small>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {results.stories.length === 0 &&
                    results.episodes.length === 0 &&
                    results.users.length === 0 && <p>Geen resultaten gevonden.</p>}
            </main>
        </div>
    );
}
