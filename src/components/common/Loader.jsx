// Loader.tsx
import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-card">
        {/* Pulsatsiya + gradientli spinner */}
        <div className="modern-spinner">
          <div className="spinner-inner"></div>
          <div className="spinner-core"></div>
        </div>

        <h2 className="loader-title">SDK Davomat</h2>

        <p className="loader-subtitle">
          Maʼlumotlar bazasi yuklanmoqda...
        </p>

        {/* Zamonaviy uch nuqta animatsiyasi */}
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;