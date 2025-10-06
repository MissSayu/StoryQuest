import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/homepage-guest.css";
import Logo from "../components/Logo";
import Button from "../components/button.jsx";
import book1 from "../assets/book-cover-placeholder.png";
import book2 from "../assets/book-cover-placeholder.png";
import book3 from "../assets/book-cover-placeholder.png";

function HomepageGuest({ user }) {
    const navigate = useNavigate();

    return (
        <div className="fullscreen-bg">
            <div className="homepage">
                <header>
                    <Logo user={user} />

                    <div className="header-buttons">
                        <Button
                            className="header-button"
                            onClick={() => navigate("/login")}
                        >
                            Log in
                        </Button>

                        <Button
                            className="header-button"
                            onClick={() => navigate("/register")}
                        >
                            Registreren
                        </Button>
                    </div>
                </header>

                <main>
                    <section className="intro">
                        <div className="intro-content">
                            <div className="intro-text">
                                <h1>Start je avontuur in de wereld van verhalen en webcomics.</h1>
                                <p>
                                    Bij StoryQuest kan jij jouw creatieve universum bouwen en delen met de wereld.
                                </p>
                                <Button
                                    className="cta-btn"
                                    onClick={() => navigate("/login")}
                                >
                                    Begin nu met schrijven
                                </Button>
                            </div>

                            <div className="intro-books">
                                <h2>Populaire verhalen</h2>
                                <div className="book-list">
                                    <img src={book1} alt="Boek 1" className="book" />
                                    <img src={book2} alt="Boek 2" className="book" />
                                    <img src={book3} alt="Boek 3" className="book" />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default HomepageGuest;
