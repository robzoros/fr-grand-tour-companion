import React from "react";
import IndividualStageClassificationTable from "./IndividualStageClassificationTable";
import TeamStageClassificationTable from "./TeamStageClassificationTable";
import TotalClassificationTab from "./TotalClassificationTab";
import "./StageTabs.css";

function StageTabs({
  etapaActual,
  equipos,
  resultadosPorEtapa,
  clasificacionesTotales,
  permisosEscritura,
  activeTab,
  onTabClick,
  onAddTime,
  onAddScore,
  onSubtractScore,
}) {
  const etapaActualNumero = parseInt(activeTab.split(" ")[1]);
  const resultadosEtapaActual = resultadosPorEtapa[etapaActualNumero];

  const handleAddTimeIncrement = (corredorNombre, incremento) => {
    onAddTime(etapaActualNumero, corredorNombre, incremento);
  };

  const handleScoreIncrement = (corredorNombre, tipoPunto, incremento) => {
    onAddScore(etapaActualNumero, corredorNombre, tipoPunto, incremento);
  };

  return (
    <div className="stage-tabs-container">
      {activeTab.startsWith("Etapa") && (
        <div className="stage-content">
          <h2>{activeTab}</h2>

          {permisosEscritura && (
          <>
          <h3>Gestionar Resultados</h3>
          <div className="results-management">
            {equipos.map((equipo) => (
              <div key={equipo.nombre} className="team-results">
                <h4>{equipo.nombre}</h4>
                <ul>
                  {[equipo.sprinter, equipo.rodador].map((corredor) => {
                    const resultadoEtapa =
                      resultadosEtapaActual?.individual?.find(
                        (r) => r.corredor === corredor.nombre
                      ) || {};
                    const tiempoActual = resultadoEtapa.tiempo || 0;
                    const puntosRegularidad =
                      resultadosEtapaActual?.puntos?.regularidad?.find(
                        (p) => p.corredor === corredor.nombre
                      )?.puntos || 0;
                    const puntosMontaña =
                      resultadosEtapaActual?.puntos?.montaña?.find(
                        (p) => p.corredor === corredor.nombre
                      )?.puntos || 0;

                    return (
                      <li
                        key={corredor.nombre}
                        style={{
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "1px solid black",
                            backgroundColor: equipo.color,
                            color: equipo.color === "white" ? "black" : "white",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "5px",
                            fontWeight: "bold",
                            fontSize: "0.9em",
                          }}
                        >
                          {corredor.tipo === "sprinter" ? "S" : "R"}
                        </div>
                        <span className="corredor-nombre">{corredor.nombre}</span>

                        <div className="tiempo-control">
                          <label>
                            Tiempo: {Math.floor(tiempoActual / 60)}:
                            {("0" + (tiempoActual % 60)).slice(-2)}
                          </label>
                          <button onClick={() => handleAddTimeIncrement(corredor.nombre, 10)}>
                            +10s
                          </button>
                          <button onClick={() => handleAddTimeIncrement(corredor.nombre, -10)}>
                            -10s
                          </button>
                          <button onClick={() => handleAddTimeIncrement(corredor.nombre, 60)}>
                            +1min
                          </button>
                          <button onClick={() => handleAddTimeIncrement(corredor.nombre, -60)}>
                            -1min
                          </button>
                        </div>

                        <div className="puntos-control">
                          <label>Regularidad: {puntosRegularidad}</label>
                          <button
                            onClick={() =>
                              handleScoreIncrement(corredor.nombre, "regularidad", 1)
                            }
                          >
                            +1
                          </button>
                          <button
                            onClick={() =>
                              handleScoreIncrement(corredor.nombre, "regularidad", -1)
                            }
                          >
                            -1
                          </button>
                        </div>

                        <div className="puntos-control">
                          <label>Montaña: {puntosMontaña}</label>
                          <button
                            onClick={() =>
                              handleScoreIncrement(corredor.nombre, "montaña", 1)
                            }
                          >
                            +1
                          </button>
                          <button
                            onClick={() =>
                              handleScoreIncrement(corredor.nombre, "montaña", -1)
                            }
                          >
                            -1
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          </>)}

          {resultadosEtapaActual?.individual?.length > 0 && (
            <>
              <IndividualStageClassificationTable
                resultadosEtapa={resultadosEtapaActual}
                equipos={equipos}
                title={`Clasificación Individual - ${activeTab}`}
              />
              <TeamStageClassificationTable
                resultadosEtapa={resultadosEtapaActual}
                equipos={equipos}
                title={`Clasificación por Equipos - ${activeTab}`}
              />
            </>
          )}
        </div>
      )}

      {activeTab === "Total Clasificaciones" && (
        <TotalClassificationTab
          clasificacionesTotales={clasificacionesTotales}
          equipos={equipos}
        />
      )}
    </div>
  );
}

export default StageTabs;
