import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/modpage.css";
import SearchBar from "../components/SearchBar";
import Logo from "../components/Logo";
import AvatarMenu from "../components/avatar.jsx";

function ModPage({ user, logout }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const [reports, setReports] = useState([
        { title: "The Forgotten Realm", author: "Writer123", tag: "Fantasy", reason: "Spam", status: "Goedgekeurd" },
        { title: "Lost in the City", author: "Luna_vt", tag: "Comic", reason: "Plagiaat", status: "Afgekeurd" },
        { title: "An unexpected meeting", author: "StoryTeller", tag: "Romance", reason: "Ongepaste taal", status: "Goedgekeurd" },
        { title: "Dark Secrets", author: "Virelight", tag: "Mystery", reason: "Geweldige inhoud", status: "In behandeling" },
        { title: "A journey beyond", author: "BunnKits", tag: "Romance, Novel", reason: "Nudity", status: "In behandeling" },
        { title: "Lies and secrets", author: "CreativeMind", tag: "Comic, Fantasy", reason: "Spam", status: "In behandeling" },
    ]);

    function handleApprove(index) {
        const updated = [...reports];
        updated[index].status = "Goedgekeurd";
        setReports(updated);
    }

    function handleReject(index) {
        const updated = [...reports];
        updated[index].status = "Afgekeurd";
        setReports(updated);
    }

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <div className="modpage">
            <header className="header">
                <Logo/>

                <div className="search-bar-container">
                    <SearchBar placeholder="Zoeken..." onSearch={(query) => console.log(query)}/>
                </div>
                <AvatarMenu user={user} isMod={true} logout={logout}/>
            </header>

            <div className="container">
                <aside className="sidebar">
                    <h2>Dashboard</h2>
                    <ul>
                        <li>Meldingen</li>
                        <li>Reacties</li>
                        <li>Gebruikers</li>
                        <li>Verhalenbeheer</li>
                        <li>Tools en statistieken</li>
                        <li>Teamnotities</li>
                    </ul>
                </aside>

                <main className="main">
                    <h2>Gerapporteerde verhalen</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Titel</th>
                            <th>Auteur</th>
                            <th>Tag</th>
                            <th>Reden</th>
                            <th>Status</th>
                            <th>Actie</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reports.map((r, i) => (
                            <tr key={i}>
                                <td>{r.title}</td>
                                <td>{r.author}</td>
                                <td>{r.tag}</td>
                                <td>{r.reason}</td>
                                <td>{r.status}</td>
                                <td>
                                    <button className="approve" onClick={() => handleApprove(i)}>
                                        Goedkeuren
                                    </button>
                                    <button className="reject" onClick={() => handleReject(i)}>
                                        Afkeuren
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    );
}

export default ModPage;
