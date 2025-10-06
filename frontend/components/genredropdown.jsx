import React, { useState, useRef, useEffect } from "react";
import Button from "./button.jsx";
import "./dropdown.css";

export default function GenreDropdown({ selectedGenre, setSelectedGenre, options }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <Button onClick={() => setOpen(!open)}>
                {selectedGenre || "Selecteer Genre"}
            </Button>

            {open && (
                <div className="genre-dropdown-menu">
                    {options.map((genre, index) => (
                        <div
                            key={index}
                            className="genre-dropdown-item"
                            onClick={() => {
                                setSelectedGenre(genre);
                                setOpen(false);
                            }}
                        >
                            {genre}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
