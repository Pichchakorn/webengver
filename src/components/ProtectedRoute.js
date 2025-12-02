import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      getDoc(userRef).then((userSnap) => {
        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) return <p>กำลังโหลด...</p>;
  if (!currentUser || !isAdmin) return <Navigate to="/login" />; // 🔒 กันผู้ใช้ที่ไม่ใช่แอดมิน

  return children;
};

export default ProtectedRoute;
