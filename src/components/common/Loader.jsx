import React from "react";
import { ClipLoader } from "react-spinners";

/**
 * Global Loader
 * SDK Davomat DB yuklanayotganda ko‘rinadi
 */
const Loader = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
        flexDirection: "column",
      }}
    >
      <ClipLoader
        size={48}
        color="#111827"
        speedMultiplier={1.2}
      />

      <p
        style={{
          marginTop: 16,
          fontSize: 16,
          fontWeight: 500,
          color: "#111827",
        }}
      >
        SDK Davomat DB yuklanmoqda...
      </p>
    </div>
  );
};

export default Loader;
