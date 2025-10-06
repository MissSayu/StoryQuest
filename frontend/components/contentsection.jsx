import React, { useRef } from "react";
import Button from "./button.jsx";
import SearchBar from "./SearchBar";
import "./contentsection.css";

export default function ContentSection({ title, items, onSearch }) {
    const scrollRef = useRef(null);


    const handleScrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    return (
        <section className="content-section">

            <div className="content-header">
                <h3>{title}</h3>
                <div className="search-wrapper">
                    <SearchBar placeholder="Zoeken..." onSearch={onSearch}/>
                </div>
            </div>

            <div className="content-wrapper">
                <div className="content-grid" ref={scrollRef}>
                    {items.map((item, index) => (
                        <div key={index} className="content-item">
                            <img src={item.cover} alt={item.title} className="book"/>
                            <p>{item.title}</p>
                            <div className="content-actions">
                                <Button>Bewerken</Button>
                                <Button>Bekijken</Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scroll-knop rechts */}
                <Button className="scroll-btn" onClick={handleScrollRight}>
                    →
                </Button>
            </div>
        </section>
    );
}
