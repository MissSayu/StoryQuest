import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/readpage.css";
import Logo from "../components/Logo";
import AvatarMenu from "../components/Avatar";
import Navbar from "../components/Navbar";
import Button from "../components/button.jsx";
import ProfileSidebar from "../components/sidemenu.jsx";
import CommentSection from "../components/CommentSection";

function ReadPage({ user, logout, isMod }) {
    const { storyId } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [isFollowingStory, setIsFollowingStory] = useState(false);

    // 🟣 Load story
    useEffect(() => {
        if (!storyId) return;

        async function fetchStory() {
            try {
                const res = await fetch(`http://localhost:8081/api/stories/${storyId}`);
                if (!res.ok) throw new Error("Story not found");
                const data = await res.json();
                setStory(data);

                document.title = `${data.title} - Tales of Eyrndor`;

                setSelectedEpisode({
                    id: 0,
                    title: "Description",
                    content: data.description || "",
                    coverUrl: data.coverImage || "/uploads/covers/book-cover-placeholder.png",
                });
            } catch (err) {
                console.error("Failed to fetch story:", err);
            }
        }

        fetchStory();
    }, [storyId]);

    // 🟣 Update browser tab title dynamically
    useEffect(() => {
        if (story && selectedEpisode) {
            document.title = `${story.title} — ${selectedEpisode.title} | Tales of Eyrndor`;
        }
    }, [selectedEpisode, story]);

    // 🟣 Check if user is following this story
    useEffect(() => {
        async function fetchFollowState() {
            if (!user || !storyId) return;
            try {
                const res = await fetch(
                    `http://localhost:8081/api/follow/check?followerId=${user.id}&followedStoryId=${storyId}`
                );
                if (res.ok) {
                    const followed = await res.json();
                    setIsFollowingStory(followed);
                }
            } catch (err) {
                console.error("Failed to check story follow state:", err);
            }
        }
        fetchFollowState();
    }, [user, storyId]);

    // 🟣 Follow/unfollow story
    const toggleFollowStory = async () => {
        if (!user) return;
        try {
            const url = `http://localhost:8081/api/follow/${user.id}/${isFollowingStory ? "unfollow" : "follow"}/${storyId}`;
            const res = await fetch(url, { method: "POST" });
            if (res.ok) setIsFollowingStory(!isFollowingStory);
        } catch (err) {
            console.error("Error toggling story follow:", err);
        }
    };

    // 🟣 Handle logout
    const handleLogout = () => {
        if (logout) logout();
        navigate("/", { replace: true });
    };

    if (!story) return <p>Loading story...</p>;

    // 🟣 Always ensure Description is first in the list
    const hasDescriptionEpisode = story.episodes?.some(
        (ep) => ep.episodeOrder === 0 || ep.title.toLowerCase() === "description"
    );

    let sidebarEpisodes = hasDescriptionEpisode
        ? [...story.episodes]
        : [
            {
                id: 0,
                title: "Description",
                content: story.description || "",
                coverUrl: story.coverImage || "/uploads/covers/book-cover-placeholder.png",
                episodeOrder: 0,
            },
            ...(story.episodes || []),
        ];

    // ✅ Always sort episodes by order so Description stays on top
    sidebarEpisodes = sidebarEpisodes.sort(
        (a, b) => (a.episodeOrder ?? 999) - (b.episodeOrder ?? 999)
    );

    // 🟣 Safe cover URL handling
    const coverSrc = selectedEpisode?.coverUrl
        ? selectedEpisode.coverUrl.startsWith("http")
            ? selectedEpisode.coverUrl
            : `http://localhost:8081${selectedEpisode.coverUrl}`
        : story.coverImage
            ? story.coverImage.startsWith("http")
                ? story.coverImage
                : `http://localhost:8081${story.coverImage}`
            : "http://localhost:8081/uploads/covers/book-cover-placeholder.png";

    return (
        <div className="readpage">
            <header className="header-user">
                <Logo user={user} />
                <Navbar />
                <AvatarMenu user={user} logout={handleLogout} isMod={isMod} />
            </header>

            <main className="readpage-main">
                <ProfileSidebar
                    user={user}
                    author={story.author}
                    episodes={sidebarEpisodes}
                    onSelectEpisode={(ep) => setSelectedEpisode(ep)}
                    selectedEpisode={selectedEpisode}
                />

                <section className="story-content">
                    <div className="story-header">
                        <img
                            src={coverSrc}
                            alt={selectedEpisode?.title || story.title}
                            className="story-cover"
                        />

                        <h2>{story.title}</h2>

                        {selectedEpisode?.title === "Description" && (
                            <>
                                <p className="story-description">{story.description}</p>
                                {user && (
                                    <Button onClick={toggleFollowStory}>
                                        {isFollowingStory ? "Ontvolg verhaal" : "Volg verhaal"}
                                    </Button>
                                )}
                            </>
                        )}
                    </div>

                    {user && selectedEpisode && selectedEpisode.title !== "Description" && (
                        <div className="story-body">
                            <div className="episode-wrapper">
                                <div className="episode-content">
                                    <h3>{selectedEpisode.title}</h3>
                                    <p>{selectedEpisode.content}</p>
                                </div>
                                <CommentSection episodeId={selectedEpisode.id} user={user} />
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default ReadPage;
