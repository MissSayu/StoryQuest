import React from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import SearchBar from "../components/SearchBar.jsx";
import Button from "../components/button.jsx";

export default function Navbar({ onSearch }) {
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <div className="nav-links">
                <Button onClick={() => navigate("/homepage-user")}>Home</Button>
                <Button onClick={() => navigate("/verhalen")}>Verhalen</Button>
                <Button onClick={() => navigate("/webcomics")}>Webcomics</Button>
                <Button onClick={() => navigate("/publiceren")}>Publiceren</Button>
            </div>

            <div className="search-container">
                <SearchBar placeholder="Zoeken..." onSearch={onSearch} />
            </div>
        </div>
    );
}
