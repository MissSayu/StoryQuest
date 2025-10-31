import React, { useState } from "react";
import Button from "./button.jsx";
import "./editprofile.css";
import avatarPlaceholder from "../assets/avatar-placeholder.png";

export default function EditProfileForm({ user, onSave, onCancel }) {
    const [username, setUsername] = useState(user.username || "");
    const [bio, setBio] = useState(user.bio || "");
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState(
        user.avatarUrl
            ? user.avatarUrl.startsWith("http")
                ? user.avatarUrl
                : `http://localhost:8081${user.avatarUrl}`
            : avatarPlaceholder
    );
    const [saving, setSaving] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let avatarUrl = user.avatarUrl || "/avatars/default.jpg";

            if (avatarFile) {
                const formData = new FormData();
                formData.append("file", avatarFile);

                const token = localStorage.getItem("token");
                const uploadRes = await fetch(
                    `http://localhost:8081/api/upload/avatar/${user.id}`,
                    {
                        method: "POST",
                        body: formData,
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }
                );

                if (!uploadRes.ok) {
                    const errText = await uploadRes.text();
                    console.error("Avatar upload failed:", errText);
                    throw new Error("Avatar upload failed");
                }

                const data = await uploadRes.json();
                avatarUrl = data.avatarUrl ? `http://localhost:8081${data.avatarUrl}` : avatarPlaceholder;
            }


            const token = localStorage.getItem("token");
            const updateRes = await fetch(
                `http://localhost:8081/api/users/${user.id}/update`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify({ username, bio, avatarUrl }),
                }
            );

            if (!updateRes.ok) {
                const errText = await updateRes.text();
                console.error("Profile update failed:", errText);
                throw new Error("Could not update profile");
            }

            const updatedUser = await updateRes.json();
            onSave(updatedUser);
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Something went wrong while saving.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="edit-profile-form">
            <h3>Edit Profile</h3>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="avatar-upload">
                    <img
                        src={preview || avatarPlaceholder}
                        alt="Preview"
                        className="avatar-preview"
                        onError={(e) => (e.target.src = avatarPlaceholder)}
                    />
                    <label className="upload-label">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: "none" }}
                        />
                        <span className="upload-button">📷 Choose New Avatar</span>
                    </label>
                </div>

                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Bio:
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows="3"
                    />
                </label>

                <div className="form-buttons">
                    <Button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
