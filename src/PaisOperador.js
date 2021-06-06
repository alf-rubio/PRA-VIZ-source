import React from 'react';
import "./PaisOperador.css";

const PaisOperador = (props) => {

    return (
        <div className="pais-operador">
        <div className="tit-pais-operador">País operador</div>

        <form className="form-pais-operador">
            <select name="paisOperador" id="pais" onChange={props.onChange} value={props.selected}>
                {props.paisesOperadores.map((pais) => <option key={pais} value={pais}>{pais}</option>)}
            </select>        
        </form>
        </div>
    );
}

export default PaisOperador;
