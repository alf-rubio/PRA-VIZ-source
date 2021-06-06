import React from "react";
import "./ClaseOrbita.css";

const ClaseOrbita = (props) => {
  const c1 = props.checked_LEO;
  const c2 = props.checked_GEO;
  const c3 = props.checked_MEO;
  const c4 = props.checked_Elliptical;

  return (
    <div className="clase-orbita">
      <div className="tit-clase-orbita">Tipo de órbita</div>
      <div className="cuerpo-clase-orbita">
        <form className="form-clase-orbita">
          <input
            type="checkbox"
            id="cb1"
            name="clase_orbita"
            value="LEO"
            onChange={props.onChange}
            checked={c1}
          />
          <label htmlFor="cb1">Baja altura (LEO)</label>
          <br />
          <input
            type="checkbox"
            id="cb2"
            name="clase_orbita"
            value="GEO"
            onChange={props.onChange}
            checked={c2}
          />
          <label htmlFor="cb2">Geoestacionaria (GEO)</label>
          <br />
          <input
            type="checkbox"
            id="cb3"
            name="clase_orbita"
            value="MEO"
            onChange={props.onChange}
            checked={c3}
          />
          <label htmlFor="cb3">Media altura (MEO)</label>
          <br />
          <input
            type="checkbox"
            id="cb4"
            name="clase_orbita"
            value="Elliptical"
            onChange={props.onChange}
            checked={c4}
          />
          <label htmlFor="cb4">Excéntrica (HEO)</label>
        </form>
      </div>
    </div>
  );
};

export default ClaseOrbita;
