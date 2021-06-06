import React from "react";
import "./ResetView.css";

const ResetView = (props) => {
  return (
    <div className="reset-view">
      <button className="boton-reset-view" onClick={props.onClick}>Reiniciar vista</button>
    </div>
  );
};

export default ResetView;
