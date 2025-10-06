import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";
import Logo from "../components/Logo";
import AvatarMenu from "../components/Avatar";
import Navbar from "../components/Navbar.jsx";
import book1 from "../assets/book-cover-placeholder.png";
import book2 from "../assets/book-cover-placeholder.png";
import book3 from "../assets/book-cover-placeholder.png";

function HomepageUser({ user, logout, isMod = true }) {
    const navigate = useNavigate();

    function handleSearch(query) {
        console.log("Zoekterm:", query);
    }

    const recommendedBooks = [
        { title: "Mystic Adventures", cover: book1 },
        { title: "Romance in the City", cover: book2 },
        { title: "Fantasy Tales", cover: book3 }
    ];

    return (
        <div className="homepage">
            <header className="header-user">
                <Logo user={user} />

                <Navbar onSearch={handleSearch} />

                <AvatarMenu user={user} logout={logout} isMod={isMod} />
            </header>

            <main>
                <section className="welcome-section">
                    <h1>Welkom terug, {user}!</h1>
                    <p>Hier zijn enkele verhalen die we voor jou aanraden:</p>

                    <div className="recommended-books">
                        {recommendedBooks.map((book, index) => (
                            <div key={index} className="book-card">
                                <img src={book.cover} alt={book.title} className="book-cover" />
                                <p>{book.title}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default HomepageUser;
