import React, { Component } from "react";

import "./App.css";
import { Sats } from "./util/Sats";
import * as d3 from "d3";
import data from "./datos/datos.csv";
import ClaseOrbita from "./ClaseOrbita";
import Usos from "./Usos";
import PaisOperador from "./PaisOperador";
import Contador from "./Contador";
import ResetView from "./ResetView";
import Reset from "./Reset";
import Grafica from "./Grafica";
import Paises from "./Paises";

let estaciones = [];
let dictEstaciones = {};
let paises_operadores = ["todos"];


function cors(url) {
  return "https://api.allorigins.win/raw?url=" + url;
}


class App extends Component {
  constructor(props) {
    super(props);

    this.sats = new Sats();

    this.state = {
      stations: [],
      selected: null,
      claseOrbita: { LEO: true, GEO: true, MEO: true, Elliptical: true },
      pais_operador: "todos",
      usos: "todos",
      paises_operadores: [],
    };
  }

  componentDidMount() {
    this.sats.initialize(this.vista);
    this.actualizar();
    setInterval(() => {
      this.sats.updateAllPositions(new Date());
    }, 1000);
  }

  componentWillUnmount() {
    this.sats.dispose();
  }

  onChangeClaseOrbitaHandler = (b) => {
    let clases = this.state.claseOrbita;
    clases[b.target.value] = b.target.checked;

    this.sats.quitarSatelites();
    this.setState({ claseOrbita: clases });

    this.actualizar();
  };

  onChangeUsosHandler = (b) => {
    this.sats.quitarSatelites();
    this.setState({ usos: b.target.value });

    this.actualizar();
  };

  onChangePaisOperadorHandler = (b) => {
    this.sats.quitarSatelites();
    this.setState({ pais_operador: b.target.value });

    this.actualizar();
  };

  onClickResetViewHandler = () => {
    this.sats.resetView();
  };

  onClickResetFormulario = () => {

    this.setState({
      stations: [],
      selected: null,
      claseOrbita: { LEO: true, GEO: true, MEO: true, Elliptical: true },
      pais_operador: "todos",
      usos: "todos",
      paises_operadores: [],
    });

    this.actualizar();


  }



  actualizar = () => {
    d3.csv(data).then((datos) => {
      estaciones = datos
        .filter((s) => {
          let claseOrbitaBooleano =
            (s.clase_orbita === "LEO" && this.state.claseOrbita["LEO"]) ||
            (s.clase_orbita === "GEO" && this.state.claseOrbita["GEO"]) ||
            (s.clase_orbita === "MEO" && this.state.claseOrbita["MEO"]) ||
            (s.clase_orbita === "Elliptical" &&
              this.state.claseOrbita["Elliptical"]);

          let usosBooleano = true;

          if (this.state.usos !== "todos") {
            usosBooleano = s.usos.indexOf(this.state.usos) !== -1;
          }

          let paisOperadorBooleano = true;

          if (this.state.pais_operador !== "todos") {
            paisOperadorBooleano = s.pais_operador === this.state.pais_operador;
          }

          if (claseOrbitaBooleano && usosBooleano && paisOperadorBooleano)
            return true;
          else return false;
        })
        .map((fila) => {
          if (!paises_operadores.includes(fila["pais_operador"])) {
            paises_operadores.push(fila["pais_operador"]);
          }

          return {
            id_norad: fila["NORAD"],
            nombre: fila["nombre"],
            nombre_oficial: fila["nombre_oficial"],
            pais_operador: fila["pais_operador"],
            usos: fila["usos"],
            clase_orbita: fila["clase_orbita"],
            fecha: fila["fecha"],
          };
        });

      dictEstaciones = {};
      estaciones.forEach((item) => {
        dictEstaciones[item.id_norad] = item;
      });

      this.sats
        .loadLteFileStations(
          // active,
          cors("http://www.celestrak.com/NORAD/elements/active.txt"),
          0xabacff,
          dictEstaciones
        )
        .then((stations) => {
          this.setState({
            stations: stations,
            paises_operadores: paises_operadores,
          });
          console.log(stations);
        });
    });
  };

  render() {
    return (
      <div className="pra">
        <div className="cabecera">Satélites artificiales en tiempo real</div>

        <div className="bloque1">
          <div
            className="satelites"
            ref={(elemento) => (this.vista = elemento)}
          />
          <div className="controles">
            <ClaseOrbita
              checked_LEO={this.state.claseOrbita["LEO"]}
              checked_GEO={this.state.claseOrbita["GEO"]}
              checked_MEO={this.state.claseOrbita["MEO"]}
              checked_Elliptical={this.state.claseOrbita["Elliptical"]}
              onChange={this.onChangeClaseOrbitaHandler}
            />
            <Usos
              onChange={this.onChangeUsosHandler}
              selected={this.state.usos}
            />
            <PaisOperador
              onChange={this.onChangePaisOperadorHandler}
              paisesOperadores={this.state.paises_operadores}
              selected={this.state.pais_operador}
            />
            <Contador total={this.state.stations.length}/>
            <ResetView onClick={this.onClickResetViewHandler} />
            <Reset onClick={this.onClickResetFormulario} />
          </div>
        </div>

        <div className="bloque2">
          <Grafica />
          <Paises estaciones={this.state.stations} />
        </div>
        <div className="pie"></div>
      </div>
    );
  }
}

export default App;
