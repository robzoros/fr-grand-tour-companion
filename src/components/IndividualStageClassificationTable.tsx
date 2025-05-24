import React from "react";
import "./IndividualStageClassificationTable.css";
import type { ResultadoEtapa, Equipo } from "../state/definitions";
import { getNombreOVacio } from "../utils/funciones";

function IndividualStageClassificationTable({
  resultadosEtapa,
  equipos,
  title,
}: {
  resultadosEtapa: ResultadoEtapa;
  equipos: Equipo[];
  title: string;
}) {
  const clasificacion =
    resultadosEtapa?.individual?.sort((a, b) => a.tiempo - b.tiempo) || [];

  return (
    <div className="individual-stage-classification-table">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Corredor</th>
            <th>Equipo</th>
            <th className="tiempo-centered">Tiempo</th>
          </tr>
        </thead>
        <tbody>
          {clasificacion.map((resultado, index) => {
            // Busca el equipo que tenga rodador o sprinter con ese nombre
            const equipoCorredor = equipos.find(
              (equipo) =>
                equipo.rodador.nombre === resultado.corredor ||
                equipo.sprinter.nombre === resultado.corredor
            );

            // Encuentra si es rodador o sprinter
            let corredorInfo = null;
            if (equipoCorredor) {
              if (equipoCorredor.rodador.nombre === resultado.corredor) {
                corredorInfo = equipoCorredor.rodador;
              } else if (
                equipoCorredor.sprinter.nombre === resultado.corredor
              ) {
                corredorInfo = equipoCorredor.sprinter;
              }
            }

            const tiempoFormatted = `${Math.floor(
              resultado.tiempo / 60
            )}:${String(resultado.tiempo % 60).padStart(2, "0")}`;

            const puntosEtapa =
              resultadosEtapa?.puntosTour?.[resultado.corredor] || 0;

            return (
              <tr key={resultado.corredor}>
                <td>{index + 1}</td>
                <td>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "1px solid black",
                      backgroundColor: equipoCorredor?.color,
                      color:
                        equipoCorredor?.color === "white" ? "black" : "white",
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: "0.9em",
                      marginRight: "2%",
                    }}
                  >
                    {corredorInfo?.tipo === "sprinter" ? "S" : "R"}
                  </div>
                  <>{getNombreOVacio(resultado.corredor)}</>
                  {puntosEtapa > 0 && (
                    <span style={{ marginLeft: "5px" }}>
                      🏆 ({puntosEtapa})
                    </span>
                  )}
                </td>
                <td>{equipoCorredor?.nombre}</td>
                <td className="tiempo-centered">{tiempoFormatted}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default IndividualStageClassificationTable;
