import React from "react";
import "./MostrarOrbita.css";

const MostrarOrbita = (props) => {
  const deshabilitado = props.deshabilitado;
  const marcado = props.marcado;

  return (
    <div className="mostrar-orbita">
        <form className="form-mostrar-orbita">
          <input 
            disabled={deshabilitado} 
            type="checkbox"
            id="mostrarOrbita"
            name="mostrar_orbita"
            onChange={props.onChange}
            checked={marcado}
          />
          <label htmlFor="mostrarOrbita">Mostrar órbitas</label>
        </form>
      </div>
  );
};

export default MostrarOrbita;
