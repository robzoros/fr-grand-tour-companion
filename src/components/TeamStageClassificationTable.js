import React from "react";
import "./TeamStageClassificationTable.css";

function TeamStageClassificationTable({ resultadosEtapa, equipos, title }) {
  const teamResults = {};

  // Agrupar los tiempos por equipo
  equipos.forEach((equipo) => {
    const tiemposEquipo =
      resultadosEtapa?.individual
        ?.filter((resultado) =>
          equipo.corredores.some(
            (corredor) => corredor.nombre === resultado.corredor
          )
        )
        ?.map((resultado) => resultado.tiempo)
        ?.filter((tiempo) => typeof tiempo === "number") || [];

    if (tiemposEquipo.length > 0) {
      teamResults[equipo.nombre] = tiemposEquipo.reduce(
        (sum, tiempo) => sum + tiempo,
        0
      );
    } else {
      teamResults[equipo.nombre] = null; // O algún otro valor para indicar que no hay tiempos
    }
  });

  // Convertir el objeto de resultados en un array ordenable
  const clasificacionEquipos = Object.entries(teamResults)
    .filter(([, tiempo]) => tiempo !== null)
    .sort(([, tiempoA], [, tiempoB]) => tiempoA - tiempoB);

  return (
    <div className="team-stage-classification-table">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Equipo</th>
            <th>Tiempo</th>
          </tr>
        </thead>
        <tbody>
          {clasificacionEquipos.map(([nombreEquipo, tiempoTotal], index) => (
            <tr key={nombreEquipo}>
              <td>{index + 1}</td>
              <td>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "1px solid black",
                    backgroundColor: equipos.find(
                      (eq) => eq.nombre === nombreEquipo
                    )?.color,
                    color:
                      equipos.find((eq) => eq.nombre === nombreEquipo)
                        ?.color === "white"
                        ? "black"
                        : "white",
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "0.9em",
                    marginRight: "2%",
                  }}
                >
                  T{" "}
                </div>
                {nombreEquipo}
              </td>
              <td>
                {tiempoTotal !== null
                  ? `${String(Math.floor(tiempoTotal / 60)).padStart(
                      2,
                      "0"
                    )}:${String(tiempoTotal % 60).padStart(2, "0")}`
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeamStageClassificationTable;
