import React, { useState, useEffect } from "react";
import "./post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import { Button } from "@material-ui/core";
import firebase from "firebase";

export default function Post(props) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if (props.postId) {
            unsubscribe = db
                .collection("posts")
                .doc(props.postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () => {
            unsubscribe();
        };
    }, [props.postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(props.postId).collection("comments").add({
            text: comment,
            username: props.user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment("");
    };

    return (
        <div className="post">
            {/* header -> avatar + username */}
            <div className="post__haeder">
                <Avatar className="post__avatar" src="/static/images/avatar/1.jpg" alt="_8sher" />
                <h3>{props.username}</h3>
            </div>

            {/* image */}
            <img className="post__image" src={props.imgUrl} alt="" />

            {/* username + caption */}
            <h4 className="post__text">
                <strong>{props.username}</strong> {props.caption}
            </h4>

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong>
                        {comment.text}
                    </p>
                ))}
            </div>

            {props.user && (
                <form className="post__commentBox">
                    <input type="text" className="post__input" placeholder="Add a comment..." onChange={(event) => setComment(event.target.value)} value={comment} />
                    <Button className="post__button" onClick={postComment}>
                        Post
                    </Button>
                </form>
            )}
        </div>
    );
}
