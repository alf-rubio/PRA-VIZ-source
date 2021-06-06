import React, { Component } from 'react';
import acumulados from "./datos/acumulados.csv";
import "./Grafica.css";
import * as d3 from "d3";



class Grafica extends Component {

    muestraGrafica() {

        let margin_gr = { 'top': 60, 'right': 50, 'bottom': 120, 'left': 50 };
        let width_gr = 550 - margin_gr.left - margin_gr.right;
        let height_gr = 450 - margin_gr.top - margin_gr.bottom;

        const svg = d3
            .select("#gr")
            .append("svg")
            .attr("class", "svg-grafica")
            .attr("width", width_gr + margin_gr.left + margin_gr.right)
            .attr("height", height_gr + margin_gr.top + margin_gr.bottom)
            .append("g")
            .attr("transform", "translate(" + margin_gr.left + "," + margin_gr.top + ")");

      

        d3.csv(acumulados).then((datos) => {

            let x_gr = d3.scaleTime()
                .domain([new Date("1974-01-01"), new Date("2021-12-31")])
                // .domain(d3.extent(datos, (d) => Date.parse(d.fecha)))
                .range([0, width_gr]);

            // eje x
            svg.append("g")
                .attr("class", "eje-x")
                .attr("transform", "translate(0," + height_gr + ")")
                .call(d3.axisBottom(x_gr).tickSize(0))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            let y_gr = d3.scaleLinear()
                .domain([0, d3.max(datos, (d) => d.acumulado * 1.1)])
                .range([height_gr, 0]);

            // eje y
            svg.append("g")
                .attr("class", "eje-y")
                .call(d3.axisLeft(y_gr).tickSize(0).tickFormat(d3.format("d")));


            // eje y derecho 
            svg.append("g")
                .attr("class", "eje-y")
                .attr("transform", "translate( " + width_gr + ", 0 )")
                .call(d3.axisRight(y_gr).tickSize(0).tickFormat(d3.format("d")));

            svg.append("g")
                .attr("class", "grid-grafica")
                .attr("transform", "translate(0," + height_gr + ")")
                .call(d3.axisBottom(x_gr)
                    .ticks(5)
                    .tickSize(-height_gr)
                    .tickFormat("")
                )

            svg.append("g")
                .attr("class", "grid-grafica")
                .call(d3.axisLeft(y_gr)
                    .ticks(5)
                    .tickSize(-width_gr)
                    .tickFormat("")
                )

            // líneas
            svg.append("path")
                .datum(datos)
                .attr("fill", "none")
                .attr("stroke", "orange")
                .attr("stroke-width", 2.5)
                .attr("d", d3.line()
                    .x((d) => x_gr(Date.parse(d.fecha)))
                    .y((d) => y_gr(d.acumulado))
                )

            svg.append("text")
                .attr("x", (width_gr / 2))             
                .attr("y", height_gr + (margin_gr.bottom / 2))
                .attr("class", "tit-grafica")
                .style('fill', 'darkOrange')
                .text("Evolución del número de satélites activos");

        });
    };

    componentDidMount() {
        this.muestraGrafica();
    }


    render() {
        return (
            <div id="gr" className="grafica">
            </div>
        );

    }

}

export default Grafica;
