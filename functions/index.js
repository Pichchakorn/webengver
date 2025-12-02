const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Translate } = require("@google-cloud/translate").v2;

admin.initializeApp();
const db = admin.firestore();

const translate = new Translate({
  projectId: "tonywebproject",
  keyFilename: "functions/your-service-account.json"
});

exports.translateIfNeeded = functions.https.onCall(async (data, context) => {
  try {
    const docId = data.docId;
    const docRef = db.collection("activities").doc(docId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return { error: "Document not found" };

    const activity = docSnap.data();
    const updates = {};

    // ✅ ตรวจว่ามีเฉพาะ en หรือ th ฝั่งเดียว ก็ให้แปลอีกฝั่ง
    const pairs = [
      { from: "name", to: "name_th", targetLang: "th" },
      { from: "description", to: "description_th", targetLang: "th" },
      { from: "locationName", to: "locationName_th", targetLang: "th" },
      { from: "name_th", to: "name", targetLang: "en" },
      { from: "description_th", to: "description", targetLang: "en" },
      { from: "locationName_th", to: "locationName", targetLang: "en" }
    ];

    for (const { from, to, targetLang } of pairs) {
      if (!activity[to] && activity[from]) {
        const [translated] = await translate.translate(activity[from], targetLang);
        updates[to] = translated;
      }
    }

    if (Object.keys(updates).length > 0) {
      await docRef.update(updates);
    }

    return { success: true, updated: updates };
  } catch (error) {
    console.error("Translation error:", error);
    return { error: error.message };
  }
});