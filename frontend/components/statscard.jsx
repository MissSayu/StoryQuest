import React from "react";
import storiesIcon from "../assets/stories-icon.png";
import followersIcon from "../assets/follower-icon.png";
import followingIcon from "../assets/heart-icon.png";
import "./statscard.css";

function StatsCard({ type, value }) {

    const typeMap = {
        stories: { label: "Verhalen", icon: storiesIcon },
        followers: { label: "Volgers", icon: followersIcon },
        following: { label: "Volgend", icon: followingIcon },
    };

    const { label, icon } = typeMap[type] || {};

    if (!label) return null;

    return (
        <div className="stat-card">
            {icon && <img src={icon} alt={label} className="stat-icon" />}
            <div className="stat-info">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
            </div>
        </div>
    );
}

export default StatsCard;
