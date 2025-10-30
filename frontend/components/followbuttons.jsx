import React, { useState, useEffect } from "react";
import Button from "./button.jsx";

export default function FollowButtons({ userId, authorId, storyId }) {
    const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
    const [isFollowingStory, setIsFollowingStory] = useState(false);


    useEffect(() => {
        if (!userId || (!authorId && !storyId)) return;

        async function fetchFollowStates() {
            try {
                const requests = [];

                if (authorId)
                    requests.push(
                        fetch(`http://localhost:8081/api/follow/check?followerId=${userId}&followedId=${authorId}`)
                            .then((res) => (res.ok ? res.json() : false))
                            .then(setIsFollowingAuthor)
                    );

                if (storyId)
                    requests.push(
                        fetch(`http://localhost:8081/api/follow/check?followerId=${userId}&followedStoryId=${storyId}`)
                            .then((res) => (res.ok ? res.json() : false))
                            .then(setIsFollowingStory)
                    );

                await Promise.all(requests);
            } catch (err) {
                console.error("Failed to fetch follow states:", err);
            }
        }

        fetchFollowStates();
    }, [userId, authorId, storyId]);

    const handleToggle = async (type) => {
        try {
            const isFollowing = type === "author" ? isFollowingAuthor : isFollowingStory;
            const idParam = type === "author" ? `followedId=${authorId}` : `followedStoryId=${storyId}`;
            const url = `http://localhost:8081/api/follow/${isFollowing ? "unfollow" : "follow"}?followerId=${userId}&${idParam}`;

            const res = await fetch(url, { method: "POST" });
            if (res.ok) {
                if (type === "author") setIsFollowingAuthor(!isFollowingAuthor);
                else setIsFollowingStory(!isFollowingStory);
            } else {
                console.error(`Failed to toggle ${type} follow`);
            }
        } catch (err) {
            console.error(`Error toggling ${type} follow:`, err);
        }
    };

    return (
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {authorId && (
                <Button onClick={() => handleToggle("author")}>
                    {isFollowingAuthor ? "Ontvolg auteur" : "Volg auteur"}
                </Button>
            )}
            {storyId && (
                <Button onClick={() => handleToggle("story")}>
                    {isFollowingStory ? "Ontvolg verhaal" : "Volg verhaal"}
                </Button>
            )}
        </div>
    );
}
