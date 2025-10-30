import React, { useState, useEffect } from "react";
import Button from "./button.jsx";
import "./commentsection.css";

export default function CommentSection({ episodeId, user }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const fetchComments = async () => {
        if (!episodeId) return;
        try {
            const res = await fetch(`http://localhost:8081/api/episodes/${episodeId}/comments`);
            if (!res.ok) throw new Error("Failed to fetch comments");
            const data = await res.json();
            setComments(data);
        } catch (err) {
            console.error("Error loading comments:", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [episodeId]);

    const postComment = async () => {
        if (!newComment.trim() || !user) return;
        try {
            const res = await fetch(
                `http://localhost:8081/api/episodes/${episodeId}/comments/add?userId=${user.id}&textContent=${encodeURIComponent(newComment)}`,
                { method: "POST" }
            );
            if (!res.ok) throw new Error("Failed to post comment");
            setNewComment("");
            fetchComments();
        } catch (err) {
            console.error("Error posting comment:", err);
        }
    };

    const deleteComment = async (commentId) => {
        if (!user) return;
        try {
            const res = await fetch(
                `http://localhost:8081/api/episodes/comments/${commentId}?userId=${user.id}`,
                { method: "DELETE" }
            );
            if (!res.ok) throw new Error("Failed to delete comment");
            fetchComments();
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };

    return (
        <div className="comment-section">
            <h4>Reacties</h4>
            <div className="comments-list">
                {comments.length === 0 ? (
                    <p>Geen reacties</p>
                ) : (
                    comments.map((c) => {
                        const canDelete = user && (user.id === c.userId || user.role === "MOD");

                        return (
                            <div key={c.id} className="comment-card">
                                <div className="comment-header">
                                    <img
                                        src={c.avatarUrl || "/placeholders/avatar-placeholder.png"}
                                        alt={c.username || "Onbekend"}
                                        className="comment-avatar"
                                    />
                                    <div className="comment-user-info">
                                        <strong>{c.username || "Onbekend"}</strong>
                                        <span className="comment-date">
                                            {new Date(c.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {canDelete && (
                                        <Button
                                            className="delete-comment-btn"
                                            onClick={() => deleteComment(c.id)}
                                        >
                                            Verwijder reactie
                                        </Button>
                                    )}
                                </div>
                                <p className="comment-content">{c.textContent}</p>
                            </div>
                        );
                    })
                )}
            </div>

            {user && (
                <div className="comment-input">
                    <textarea
                        placeholder="Schrijf een reactie..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={postComment}>Plaats reactie</Button>
                </div>
            )}
        </div>
    );
}
