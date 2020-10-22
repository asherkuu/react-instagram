import React, { useState, useEffect } from "react";
import "./App.css";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import InstagramEmbed from "react-instagram-embed";

import Post from "./Post.js";
import ImageUpload from "./ImageUpload.js";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function App() {
    /*
        stats 영역
    */
    // posts
    const [posts, setPosts] = useState([]);
    // modol
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);

    // signUp
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // logged in and out
    const [user, setUser] = useState(null);

    /*
        function 영역
    */

    // useEffect is run code on a condition >> 실시간 실생
    // ex) run code everytiem a comment happens
    // 로그인 엑션
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                // user has logged in...
                setUser(authUser);

                if (authUser.displayName) {
                    // dont update username
                } else {
                    // if we just created someone
                    return authUser.updateProfile({
                        displayName: username,
                    });
                }
            } else {
                // user has logged out...
                setUser(null);
            }
        });

        return () => {
            // perform some cleanup actions
            unsubscribe();
        };
    }, [user, username]);

    useEffect(() => {
        // this is where the code runs
        db.collection("posts")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                // every time a new post is added, this code firebase.
                // state 데이터 수정
                setPosts(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        post: doc.data(),
                    }))
                );
            }); // onSnapshot is very powerful listener
    }, []);
    // run everytime the variable posts changes in []( called bracket )
    // withdout data in [] it change only once

    const signUp = (event) => {
        event.preventDefault();

        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username,
                });
            })
            .catch((error) => alert(error.message));

        setOpen(false);
    };

    const signIn = (event) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message));
        setOpenSignIn(false);
    };

    /*
        jsx 영역
    */
    return (
        <div className="app">
            {/* Header */}
            <div className="app__header">
                <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo"></img>
                {user ? (
                    <Button onClick={() => auth.signOut()}>Logout</Button>
                ) : (
                    <div className="app__loginContainer">
                        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        <Button onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>
                )}
            </div>

            {/* Posts */}
            <div className="app__posts">
                <div className="app__postsLeft">
                    {/* state 데이터를 map 을 이용해서 출력 */}
                    {posts.map(({ id, post }) => (
                        <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imgUrl={post.imageUrl} />
                    ))}
                    {/* key를 넘겨주는 이유는 index의 역할을 하는것이고
                        postId 를 따로 또 넘겨주는 이유는 댓글을 남길때 해당 post 의 id 값을 불러오기 위해서이다.
                    */}
                </div>
                <div className="app__postsRight">
                    <InstagramEmbed
                        url="https://www.instagram.com/p/B_uf9dmAGPw/"
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName="div"
                        protocol=""
                        injecfftScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                    />
                </div>
            </div>

            {/* image upload */}
            {user?.displayName ? <ImageUpload username={user.displayName} /> : <div></div>}

            {/* modal */}
            <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo"></img>
                        </center>
                        <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
                        <Button type="submit" onClick={signIn}>
                            Sign In
                        </Button>
                    </form>
                </div>
            </Modal>
            {/* modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo"></img>
                        </center>
                        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
                        <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
                        <Button type="submit" onClick={signUp}>
                            Sign Up
                        </Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
