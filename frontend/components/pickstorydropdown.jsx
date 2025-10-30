import React, { useState, useRef, useEffect } from "react";
import Button from "./button.jsx";
import "./dropdown.css";

export default function PickStoryDropdown({ options, selectedStoryId, setSelectedStoryId }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);


    const [selectedStory, setSelectedStory] = useState(
        options.find(story => story.id === selectedStoryId) || null
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const story = options.find(s => s.id === selectedStoryId) || null;
        setSelectedStory(story);
    }, [selectedStoryId, options]);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <Button onClick={() => setOpen(!open)}>
                {selectedStory?.title || "Kies bestaand verhaal..."}
            </Button>

            {open && (
                <div className="genre-dropdown-menu">
                    {options.map((story) => (
                        <div
                            key={story.id}
                            className="genre-dropdown-item"
                            onClick={() => {
                                setSelectedStory(story);
                                setSelectedStoryId(story.id);
                                setOpen(false);
                            }}
                        >
                            {story.title}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
