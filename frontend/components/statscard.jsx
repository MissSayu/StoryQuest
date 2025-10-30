import React, { useState, useEffect } from "react";
import storiesIcon from "../assets/stories-icon.png";
import followersIcon from "../assets/follower-icon.png";
import followingIcon from "../assets/heart-icon.png";
import "./statscard.css";

function StatsCard({ type, userId, username, loggedInUser }) {
    const [value, setValue] = useState(0);

    const typeMap = {
        stories: { label: " Verhalen", icon: storiesIcon },
        followers: { label: " Volgers", icon: followersIcon, path: `/api/follow/followers/count/${userId}` },
        following: { label: " Volgend", icon: followingIcon, path: `/api/follow/following/count/${userId}` },
    };

    const { label, icon, path } = typeMap[type] || {};
    if (!label || (!userId && type !== "stories") || (!username && type === "stories")) return null;

    useEffect(() => {
        const fetchValue = async () => {
            try {
                if (type === "stories") {
                    const res = await fetch(`http://localhost:8081/api/stories/username/${username}`);
                    if (!res.ok) throw new Error("Failed to fetch stories");
                    const data = await res.json();

                    const isOwnProfile = loggedInUser?.username === username;
                    const publishedCount = data.filter(story => story.status?.toLowerCase() === "published").length;

                    setValue(isOwnProfile ? data.length : publishedCount);
                } else {
                    const res = await fetch(`http://localhost:8081${path}`);
                    if (!res.ok) throw new Error("Failed to fetch count");
                    const data = await res.json();
                    setValue(typeof data === "number" ? data : data.count || 0);
                }
            } catch (err) {
                console.error(`Failed to fetch ${type}:`, err);
            }
        };
        fetchValue();
    }, [type, userId, username, loggedInUser, path]);

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
