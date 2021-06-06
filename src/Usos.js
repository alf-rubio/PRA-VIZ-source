import React from "react";
import "./Usos.css";

const Usos = (props) => {
  return (
    <div className="usos">
      <div className="cuerpo-usos">
        <div className="tit-usos">Aplicaciones</div>

        <form className="form-usos">
          <select
            name="usos"
            id="usoSatelite"
            onChange={props.onChange}
            value={props.selected}
          >
            <option value="todos">todas</option>
            <option value="Civil">Civil</option>
            <option value="Government">Gubernamental</option>
            <option value="Military">Militar</option>
            <option value="Commercial">Comercial</option>
          </select>
        </form>
      </div>
    </div>
  );
};

export default Usos;
