import React, { useEffect, useState, useRef } from "react";
import Button from "./button.jsx";
import SearchBar from "./SearchBar";
import "./contentsection.css";

export default function ContentSection({ title, userId: propUserId, username, type, onSearch }) {
    const scrollRef = useRef(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [userId, setUserId] = useState(propUserId || null);

    useEffect(() => {
        if (!userId) {
            console.log("⏳ Waiting for userId...");
            return;
        }

        const fetchStories = async () => {
            try {
                setLoading(true);
                console.log("📡 Fetching all stories...");
                const res = await fetch(`http://localhost:8081/api/stories/username/${username}`);

                if (!res.ok) throw new Error(`Failed to fetch stories (${res.status})`);

                // Get raw text first
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (err) {
                    console.error("❌ Failed to parse JSON. Raw response:", text);
                    throw err;
                }

                console.log("✅ All stories fetched:", data);

                const filtered = data.filter(
                    item => item.user?.id === userId && item.type === type
                );
                console.log(`🎯 Filtered ${type} for user ${userId}:`, filtered);
                setItems(filtered);

            } catch (err) {
                console.error("❌ Error loading stories:", err);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [userId, type]);


    // 🧩 Search handler
    const handleSearch = (term) => {
        setSearchTerm(term.toLowerCase());
        if (onSearch) onSearch(term);
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm)
    );

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
                            {filteredItems.map((item, index) => (
                                <div key={index} className="content-item">
                                    <img
                                        src={item.coverImage || "/placeholders/book-cover-placeholder.png"}
                                        alt={item.title}
                                        className="book"
                                    />

                                    <p>{item.title}</p>
                                    <div className="content-actions">
                                        <Button>Bewerken</Button>
                                        <Button>Bekijken</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button className="scroll-btn" onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })}>
                            →
                        </Button>
                    </>
                )}
            </div>
        </section>
    );
}
