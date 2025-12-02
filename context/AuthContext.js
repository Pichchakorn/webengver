import { createContext, useState, useContext } from "react";

// สร้าง Context
const AuthContext = createContext();

// Hook ใช้งาน Context
export const useAuth = () => useContext(AuthContext);

// Provider สำหรับ AuthContext
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // เก็บข้อมูล user (null = ไม่ล็อกอิน)

  // ฟังก์ชันล็อกอิน
  const login = (role) => {
    setUser({ role }); // role = "admin" หรือ "user"
  };

  // ฟังก์ชันออกจากระบบ
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
