import React from "react";

// Fixed layout preview component — no props. Use this as the canonical layout.
const IdCardPreview: React.FC = () => {
  const templateUrl = "/idCard.jpg";
  const name = "Md Afzal Mir";
  const batch = "2022";
  const idText = "57";
  const width = 853;
  const height = 1280;
  const nameX = 0;
  const nameY = 75;
  const idX = 0;
  const idY = 1136;
  const nameSize = 40;
  const idSize = 24;
  const nameColor = "#000";
  const idColor = "#000";
  const style: React.CSSProperties = {};

  return (
    <div style={{ width, height, position: "relative", ...style }}>
      <img
        src={templateUrl}
        alt="template"
        style={{ width: "100%", height: "100%", display: "block" }}
      />

      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          left: nameX,
          top: nameY,
          fontSize: nameSize,
          color: nameColor,
          fontWeight: 700,
        }}
      >
        {name}, {batch}
      </div>

      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          fontWeight: 700,
          letterSpacing: "2px",
          left: idX,
          top: idY,
          fontSize: idSize,
          color: idColor,
        }}
      >
        {idText}
      </div>
    </div>
  );
};

export default IdCardPreview;
