import * as functions from "firebase-functions"; // เปลี่ยนเป็น double quotes
import * as admin from "firebase-admin"; // เปลี่ยนเป็น double quotes

admin.initializeApp();

export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase!");
});
