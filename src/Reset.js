import React from "react";
import "./Reset.css";

const Reset = (props) => {
  return (
    <div className="reset">
      <button className="boton-reset" onClick={props.onClick}>Config. inicial</button>
    </div>
  );
};

export default Reset;
