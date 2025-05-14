import React from "react";
import "./TotalClassificationTab.css";

function TotalClassificationTab({ clasificacionesTotales, equipos }) {
  const clasificacionEquipos = {};
  equipos.forEach((equipo) => {
    let tiempoTotalEquipo = 0;
    equipo.corredores.forEach((corredor) => {
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

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {/* Tabla de Clasificación Individual (General) */}
        <div>
          <h3>General (Tour)</h3>
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th></th>
                <th className="izquierda">Nombre</th>
                <th className="izquierda">Equipo</th>
                <th className="tiempo-total-centered">Tiempo</th>
                <th>TP</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(clasificacionesTotales?.general || {}).map(
                ([nombre, datos], index) => {
                  const equipoCorredor = equipos.find((equipo) =>
                    equipo.corredores.some(
                      (corredor) => corredor.nombre === nombre
                    )
                  );
                  const corredorInfo = equipoCorredor?.corredores.find(
                    (c) => c.nombre === nombre
                  );
                  const tiempoTotalFormatted = datos?.tiempoTotal
                    ? `${String(Math.floor(datos.tiempoTotal / 60)).padStart(
                        2,
                        "0"
                      )}:${String(datos.tiempoTotal % 60).padStart(2, "0")}`
                    : "00:00";
                  const puntosTourCorredor =
                    clasificacionesTotales?.tour?.[nombre] || 0;

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
                              equipoCorredor?.color === "white"
                                ? "black"
                                : "white",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                            fontSize: "0.9em",
                          }}
                        >
                          {corredorInfo?.tipo === "sprinter" ? "S" : "R"}
                        </div>
                      </td>
                      <td>{nombre}</td>
                      <td>{equipoCorredor?.nombre}</td>
                      <td className="centrada">{tiempoTotalFormatted}</td>
                      <td className="derecha">{puntosTourCorredor}</td>{" "}
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>

        {/* Tabla de Clasificación por Equipos (sin cambios) */}
        <div>
          <h3>Clasificación por Equipos</h3>
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th></th>
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
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                            fontSize: "0.9em",
                          }}
                        >
                          T
                        </div>
                      </td>
                      <td>{nombreEquipo}</td>
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

      {/* Tablas de Regularidad y Montaña (sin cambios) */}
      <h3>Regularidad</h3>
      <table>
        <thead>
          <tr>
            <th>Posición</th>
            <th></th>
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
                equipo.corredores.some((corredor) => corredor.nombre === nombre)
              );
              const corredorInfo = equipoCorredor?.corredores.find(
                (c) => c.nombre === nombre
              );
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
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        fontSize: "0.9em",
                      }}
                    >
                      {corredorInfo?.tipo === "sprinter" ? "S" : "R"}
                    </div>
                  </td>
                  <td>{nombre}</td>
                  <td>{equipoCorredor?.nombre}</td>
                  <td className="derecha">{puntos}</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <h3>Montaña</h3>
      <table>
        <thead>
          <tr>
            <th>Posición</th>
            <th></th>
            <th className="izquierda">Nombre</th>
            <th className="izquierda">Equipo</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(clasificacionesTotales?.montaña || {})
            .sort(([, a], [, b]) => b - a)
            .map(([nombre, puntos], index) => {
              const equipoCorredor = equipos.find((equipo) =>
                equipo.corredores.some((corredor) => corredor.nombre === nombre)
              );
              const corredorInfo = equipoCorredor?.corredores.find(
                (c) => c.nombre === nombre
              );
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
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        fontSize: "0.9em",
                      }}
                    >
                      {corredorInfo?.tipo === "sprinter" ? "S" : "R"}
                    </div>
                  </td>
                  <td>{nombre}</td>
                  <td>{equipoCorredor?.nombre}</td>
                  <td className="derecha">{puntos}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default TotalClassificationTab;
