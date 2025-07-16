import React from "react";
import "./Buttons.scss";

const Buttons = ({ children, type, onClick, className, variant, style }) => {
  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        className={`custom-button ${className} ${variant}`}
        style={style}
      >
        {children}
      </button>
    </div>
  );
};

export default Buttons;
