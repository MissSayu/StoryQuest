import React, { useState, useEffect } from "react";
import storiesIcon from "../assets/stories-icon.png";
import followersIcon from "../assets/follower-icon.png";
import followingIcon from "../assets/heart-icon.png";
import api from "../../src/api";
import "./statscard.css";

function StatsCard({ type, userId, username, loggedInUser }) {
    const [value, setValue] = useState(0);


    const typeMap = {
        stories: { label: " Verhalen", icon: storiesIcon },
        followers: { label: " Volgers", icon: followersIcon, path: `/follow/followers/count/${userId}` },
        following: { label: " Volgend", icon: followingIcon, path: `/follow/following/count/${userId}` },
    };

    const { label, icon, path } = typeMap[type] || {};
    if (!label || (!userId && type !== "stories") || (!username && type === "stories")) return null;

    useEffect(() => {
        const fetchValue = async () => {
            try {
                if (type === "stories") {

                    const endpoint = `/stories/username/${username}`;
                    const res = await api.get(endpoint);
                    const data = res.data;

                    const isOwnProfile = loggedInUser?.username === username;
                    const publishedCount = data.filter(story => story.status?.toLowerCase() === "published").length;

                    setValue(isOwnProfile ? data.length : publishedCount);
                } else {

                    const res = await api.get(path);
                    setValue(typeof res.data === "number" ? res.data : res.data.count || 0);
                }
            } catch (err) {
                console.error(`Failed to fetch ${type}:`, err);
                setValue(0);
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
