import React, { useState, useEffect } from "react";
import storiesIcon from "../assets/stories-icon.png";
import followersIcon from "../assets/follower-icon.png";
import followingIcon from "../assets/heart-icon.png";
import "./statscard.css";

function StatsCard({ type, userId }) {
    const [value, setValue] = useState(0);

    // Map type to label, icon, and API path
    const typeMap = {
        stories: { label: " Verhalen", icon: storiesIcon, path: `/api/stories/count/${userId}` },
        followers: { label: " Volgers", icon: followersIcon, path: `/api/follow/followers/count/${userId}` },
        following: { label: " Volgend", icon: followingIcon, path: `/api/follow/following/count/${userId}` },
    };

    const { label, icon, path } = typeMap[type] || {};
    if (!label || !userId) return null;

    useEffect(() => {
        const fetchValue = async () => {
            try {
                const res = await fetch(`http://localhost:8081${path}`);
                if (!res.ok) throw new Error("Failed to fetch count");

                const data = await res.json();
                // If backend returns a plain number, not {count: number}
                setValue(typeof data === "number" ? data : data.count || 0);
            } catch (err) {
                console.error(`Failed to fetch ${type}:`, err);
            }
        };

        fetchValue();
    }, [type, userId, path]);

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
