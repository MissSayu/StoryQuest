import React, { useState, useEffect, useRef } from "react";
import searchIcon from "../assets/search-icon.png";
import "./searchbar.css";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ placeholder = "Zoeken..." }) {
    const [q, setQ] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!q) return setSuggestions([]);
        async function fetchSuggestions() {
            try {
                const res = await fetch(`http://localhost:8081/api/search?q=${encodeURIComponent(q)}`);
                if (!res.ok) return;
                const data = await res.json();


                const publishedStories = (data.stories || []).filter(s => s.status === "published");
                const publishedEpisodes = (data.episodes || []).filter(e => e.status === "published");

                const combined = [
                    ...publishedStories,
                    ...publishedEpisodes,
                    ...(data.users || [])
                ];
                setSuggestions(combined.slice(0, 5)); // top 5
                setShowDropdown(true);
            } catch (err) {
                console.error(err);
            }
        }
        fetchSuggestions();
    }, [q]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!q) return;
        navigate(`/search?q=${encodeURIComponent(q)}`);
    };

    const handleClickSuggestion = (text) => {
        setQ(text);
        navigate(`/search?q=${encodeURIComponent(text)}`);
    };

    return (
        <div className="searchbar-wrapper" ref={ref}>
            <form className="searchbar" onSubmit={handleSubmit}>
                <img src={searchIcon} alt="Zoek" className="search-icon" />
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={placeholder}
                    aria-label="Search input"
                />
            </form>

            {showDropdown && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                    {suggestions.map((item, idx) => (
                        <div
                            key={idx}
                            className="suggestion-item"
                            onClick={() => handleClickSuggestion(item.title || item.username)}
                        >
                            {item.title || item.username}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
