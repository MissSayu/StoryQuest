import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";
import Logo from "../components/Logo";
import AvatarMenu from "../components/Avatar";
import Navbar from "../components/Navbar.jsx";

function HomepageUser({ user, logout, isMod }) {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);

    function handleSearch(query) {
        console.log("Zoekterm:", query);
    }

    useEffect(() => {
        async function fetchStories() {
            try {

                const res = await fetch("http://localhost:8081/api/stories/random?count=10");
                if (!res.ok) throw new Error("Failed to fetch stories");
                const data = await res.json();


                const publishedStories = data.filter(story => story.status === "published");


                setStories(publishedStories.slice(0, 3));
            } catch (err) {
                console.error("Failed to load stories:", err);
            }
        }
        fetchStories();
    }, []);

    return (
        <div className="homepage">
            <header className="header-user">
                <Logo user={user} />
                <Navbar onSearch={handleSearch} />
                <AvatarMenu user={user} logout={logout} isMod={isMod} />
            </header>

            <main>
                <section className="welcome-section">
                    <h1>Welkom terug, {user ? user.username : "..."}</h1>
                    <p>Hier zijn enkele verhalen die we voor jou aanraden:</p>

                    <div className="recommended-books">
                        {stories.length > 0 ? (
                            stories.map((story) => (
                                <div
                                    key={story.id}
                                    className="book-card"
                                    onClick={() => navigate(`/read/${story.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <img
                                        src={
                                            story.coverImage
                                                ? `http://localhost:8081${story.coverImage.replace(
                                                    "src/main/resources/static",
                                                    ""
                                                )}`
                                                : "http://localhost:8081/uploads/default-cover.png"
                                        }
                                        alt={story.title || "Story Cover"}
                                        className="book-cover"
                                    />
                                    <p>{story.title}</p>
                                    <small>Door {story.author?.username || "Onbekend"}</small>
                                </div>
                            ))
                        ) : (
                            <p>Loading stories...</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default HomepageUser;
