import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';  // นำเข้า Firebase auth
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);  // ให้สามารถเข้าถึง context ได้จาก component อื่นๆ
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);  // ตั้งค่าผู้ใช้เมื่อสถานะการล็อกอินเปลี่ยน
    });

    return unsubscribe;  // ยกเลิกการเชื่อมต่อเมื่อ component ถูกทำลาย
  }, []);

  const logout = () => {
    return auth.signOut();  // ฟังก์ชันออกจากระบบ
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}  {/* ส่งค่าผ่าน context ให้กับ component อื่นๆ */}
    </AuthContext.Provider>
  );
}
