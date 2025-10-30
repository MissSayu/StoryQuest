import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./button.jsx";
import SearchBar from "./SearchBar";
import "./contentsection.css";
import placeholderCover from "../assets/book-cover-placeholder.png";

export default function ContentSection({ title, username, type, onSearch, user }) {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const isOwnProfile = user?.username === username;

    useEffect(() => {
        if (!username) return;

        const fetchStories = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8081/api/stories/username/${username}`);
                if (!res.ok) throw new Error(`Failed to fetch stories (${res.status})`);

                const data = await res.json();
                console.log("Fetched stories:", data);


                const filteredByType = data.filter(item => item.type === type);
                setItems(filteredByType);
            } catch (err) {
                console.error("Error loading stories:", err);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [username, type]);

    const handleSearch = (term) => {
        setSearchTerm(term.toLowerCase());
        if (onSearch) onSearch(term);
    };


    const filteredItems = items
        .filter(item => item.title.toLowerCase().includes(searchTerm))
        .filter(item => {
            // Hide drafts for other users
            if (!isOwnProfile && item.status.toLowerCase() === "draft") return false;
            return true;
        });

    const handleViewStory = (storyId) => {
        navigate(`/read/${storyId}`);
    };

    return (
        <section className="content-section">
            <div className="content-header">
                <h3>{title}</h3>
                <div className="search-wrapper">
                    <SearchBar placeholder="Zoeken..." onSearch={handleSearch} />
                </div>
            </div>

            <div className="content-wrapper">
                {loading ? (
                    <p style={{ marginLeft: "15px" }}>Laden...</p>
                ) : filteredItems.length === 0 ? (
                    <p style={{ marginLeft: "15px", color: "red" }}>Geen resultaten gevonden.</p>
                ) : (
                    <>
                        <div className="content-grid" ref={scrollRef}>
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`content-item ${isOwnProfile && item.status.toLowerCase() === "draft" ? "draft" : ""}`}
                                >
                                    <img
                                        src={item.coverImage ? `http://localhost:8081${item.coverImage}` : placeholderCover}
                                        alt={item.title || "Geen titel"}
                                        className="book"
                                    />
                                    <p className="story-title">
                                        {item.title || "Geen titel"}
                                        {isOwnProfile && item.status.toLowerCase() === "draft" && (
                                            <span className="draft-badge">Draft</span>
                                        )}
                                    </p>
                                    <div className="content-actions">
                                        <Button onClick={() => handleViewStory(item.id)}>Bekijken</Button>
                                        {isOwnProfile && (
                                            <Button onClick={() => console.log(`Edit story ${item.id}`)}>Bewerken</Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            className="scroll-btn"
                            onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
                        >
                            →
                        </Button>
                    </>
                )}
            </div>
        </section>
    );
}
