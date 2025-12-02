// src/hooks/useLanguage.js
import { useEffect, useState } from "react";

export default function useLanguage() {
  const [lang, setLangState] = useState(localStorage.getItem("lang") || "en");

  const setLang = (newLang) => {
    localStorage.setItem("lang", newLang);
    setLangState(newLang);
  };

  useEffect(() => {
    const listener = () => {
      setLangState(localStorage.getItem("lang") || "en");
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  return [lang, setLang];
}
