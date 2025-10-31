import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/readpage.css";
import Logo from "../components/Logo";
import AvatarMenu from "../components/Avatar";
import Navbar from "../components/Navbar";
import Button from "../components/button.jsx";
import ProfileSidebar from "../components/sidemenu.jsx";
import CommentSection from "../components/CommentSection";
import api from "../../src/api"; // axios instance met JWT

function ReadPage({ user, logout, isMod }) {
    const { storyId } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [isFollowingStory, setIsFollowingStory] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!storyId) return;

        const fetchStory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/stories/${storyId}`);
                const data = res.data;
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
                setError(err.response?.status === 403 ? "Toegang geweigerd" : "Verhaal niet gevonden");
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [storyId]);

    useEffect(() => {
        if (story && selectedEpisode) {
            document.title = `${story.title} — ${selectedEpisode.title} | Tales of Eyrndor`;
        }
    }, [selectedEpisode, story]);

    useEffect(() => {
        if (!user || !storyId) return;

        const fetchFollowState = async () => {
            try {
                const res = await api.get(`/follow/check?followerId=${user.id}&followedStoryId=${storyId}`);
                setIsFollowingStory(res.data);
            } catch (err) {
                console.error("Failed to check story follow state:", err);
            }
        };

        fetchFollowState();
    }, [user, storyId]);

    const toggleFollowStory = async () => {
        if (!user) return;
        try {
            const url = `/follow/${user.id}/${isFollowingStory ? "unfollow" : "follow"}/${storyId}`;
            await api.post(url);
            setIsFollowingStory(!isFollowingStory);
        } catch (err) {
            console.error("Error toggling story follow:", err);
        }
    };

    const handleLogout = () => {
        if (logout) logout();
        navigate("/", { replace: true });
    };

    if (loading) return <p style={{ margin: "15px" }}>Laden...</p>;
    if (error) return <p style={{ margin: "15px", color: "red" }}>{error}</p>;

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

    sidebarEpisodes = sidebarEpisodes.sort(
        (a, b) => (a.episodeOrder ?? 999) - (b.episodeOrder ?? 999)
    );

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
