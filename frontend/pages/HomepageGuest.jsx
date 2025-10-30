import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/homepage-guest.css";
import Logo from "../components/Logo";
import Button from "../components/button.jsx";

function HomepageGuest() {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);

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
        <div className="fullscreen-bg">
            <div className="homepage">
                <header>
                    <Logo />

                    <div className="header-buttons">
                        <Button className="header-button" onClick={() => navigate("/login")}>
                            Log in
                        </Button>

                        <Button className="header-button" onClick={() => navigate("/register")}>
                            Registreren
                        </Button>
                    </div>
                </header>

                <main>
                    <section className="intro">
                        <div className="intro-content">
                            <div className="intro-text">
                                <h1>Start je avontuur in de wereld van verhalen en webcomics.</h1>
                                <p>
                                    Bij StoryQuest kan jij jouw creatieve universum bouwen en delen met de wereld.
                                </p>
                                <Button className="cta-btn" onClick={() => navigate("/login")}>
                                    Begin nu met schrijven
                                </Button>
                            </div>

                            <div className="intro-books">
                                <h2>Populaire verhalen</h2>
                                <div className="book-list">
                                    {stories.length > 0 ? (
                                        stories.map((story) => (
                                            <div key={story.id} className="book">
                                                <img
                                                    src={
                                                        story.coverImage
                                                            ? `http://localhost:8081${story.coverImage.replace(
                                                                "src/main/resources/static",
                                                                ""
                                                            )}`
                                                            : "/placeholders/book-placeholder.png"
                                                    }
                                                    alt={story.title || "Story Cover"}
                                                    className="book"
                                                />
                                                <p className="book-title">{story.title}</p> {/* Added title below cover */}
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            <div className="book"/>
                                            <div className="book"/>
                                            <div className="book"/>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default HomepageGuest;
