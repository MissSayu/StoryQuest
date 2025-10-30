import React, { useState, useEffect } from "react";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import AvatarMenu from "../components/Avatar";
import ProfileSidebar from "../components/sidemenu.jsx";
import Button from "../components/button.jsx";
import GenreDropdown from "../components/genredropdown.jsx";
import "../styles/publish.css";
import PickStoryDropdown from "../components/pickstorydropdown";

export default function PublishPage({ user: initialUser, logout, isMod }) {
    const [user, setUser] = useState(
        typeof initialUser === "object" ? initialUser : null
    );

    const [mode, setMode] = useState("newStory");
    const [type, setType] = useState("story");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [storyContent, setStoryContent] = useState("");
    const [newEpisodeContent, setNewEpisodeContent] = useState("");
    const [genre, setGenre] = useState("");
    const [cover, setCover] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [file, setFile] = useState(null);

    const [userStories, setUserStories] = useState([]);
    const [selectedStoryId, setSelectedStoryId] = useState("");


    useEffect(() => {
        if (user || !initialUser || typeof initialUser === "object") return;

        const fetchUserData = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8081/api/users/username/${initialUser}`
                );
                if (!res.ok) throw new Error(`User not found: ${res.status}`);
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        fetchUserData();
    }, [initialUser, user]);


    useEffect(() => {
        if (!user) return;
        const fetchStories = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8081/api/stories/user/${user.id}`
                );
                if (!res.ok) throw new Error("Failed to fetch stories");
                const data = await res.json();
                setUserStories(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStories();
    }, [user]);


    useEffect(() => {
        if (!cover) {
            setCoverPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(cover);
        setCoverPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [cover]);

    const handleCoverUpload = (e) => {
        if (e.target.files[0]) setCover(e.target.files[0]);
    };

    const handleFileUpload = (e) => {
        if (e.target.files[0]) setFile(e.target.files[0]);
    };

    const saveStory = async (status) => {
        if (!user) return alert("User data not loaded yet!");
        if (
            !title ||
            (type === "story" &&
                !storyContent &&
                mode === "newStory" &&
                status === "published") ||
            (type === "comic" && !file && status === "published")
        ) {
            return alert(
                status === "draft"
                    ? "Vul minimaal titel in voor draft!"
                    : "Vul alle verplichte velden in!"
            );
        }

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description || "");
            formData.append("genre", genre || "");
            formData.append("type", type);
            formData.append("userId", user.id);
            formData.append("status", status);

            // Story content
            if (mode === "newStory" && type === "story") {
                formData.append("storyContent", storyContent || "");
            }

            // New episode content
            if (mode === "newEpisode" && type === "story") {
                formData.append("storyId", selectedStoryId);
                formData.append("storyContent", newEpisodeContent || "");
            }

            // Cover image
            if (cover) formData.append("coverImage", cover);

            // Step 1️⃣: Create story/episode
            const response = await fetch("http://localhost:8081/api/stories/create", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to save story/episode");

            const savedStoryOrEpisode = await response.json();
            console.log(
                `${status === "draft" ? "Draft" : "Published"} saved:`,
                savedStoryOrEpisode
            );

            // Step 2️⃣: Upload comic file if it's a comic
            if (type === "comic" && file) {
                const comicForm = new FormData();
                comicForm.append("file", file); // must match backend's @RequestParam("file")

                // If you just created a new comic story, savedStoryOrEpisode.id should be episode ID
                const uploadRes = await fetch(
                    `http://localhost:8081/api/episodes/${savedStoryOrEpisode.id}/uploadComic`,
                    {
                        method: "POST",
                        body: comicForm,
                    }
                );

                if (!uploadRes.ok) throw new Error("Failed to upload comic file");
                console.log("Comic uploaded successfully!");
            }

            alert(
                status === "draft"
                    ? "Opgeslagen als draft!"
                    : "Verhaal/comic gepubliceerd!"
            );

            // Reset all fields
            setTitle("");
            setDescription("");
            setStoryContent("");
            setNewEpisodeContent("");
            setGenre("");
            setCover(null);
            setFile(null);
            setSelectedStoryId("");

        } catch (err) {
            console.error(err);
            alert("Er is iets misgegaan bij opslaan: " + err.message);
        }
    };


    const handlePublish = () => saveStory("published");
    const handleSaveDraft = () => saveStory("draft");

    if (!user) return <p>Loading user...</p>;

    return (
        <>
            <header className="header-user">
                <div className="header-left">
                    <Logo />
                </div>
                <div className="header-center">
                    <Navbar />
                </div>
                <div className="header-right">
                    <AvatarMenu user={user} logout={logout} isMod={isMod} />
                </div>
            </header>

            <div className="publish-page">
                <ProfileSidebar user={user} />

                <main className="publish-main">
                    <section className="publish-section">
                        <h2>
                            {mode === "newStory"
                                ? `Publiceer een nieuw ${
                                    type === "story" ? "verhaal" : "comic"
                                }`
                                : "Nieuw Hoofdstuk"}
                        </h2>


                        <div className="row type-selector">
                            <label>
                                <input
                                    type="radio"
                                    value="newStory"
                                    checked={mode === "newStory"}
                                    onChange={() => setMode("newStory")}
                                />{" "}
                                Nieuw verhaal
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="newEpisode"
                                    checked={mode === "newEpisode"}
                                    onChange={() => setMode("newEpisode")}
                                />{" "}
                                Nieuw hoofdstuk
                            </label>
                        </div>


                        <div className="row type-selector">
                            <label>
                                <input
                                    type="radio"
                                    value="story"
                                    checked={type === "story"}
                                    onChange={() => setType("story")}
                                />{" "}
                                Verhaal
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="comic"
                                    checked={type === "comic"}
                                    onChange={() => setType("comic")}
                                />{" "}
                                Comic
                            </label>
                        </div>

                        <div className="row title-genre">
                            <input
                                type="text"
                                placeholder="Titel"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <div className="dropdown-wrapper">
                                {mode === "newStory" ? (
                                    <GenreDropdown
                                        selectedGenre={genre}
                                        setSelectedGenre={setGenre}
                                        options={[
                                            "Fantasy",
                                            "Romance",
                                            "Sci-Fi",
                                            "Mystery",
                                            "Horror",
                                            "Western",
                                            "Adventure",
                                            "Crime",
                                            "Spy",
                                            "Thriller",
                                        ]}
                                    />
                                ) : (
                                    <PickStoryDropdown
                                        options={userStories}
                                        selectedStoryId={selectedStoryId}
                                        setSelectedStoryId={setSelectedStoryId}
                                    />
                                )}
                            </div>
                        </div>

                        {mode === "newStory" && (
                            <textarea
                                className="story-textarea description-textarea"
                                placeholder="Korte beschrijving..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        )}

                        {type === "story" &&
                            ((mode === "newStory" && (
                                    <textarea
                                        className="story-textarea content-textarea"
                                        placeholder="Schrijf hier het eerste hoofdstuk (episode 1)..."
                                        value={storyContent}
                                        onChange={(e) => setStoryContent(e.target.value)}
                                    />
                                )) ||
                                (mode === "newEpisode" && (
                                    <textarea
                                        className="story-textarea content-textarea"
                                        placeholder="Schrijf hier het nieuwe hoofdstuk..."
                                        value={newEpisodeContent}
                                        onChange={(e) =>
                                            setNewEpisodeContent(e.target.value)
                                        }
                                    />
                                )))}

                        <div className="story-actions-column">
                            {type === "comic" && (
                                <div className="comic-upload">
                                    <input
                                        id="comicUpload"
                                        type="file"
                                        accept=".pdf,.cbz,.cbr,.png,.jpg"
                                        onChange={handleFileUpload}
                                    />
                                    <Button
                                        asLabel
                                        htmlFor="comicUpload"
                                        className="cover-button"
                                    >
                                        Upload Comic File
                                    </Button>
                                    {file && <span className="file-name">{file.name}</span>}
                                </div>
                            )}

                            <input
                                id="coverUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                            />
                            <Button asLabel htmlFor="coverUpload" className="cover-button">
                                Upload Cover
                            </Button>
                            {coverPreview && (
                                <img
                                    src={coverPreview}
                                    alt="Cover preview"
                                    className="cover-preview-large"
                                />
                            )}

                            <Button onClick={handlePublish} className="publish-button">
                                Publiceren
                            </Button>
                            <Button onClick={handleSaveDraft} className="publish-button">
                                Opslaan als draft
                            </Button>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
