import React from "react";

const TranslatedText = ({ activity }) => {
  const lang = localStorage.getItem("lang") || "en";

  return (
    <div>
      <h3>{lang === "th" ? activity.name_th || activity.name : activity.name}</h3>
      <p>{lang === "th" ? activity.description_th || activity.description : activity.description}</p>
    </div>
  );
};

export default TranslatedText;
