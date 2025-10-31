import React, { useState, useEffect } from "react";
import Button from "./button.jsx";
import "./commentsection.css";
import api from "../../src/api"; // jouw axios instance met JWT

export default function CommentSection({ episodeId, user }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        if (!episodeId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/episodes/${episodeId}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error("Error loading comments:", err);
            setError("Kan reacties niet laden");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [episodeId]);

    const postComment = async () => {
        if (!newComment.trim() || !user) return;
        try {
            await api.post(`/episodes/${episodeId}/comments/add`, {
                userId: user.id,
                textContent: newComment,
            });
            setNewComment("");
            fetchComments();
        } catch (err) {
            console.error("Error posting comment:", err);
            setError("Kan reactie niet plaatsen");
        }
    };

    const deleteComment = async (commentId) => {
        if (!user) return;
        try {
            await api.delete(`/episodes/comments/${commentId}`, {
                data: { userId: user.id },
            });
            fetchComments();
        } catch (err) {
            console.error("Error deleting comment:", err);
            setError("Kan reactie niet verwijderen");
        }
    };

    if (loading) return <p>Laden reacties...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

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
