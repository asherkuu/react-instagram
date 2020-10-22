// firebase 연결 설정
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    // firebase 설정 config
    apiKey: "AIzaSyDZ4Yl8FW7pg23SubU_mW5D4gSVCHU9FY0",
    authDomain: "p-instagram.firebaseapp.com",
    databaseURL: "https://p-instagram.firebaseio.com",
    projectId: "p-instagram",
    storageBucket: "p-instagram.appspot.com",
    messagingSenderId: "351021532350",
    appId: "1:351021532350:web:fe6e1f548c30fc92e24aef",
    measurementId: "G-MK76MZ9BLB",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
