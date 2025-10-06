import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Logo({ user }) {
    const navigate = useNavigate();

    function handleClick() {
        if (user) {
            navigate("/home");
        } else {
            navigate("/");
        }
    }

    return (
        <img
            src={logo}
            alt="StoryQuest Logo"
            className="header-logo"
            style={{ cursor: "pointer" }}
            onClick={handleClick}
        />
    );
}

export default Logo;
