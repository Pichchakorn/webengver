import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; // ตรวจสอบให้แน่ใจว่า firebase.js export `db`

const addAdminRole = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    try {
      await setDoc(doc(db, "users", user.uid), { role: "admin" }, { merge: true });
      console.log("✅ เพิ่ม role admin สำเร็จ!");
      alert("✅ คุณถูกตั้งเป็น Admin แล้ว!");
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาด:", error);
    }
  } else {
    console.log("❌ ยังไม่มีผู้ใช้ล็อกอิน");
    alert("❌ กรุณาล็อกอินก่อนรันโค้ดนี้!");
  }
};

export default addAdminRole;
