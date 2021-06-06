import React from "react";
import "./Contador.css";

const Contador = (props) => {
  return (
    <div className="contador">
    Satélites mostrados: &nbsp;<span className="dato">{props.total}</span>
    </div>
  );
};

export default Contador;
