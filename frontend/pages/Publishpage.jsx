import React, { useState } from "react";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import AvatarMenu from "../components/Avatar";
import ProfileSidebar from "../components/sidemenu.jsx";
import Button from "../components/button.jsx";
import GenreDropdown from "../components/genredropdown.jsx";
import "../styles/publish.css";

export default function PublishPage({ user, logout, isMod }) {
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [cover, setCover] = useState(null);
    const [file, setFile] = useState(null);
    const [type, setType] = useState("story"); // 'story' or 'comic'
    const [storyContent, setStoryContent] = useState("");

    const handleCoverUpload = (e) => {
        if (e.target.files[0]) setCover(e.target.files[0]);
    };

    const handleFileUpload = (e) => {
        if (e.target.files[0]) setFile(e.target.files[0]);
    };

    const handlePublish = async () => {
        if (!title || !genre || (type === "story" && !storyContent) || (type === "comic" && !file)) {
            alert("Vul alle verplichte velden in!");
            return;
        }

        try {
            // Build the story data
            const storyData = {
                title,
                description: storyContent || "", // description for story or comic
                type, // 'story' or 'comic'
            };

            // Send POST request
            const response = await fetch(`http://localhost:8081/api/stories?userId=${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(storyData),
            });

            if (!response.ok) throw new Error("Failed to publish story");

            const createdStory = await response.json();
            console.log("Published story:", createdStory);

            alert("Je verhaal/comic is gepubliceerd!");

            // Reset form
            setTitle("");
            setGenre("");
            setCover(null);
            setFile(null);
            setStoryContent("");
        } catch (err) {
            console.error(err);
            alert("Er is iets misgegaan bij het publiceren!");
        }
    };

    return (
        <>
            <header className="header-user">
                <div className="header-left"><Logo /></div>
                <div className="header-center"><Navbar /></div>
                <div className="header-right">
                    <AvatarMenu user={user} logout={logout} isMod={isMod} />
                </div>
            </header>

            <div className="publish-page">
                <ProfileSidebar user={user} />

                <main className="publish-main">
                    <section className="publish-section">
                        <h2>Publiceer een nieuw {type === "story" ? "verhaal" : "comic"}</h2>

                        {/* Type selector */}
                        <div className="row type-selector">
                            <label>
                                <input
                                    type="radio"
                                    value="story"
                                    checked={type === "story"}
                                    onChange={() => setType("story")}
                                /> Verhaal
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="comic"
                                    checked={type === "comic"}
                                    onChange={() => setType("comic")}
                                /> Comic
                            </label>
                        </div>

                        {/* Title + Genre */}
                        <div className="row title-genre">
                            <input
                                type="text"
                                placeholder="Titel"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div className="genre-dropdown-wrapper">
                                <GenreDropdown
                                    selectedGenre={genre}
                                    setSelectedGenre={setGenre}
                                    options={["Fantasy", "Romance", "Sci-Fi", "Mystery", "Horror"]}
                                />
                            </div>
                        </div>

                        {/* Story Section */}
                        {type === "story" && (
                            <div className="story-row">
                                <div className="story-input">
                                    <textarea
                                        placeholder="Schrijf hier je verhaal..."
                                        value={storyContent}
                                        onChange={(e) => setStoryContent(e.target.value)}
                                    />
                                </div>

                                <div className="story-actions">
                                    <input
                                        id="coverUploadStory"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleCoverUpload}
                                    />
                                    <Button asLabel htmlFor="coverUploadStory" className="cover-button">
                                        Upload Cover
                                    </Button>
                                    {cover && (
                                        <img
                                            src={URL.createObjectURL(cover)}
                                            alt="Cover preview"
                                            className="cover-preview-large"
                                        />
                                    )}

                                    <Button onClick={handlePublish} className="publish-button">
                                        Publish
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Comic Section */}
                        {type === "comic" && (
                            <div className="story-row">
                                <div className="action-column">
                                    <input
                                        id="comicUpload"
                                        type="file"
                                        accept=".pdf,.cbz,.cbr, .png, .jpg"
                                        style={{ display: "none" }}
                                        onChange={handleFileUpload}
                                    />
                                    <Button asLabel htmlFor="comicUpload" className="cover-button">
                                        Upload Comic
                                    </Button>
                                    {file && <span>{file.name}</span>}
                                </div>

                                <div className="action-column">
                                    <input
                                        id="coverUploadComic"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleCoverUpload}
                                    />
                                    <Button asLabel htmlFor="coverUploadComic" className="cover-button">
                                        Upload Cover
                                    </Button>
                                    {cover && (
                                        <img
                                            src={URL.createObjectURL(cover)}
                                            alt="Cover preview"
                                            className="cover-preview-large"
                                        />
                                    )}

                                    <Button onClick={handlePublish} className="publish-button">
                                        Publish
                                    </Button>
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
}
