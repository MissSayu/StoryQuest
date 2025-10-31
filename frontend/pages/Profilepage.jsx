import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/profile.css";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import AvatarMenu from "../components/Avatar";
import ProfileSidebar from "../components/sidemenu.jsx";
import StatsCard from "../components/statscard.jsx";
import ContentSection from "../components/ContentSection";
import EditProfileForm from "../components/editprofile";
import api from "../../src/api";

export default function ProfilePage({ user: loggedInUser, logout, isMod }) {
    const { username } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);


    useEffect(() => {
        const fetchProfileUser = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/users/username/${username}`);
                setProfileUser(res.data);
            } catch (err) {
                console.error("Failed to fetch profile user:", err);
                setProfileUser(null);
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchProfileUser();
    }, [username]);

    const handleEditProfile = () => {
        if (!loggedInUser || loggedInUser.id !== profileUser?.id) return;
        setIsEditingProfile(true);
    };

    const handleCancelEdit = () => setIsEditingProfile(false);

    const handleSaveProfile = (updatedUser) => {
        setIsEditingProfile(false);
        setProfileUser(updatedUser);


        if (loggedInUser && updatedUser.id === loggedInUser.id) {
            loggedInUser.username = updatedUser.username;
            loggedInUser.bio = updatedUser.bio;
            loggedInUser.avatarUrl = updatedUser.avatarUrl;
            localStorage.setItem("username", updatedUser.username);
        }
    };

    const handleSearch = (query) => {
        console.log("Zoekterm:", query);
    };

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
                        <p style={{ marginLeft: "15px" }}>Gebruiker laden...</p>
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
                                user={loggedInUser}
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
                        <p style={{ marginLeft: "15px" }}>Gebruiker niet gevonden.</p>
                    )}
                </main>
            </div>
        </>
    );
}
