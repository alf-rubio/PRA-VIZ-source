import React, { Component } from "react";
import * as d3 from "d3";
import "./Paises.css";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

class Paises extends Component {
  muestraPaises() {
    let datos = [];
    let mapaPaises = new Map();
    let civ = [1, 0, 0, 0, 0];
    let gov = [0, 1, 0, 0, 0];
    let mil = [0, 0, 1, 0, 0];
    let com = [0, 0, 0, 1, 0];
    let total = [0, 0, 0, 0, 1];

    this.props.estaciones
      .map((s) => {
        return s.datos.pais_operador;
      })
      .filter(onlyUnique)
      .map((item) => mapaPaises.set(item, [0, 0, 0, 0, 0]));

    this.props.estaciones.forEach((s) => {
      if (s.datos.usos.indexOf("Civil") !== -1) {
        mapaPaises.set(
          s.datos.pais_operador,
          mapaPaises.get(s.datos.pais_operador).map((v, i) => v + civ[i])
        );
      }
      if (s.datos.usos.indexOf("Government") !== -1) {
        mapaPaises.set(
          s.datos.pais_operador,
          mapaPaises.get(s.datos.pais_operador).map((v, i) => v + gov[i])
        );
      }
      if (s.datos.usos.indexOf("Military") !== -1) {
        mapaPaises.set(
          s.datos.pais_operador,
          mapaPaises.get(s.datos.pais_operador).map((v, i) => v + mil[i])
        );
      }
      if (s.datos.usos.indexOf("Commercial") !== -1) {
        mapaPaises.set(
          s.datos.pais_operador,
          mapaPaises.get(s.datos.pais_operador).map((v, i) => v + com[i])
        );
      }

      mapaPaises.set(
        s.datos.pais_operador,
        mapaPaises.get(s.datos.pais_operador).map((v, i) => v + total[i])
      );
    });

    mapaPaises.forEach((valor, clave) => {
      datos.push({
        pais_operador: clave,
        civ: valor[0],
        gov: valor[1],
        mil: valor[2],
        com: valor[3],
        recuento: valor[4],
      });
    });

    datos = datos.slice().sort((a, b) => d3.ascending(a.recuento, b.recuento));

    if (datos.length <= 0) {
      d3.select(".paises").remove();
      return;
    }

    let data = [];
    if (datos.length === 1) {
      data = [
        { pais_operador: "Civil", recuento: datos[0].civ },
        { pais_operador: "Gubernamental", recuento: datos[0].gov },
        { pais_operador: "Militar", recuento: datos[0].mil },
        { pais_operador: "Comercial", recuento: datos[0].com },
      ].filter((d) => d.recuento > 0);

      data = data.slice().sort((a, b) => d3.ascending(a.recuento, b.recuento));
    } else {
      data = datos
        .map((item) => {
          return { pais_operador: item.pais_operador, recuento: item.recuento };
        })
        .filter((item, i) => i > datos.length - 16);
    }

    let margin = { top: 60, right: 60, bottom: 80, left: 120 };
    let width = 650 - margin.left - margin.right;
    let height = 50 * data.length;

    let svg_paises = d3
      .select("#gr-paises")
      .append("svg")
      .attr("class", "paises")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let y = d3
      .scaleBand()
      .domain(data.map((d) => d.pais_operador))
      .range([height, 0])
      .padding(0.1);

    // eje y
    svg_paises
      .append("g")
      .attr("class", "eje-y-paises")
      .call(d3.axisLeft(y).tickSize(0));

    let x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.recuento)])
      .range([0, width]);

    // barras
    if (datos.length > 1) {
      svg_paises
        .selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "barraPais")
        .attr("x", x(0))
        .attr("y", (d) => y(d.pais_operador))
        .attr("width", (d) => x(d.recuento))
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2");
      // .attr("fill", "#66c4e0");
    } else {
      svg_paises
        .selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "barraPais")
        .attr("x", x(0))
        .attr("y", (d) => y(d.pais_operador))
        .attr("width", (d) => x(d.recuento))
        .attr("height", y.bandwidth())
        .attr("fill", "#d9884e");
    }

    svg_paises
      .selectAll("text.bar")
      .data(data)
      .enter()
      .append("text")
      .text(function (d) {
        return d.recuento;
      })
      .attr("x", function (d, i) {
        return x(d.recuento) + 20;
      })
      .attr("y", function (d, i) {
        let alto = height / data.length;
        return height - 12 - (alto * i + 5);
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .attr("fill", "white")
      .attr("text-anchor", "middle");

    if (datos.length > 1) {
      svg_paises
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 6)
        .attr("class", "tit-grafica")
        .style("fill", "white")
        .text("Distribución por países");
    } else {
      svg_paises
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 6)
        .attr("class", "tit-grafica")
        .style("fill", "white")
        .text("Distribución por finalidad");
    }
  }

  actualizaPaises() {
    let datos = [];
    let mapaPaises = new Map();
    let civ = [1, 0, 0, 0, 0];
    let gov = [0, 1, 0, 0, 0];
    let mil = [0, 0, 1, 0, 0];
    let com = [0, 0, 0, 1, 0];
    let total = [0, 0, 0, 0, 1];

    this.props.estaciones
      .map((s) => {
        return s.datos.pais_operador;
      })
      .filter(onlyUnique)
      .map((item) => mapaPaises.set(item, [0, 0, 0, 0, 0]));

    this.props.estaciones.forEach((s) => {
      if (s.datos.usos.indexOf("Civil") !== -1) {
        mapaPaises.set(
          s.datos.pais_operador,
          mapaPaises.get(s.datos.pais_operador).map((v, i) => v + civ[i])
        );
      }
      if (s.datos.usos.indexOf("Government") !== -1) {
        mapaPaises.set(
          s.datos.pais_operador,
          mapaPaises.get(s.datos.pais_operador).map((v, i) => v + gov[i])
        );
      }
      if (s.datos.usos.indexOf("Military") !== -1) {
        mapaPaises.set(
          s.datos.pais_operador,
          mapaPaises.get(s.datos.pais_operador).map((v, i) => v + mil[i])
        );
      }
      if (s.datos.usos.indexOf("Commercial") !== -1) {
        mapaPaises.set(
          s.datos.pais_operador,
          mapaPaises.get(s.datos.pais_operador).map((v, i) => v + com[i])
        );
      }

      mapaPaises.set(
        s.datos.pais_operador,
        mapaPaises.get(s.datos.pais_operador).map((v, i) => v + total[i])
      );
    });

    mapaPaises.forEach((valor, clave) => {
      datos.push({
        pais_operador: clave,
        civ: valor[0],
        gov: valor[1],
        mil: valor[2],
        com: valor[3],
        recuento: valor[4],
      });
    });

    datos = datos.slice().sort((a, b) => d3.ascending(a.recuento, b.recuento));

    if (datos.length <= 0) {
      d3.select(".paises").remove();
      return;
    }

    let data = [];
    if (datos.length === 1) {
      data = [
        { pais_operador: "Civil", recuento: datos[0].civ },
        { pais_operador: "Gubernamental", recuento: datos[0].gov },
        { pais_operador: "Militar", recuento: datos[0].mil },
        { pais_operador: "Comercial", recuento: datos[0].com },
      ].filter((d) => d.recuento > 0);

      data = data.slice().sort((a, b) => d3.ascending(a.recuento, b.recuento));
    } else {
      data = datos
        .map((item) => {
          return { pais_operador: item.pais_operador, recuento: item.recuento };
        })
        .filter((item, i) => i > datos.length - 16);
    }

    let margin = { top: 80, right: 60, bottom: 80, left: 120 };
    let width = 600 - margin.left - margin.right;

    let height = 50 * data.length;

    let svg_paises = d3.select(".paises").remove();

    svg_paises = d3
      .select("#gr-paises")
      .append("svg")
      .attr("class", "paises")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let y = d3
      .scaleBand()
      .domain(data.map((d) => d.pais_operador))
      .range([height, 0])
      .padding(0.1);

    // eje y
    svg_paises
      .append("g")
      .attr("class", "eje-y-paises")
      .call(d3.axisLeft(y).tickSize(0));

    let x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.recuento)])
      .range([0, width]);

    // barras
    if (datos.length > 1) {
      svg_paises
        .selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "barraPais")
        .attr("x", x(0))
        .attr("y", (d) => y(d.pais_operador))
        .attr("width", (d) => x(d.recuento))
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2");
      // .attr("fill", "#66c4e0");
    } else {
      svg_paises
        .selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "barraPais")
        .attr("x", x(0))
        .attr("y", (d) => y(d.pais_operador))
        .attr("width", (d) => x(d.recuento))
        .attr("height", y.bandwidth())
        .attr("fill", "#d9884e");
    }

    svg_paises
      .selectAll("text.bar")
      .data(data)
      .enter()
      .append("text")
      .text(function (d) {
        return d.recuento;
      })
      .attr("x", function (d, i) {
        return x(d.recuento) + 20;
      })
      .attr("y", function (d, i) {
        let alto = height / data.length;
        return height - 12 - (alto * i + 5);
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .attr("fill", "white")
      .attr("text-anchor", "middle");

    if (datos.length > 1) {
      svg_paises
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 6)
        .attr("class", "tit-grafica")
        .style("fill", "white")
        .text("Distribución por países");
    } else {
      svg_paises
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 6)
        .attr("class", "tit-grafica")
        .style("fill", "white")
        .text("Distribución por finalidad");
    }
  }

  componentDidMount() {
    this.muestraPaises();
  }

  componentDidUpdate() {
    this.actualizaPaises();
  }

  render() {
    return <div id="gr-paises" className="grafica-paises"></div>;
  }
}

export default Paises;
