import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

const LanguageToggle = () => {
  const setLang = (lang) => {
    localStorage.setItem("lang", lang);
    window.location.reload();
  };

  return (
    <ButtonGroup aria-label="Language switch" className="me-3">
      <Button
        variant="outline-light"
        size="sm"
        onClick={() => setLang("en")}
        style={{ fontWeight: "bold" }}
      >
        🇺🇸 EN
      </Button>
      <Button
        variant="outline-light"
        size="sm"
        onClick={() => setLang("th")}
        style={{ fontWeight: "bold" }}
      >
        🇹🇭 TH
      </Button>
    </ButtonGroup>
  );
};

export default LanguageToggle;
