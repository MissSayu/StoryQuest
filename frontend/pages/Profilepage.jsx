import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/profile.css";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import AvatarMenu from "../components/Avatar";
import ProfileSidebar from "../components/sidemenu.jsx";
import StatsCard from "../components/statscard.jsx";
import ContentSection from "../components/ContentSection";
import EditProfileForm from "../components/editprofile";


export default function ProfilePage({ user: loggedInUser, logout, isMod }) {
    const { username } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    useEffect(() => {
        const fetchProfileUser = async () => {
            setLoading(true);
            try {

                const res = await fetch(`http://localhost:8081/api/users/username/${username}`);
                if (!res.ok) throw new Error("User not found");
                const data = await res.json();
                setProfileUser(data);
            } catch (err) {
                console.error("Failed to fetch profile user:", err);
                setProfileUser(null);
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchProfileUser();
    }, [username]);

    function handleSearch(query) {
        console.log("Zoekterm:", query);
    }

    function handleEditProfile() {

        if (!loggedInUser || loggedInUser.id !== profileUser?.id) {
            return;
        }
        setIsEditingProfile(true);
    }

    function handleCancelEdit() {
        setIsEditingProfile(false);
    }


    function handleSaveProfile(updatedUser) {
        setIsEditingProfile(false);


        setProfileUser(updatedUser);

        if (loggedInUser && updatedUser.id === loggedInUser.id) {

            loggedInUser.username = updatedUser.username;
            loggedInUser.bio = updatedUser.bio;
            loggedInUser.avatarUrl = updatedUser.avatarUrl;

            localStorage.setItem("username", updatedUser.username);
        }
    }

    return (
        <>
            <header className="header-user">
                <div className="header-left"><Logo /></div>
                <div className="header-center"><Navbar onSearch={handleSearch} /></div>
                <div className="header-right">
                    <AvatarMenu user={loggedInUser || null} logout={logout} isMod={isMod} />
                </div>
            </header>

            <div className="profile-page">

                <ProfileSidebar
                    user={loggedInUser || null}
                    author={profileUser || null}
                    onEditProfile={handleEditProfile}
                />

                <main className="profile-main">
                    {isEditingProfile ? (
                        <EditProfileForm
                            user={loggedInUser}
                            onCancel={handleCancelEdit}
                            onSave={handleSaveProfile}
                        />
                    ) : loading ? (
                        <p style={{marginLeft: "15px"}}>Gebruiker laden...</p>
                    ) : profileUser ? (
                        <>
                            <div className="profile-stats">
                                <StatsCard
                                    type="stories"
                                    username={profileUser.username}
                                    loggedInUser={loggedInUser}
                                />
                                <StatsCard
                                    type="followers"
                                    userId={profileUser.id}
                                />
                                <StatsCard
                                    type="following"
                                    userId={profileUser.id}
                                />
                            </div>

                            <ContentSection
                                title="Verhalen"
                                username={profileUser.username}
                                type="story"
                                onSearch={handleSearch}
                                user={loggedInUser} // needed for drafts
                            />
                            <ContentSection
                                title="Comics"
                                username={profileUser.username}
                                type="comic"
                                onSearch={handleSearch}
                                user={loggedInUser}
                            />
                        </>
                    ) : (
                        <p style={{marginLeft: "15px"}}>Gebruiker niet gevonden.</p>
                    )}
                </main>

            </div>
        </>
    );
}
