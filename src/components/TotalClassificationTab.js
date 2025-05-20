import React from "react";
import "./TotalClassificationTab.css";

function TotalClassificationTab({ clasificacionesTotales, equipos }) {
  const clasificacionEquipos = {};
  equipos.forEach((equipo) => {
    let tiempoTotalEquipo = 0;
    [equipo.rodador, equipo.sprinter].forEach((corredor) => {
      if (clasificacionesTotales?.general?.[corredor.nombre]?.tiempoTotal) {
        tiempoTotalEquipo +=
          clasificacionesTotales.general[corredor.nombre].tiempoTotal;
      }
    });
    clasificacionEquipos[equipo.nombre] = tiempoTotalEquipo;
  });

  const clasificacionEquiposOrdenada = Object.entries(
    clasificacionEquipos
  ).sort(([, tiempoA], [, tiempoB]) => tiempoA - tiempoB);

  return (
    <div className="total-classification-tab">
      <h2>Clasificación</h2>

      <div className="contenedor-tablas">
        <div className="tabla">
          <h3>General (Tour)</h3>
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th className="izquierda">Nombre</th>
                <th className="izquierda">Equipo</th>
                <th className="tiempo-total-centered">Tiempo</th>
                <th>🏆</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(clasificacionesTotales?.general || {}).map(
                ([nombre, datos], index) => {
                  const equipoCorredor = equipos.find(
                    (equipo) => equipo.rodador.nombre === nombre || equipo.sprinter.nombre === nombre
                  );

                  const corredorInfo =
                    equipoCorredor?.rodador.nombre === nombre
                      ? equipoCorredor.rodador
                      : equipoCorredor?.sprinter.nombre === nombre
                      ? equipoCorredor.sprinter
                      : undefined;

                  const tiempoTotalFormatted = datos?.tiempoTotal
                    ? `${String(Math.floor(datos.tiempoTotal / 60)).padStart(2, "0")}:${String(
                        datos.tiempoTotal % 60
                      ).padStart(2, "0")}`
                    : "00:00";

                  const puntosTourCorredor = clasificacionesTotales?.tour?.[nombre] || 0;

                  return (
                    <tr key={nombre}>
                      <td>{index + 1}</td>
                      <td>
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "1px solid black",
                            backgroundColor: equipoCorredor?.color,
                            color: equipoCorredor?.color === "white" ? "black" : "white",
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
                      {nombre}</td>
                      <td>{equipoCorredor?.nombre}</td>
                      <td className="centrada">{tiempoTotalFormatted}</td>
                      <td className="derecha">{puntosTourCorredor}</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>

        {/* Tabla de Clasificación por Equipos (sin cambios) */}
        <div className="tabla">
          <h3>Clasificación por Equipos</h3>
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th className="izquierda">Equipo</th>
                <th>Tiempo</th>
              </tr>
            </thead>
            <tbody>
              {clasificacionEquiposOrdenada.map(
                ([nombreEquipo, tiempoTotal], index) => {
                  const tiempoTotalFormattedEquipos = tiempoTotal
                    ? `${Math.floor(tiempoTotal / 3600)}:${String(
                        Math.floor((tiempoTotal % 3600) / 60)
                      ).padStart(2, "0")}:${String(tiempoTotal % 60).padStart(
                        2,
                        "0"
                      )}`
                    : "0:00:00";
                  const equipoInfo = equipos.find(
                    (equipo) => equipo.nombre === nombreEquipo
                  );
                  return (
                    <tr key={nombreEquipo}>
                      <td>{index + 1}</td>
                      <td>
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "1px solid black",
                            backgroundColor: equipoInfo.color,
                            color:
                              equipoInfo.color === "white" ? "black" : "white",
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                            fontSize: "0.9em",
                            marginRight: "2%",
                          }}
                        >
                          T
                        </div>
                        {nombreEquipo}</td>
                      <td className="centrada">
                        {tiempoTotalFormattedEquipos}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="contenedor-tablas">
        <div className="tabla">
          <h3>Regularidad</h3>
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th className="izquierda">Nombre</th>
                <th className="izquierda">Equipo</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(clasificacionesTotales?.regularidad || {})
                .sort(([, a], [, b]) => b - a)
                .map(([nombre, puntos], index) => {
                  const equipoCorredor = equipos.find((equipo) =>
                    equipo.rodador.nombre === nombre || equipo.sprinter.nombre === nombre
                  );
                const corredorInfo =
                  equipoCorredor?.rodador.nombre === nombre
                    ? equipoCorredor.rodador
                    : equipoCorredor?.sprinter.nombre === nombre
                    ? equipoCorredor.sprinter
                    : undefined;
                return (
                  <tr key={nombre}>
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
                      {nombre}</td>
                    <td>{equipoCorredor?.nombre}</td>
                    <td className="derecha">{puntos}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="tabla">
          <h3>Montaña</h3>
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th className="izquierda">Nombre</th>
                <th className="izquierda">Equipo</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(clasificacionesTotales?.montaña || {})
                .sort(([, a], [, b]) => b - a)
                .map(([nombre, puntos], index) => {
                  const equipoCorredor = equipos.find(
                    (equipo) => equipo.rodador.nombre === nombre || equipo.sprinter.nombre === nombre
                  );
                  const corredorInfo =
                    equipoCorredor?.rodador.nombre === nombre
                      ? equipoCorredor.rodador
                      : equipoCorredor?.sprinter.nombre === nombre
                      ? equipoCorredor.sprinter
                      : undefined;

                  return (
                    <tr key={nombre}>
                      <td>{index + 1}</td>
                      <td>
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "1px solid black",
                            backgroundColor: equipoCorredor?.color,
                            color: equipoCorredor?.color === "white" ? "black" : "white",
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
                        {nombre}</td>
                      <td>{equipoCorredor?.nombre}</td>
                      <td className="derecha">{puntos}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TotalClassificationTab;
