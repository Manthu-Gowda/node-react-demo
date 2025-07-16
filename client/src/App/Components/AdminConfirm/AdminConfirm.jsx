import React from "react";
import "./AdminConfirm.scss";

const AdminConfirm = ({ title, onCancel, onConfirm }) => {
  return (
    <div className="aconfirm">
      <div className="aconfirm_popup">
        <div className="aconfirm_popup_inner">
          <h2>{title}</h2>
          <div className="aconfirm_popup_buttons">
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirm;
