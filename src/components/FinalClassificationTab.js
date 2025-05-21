import React, { useMemo } from "react";
import "./FinalClassificationTab.css";

const FinalClassificationTab = ({
  resultadosPorEtapa,
  clasificacionesFinales,
  equipos,
  numeroEtapas,
}) => {
  const allCorredores = Array.from(
    new Set(
      equipos.flatMap((equipo) =>
        [equipo.rodador, equipo.sprinter].map((c) => c.nombre)
      )
    )
  );
  const etapas = Object.keys(resultadosPorEtapa).filter(
    (key) => !key.startsWith("Rest")
  );
  const descansos = Object.keys(resultadosPorEtapa).filter((key) =>
    key.startsWith("Rest ")
  );

  const puntosPorClasificacion = {
    general: {
      "3-7": [3, 2, 1],
      "8-14": [4, 3, 2, 1],
      "15-21": [5, 4, 3, 2, 1],
    },
    sprint: {
      "3-7": [2, 1],
      "8-14": [3, 2, 1],
      "15-21": [4, 3, 2, 1],
    },
    montaña: {
      "3-7": [2, 1],
      "8-14": [3, 2, 1],
      "15-21": [4, 3, 2, 1],
    },
    team: {
      "3-7": [1],
      "8-14": [2, 1],
      "15-21": [3, 2, 1],
    },
  };

  const getPuntosClasificacion = (clasificacion, posicion) => {
    const numEtapasKey =
      numeroEtapas >= 15 ? "15-21" : numeroEtapas >= 8 ? "8-14" : "3-7";
    return (
      puntosPorClasificacion[clasificacion]?.[numEtapasKey]?.[posicion - 1] || 0
    );
  };

  const formatTiempo = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;
    const horasFormateadas = String(horas).padStart(1, "0");
    const minutosFormateados = String(minutos).padStart(2, "0");
    const segundosFormateados = String(segundosRestantes).padStart(2, "0");
    return `${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;
  };

  // Calcular la puntuación total de cada corredor
  const corredorPuntuacionTotal = useMemo(() => {
    const puntuaciones = {};
    allCorredores.forEach((corredor) => {
      let totalTP = 0;
      etapas.forEach((etapa) => {
        totalTP += resultadosPorEtapa[etapa]?.puntosTour?.[corredor] || 0;
      });
      descansos.forEach((descanso) => {
        totalTP += resultadosPorEtapa[descanso]?.puntosTour?.[corredor] || 0;
      });

      let puntosGeneral = 0;
      if (clasificacionesFinales?.general) {
        const posicion =
          Object.keys(clasificacionesFinales.general).indexOf(corredor) + 1;
        puntosGeneral = getPuntosClasificacion("general", posicion);
      }

      let puntossprint = 0;
      if (clasificacionesFinales?.sprint) {
        const posicion =
          Object.keys(clasificacionesFinales.sprint).indexOf(corredor) + 1;
        puntossprint = getPuntosClasificacion("sprint", posicion);
      }

      let puntosMontaña = 0;
      if (clasificacionesFinales?.montaña) {
        const posicion =
          Object.keys(clasificacionesFinales.montaña).indexOf(corredor) + 1;
        puntosMontaña = getPuntosClasificacion("montaña", posicion);
      }

      const totalPuntosClasificacion =
        puntosGeneral + puntossprint + puntosMontaña;

      puntuaciones[corredor] = {
        tpTotal: totalTP,
        puntosGeneral,
        puntossprint,
        puntosMontaña,
        totalPuntosClasificacion,
        totalFinal: totalTP + totalPuntosClasificacion,
        tpPorEtapa: etapas.reduce((acc, etapa) => {
          acc[etapa] = resultadosPorEtapa[etapa]?.puntosTour?.[corredor] || 0;
          return acc;
        }, {}),
        tpPorDescanso: descansos.reduce((acc, descanso) => {
          acc[descanso] =
            resultadosPorEtapa[descanso]?.puntosTour?.[corredor] || 0;
          return acc;
        }, {}),
        tiempoTotal:
          clasificacionesFinales?.general?.[corredor]?.tiempoTotal || 0,
      };
    });
    return puntuaciones;
  }, [
    allCorredores,
    etapas,
    descansos,
    resultadosPorEtapa,
    clasificacionesFinales,
    numeroEtapas,
  ]);

  // Ordenar corredores por la puntuación total final
  const corredoresOrdenados = Object.entries(corredorPuntuacionTotal)
    .sort(([, a], [, b]) => b.totalFinal - a.totalFinal)
    .map(([corredor]) => corredor);

  // Calcular el tiempo total de los dos mejores corredores por equipo
  const tiempoTotalEquipoFinal = useMemo(() => {
    const tiempoPorEquipo = {};
    equipos.forEach((equipo) => {
      const tiemposCorredores = [equipo.rodador, equipo.sprinter]
        .map((c) => corredorPuntuacionTotal[c.nombre]?.tiempoTotal || Infinity)
        .sort((a, b) => a - b)
        .slice(0, 2)
        .reduce((sum, tiempo) => sum + tiempo, 0);
      tiempoPorEquipo[equipo.nombre] = tiemposCorredores;
    });
    return tiempoPorEquipo;
  }, [equipos, corredorPuntuacionTotal, clasificacionesFinales?.general]);

  // Calcular la puntuación por equipos basada en el tiempo total de los dos mejores corredores
  const puntuacionTiempoEquipoFinal = useMemo(() => {
    const equiposOrdenadosPorTiempo = Object.entries(tiempoTotalEquipoFinal)
      .sort(([, tiempoA], [, tiempoB]) => tiempoA - tiempoB)
      .map(([nombreEquipo]) => nombreEquipo);

    const puntosEquipoFinal = {};
    equiposOrdenadosPorTiempo.forEach((nombreEquipo, index) => {
      const posicionEquipo = index + 1;
      puntosEquipoFinal[nombreEquipo] = getPuntosClasificacion(
        "team",
        posicionEquipo
      );
    });

    return puntosEquipoFinal;
  }, [tiempoTotalEquipoFinal, numeroEtapas]);

  // Calcular la suma de los puntos de los dos corredores por equipo
  const puntuacionSumaCorredoresEquipo = useMemo(() => {
    const sumaPuntos = {};
    Object.keys(corredorPuntuacionTotal).forEach((corredor) => {
      const equipoCorredor = equipos.find(
        (eq) =>
          eq.rodador.nombre === corredor || eq.sprinter.nombre === corredor
      )?.nombre;
      if (equipoCorredor) {
        if (!sumaPuntos[equipoCorredor]) {
          sumaPuntos[equipoCorredor] = [];
        }
        sumaPuntos[equipoCorredor].push(
          corredorPuntuacionTotal[corredor]?.totalFinal || 0
        );
      }
    });
    const sumaPuntosFinal = {};
    for (const equipo in sumaPuntos) {
      sumaPuntos[equipo].sort((a, b) => b - a);
      sumaPuntosFinal[equipo] = sumaPuntos[equipo]
        .slice(0, 2)
        .reduce((sum, p) => sum + p, 0);
    }
    return sumaPuntosFinal;
  }, [equipos, corredorPuntuacionTotal]);

  // Ordenar la puntuación por equipos
  const equiposOrdenadosPorPuntuacionFinal = useMemo(() => {
    const puntuacionFinalEquipo = {};
    for (const equipo in puntuacionSumaCorredoresEquipo) {
      puntuacionFinalEquipo[equipo] =
        (puntuacionSumaCorredoresEquipo[equipo] || 0) +
        (puntuacionTiempoEquipoFinal[equipo] || 0);
    }
    return Object.entries(puntuacionFinalEquipo).sort(([, a], [, b]) => b - a);
  }, [puntuacionSumaCorredoresEquipo, puntuacionTiempoEquipoFinal]);

  return (
    <div>
      <h2 className="tableTitle">Clasificación Final Individual</h2>
      <table className="classificationTable">
        <>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th
                colspan={Object.keys(resultadosPorEtapa).length + 1}
                style={{
                  borderLeft: "1px solid #ccc",
                  borderRight: "1px solid #ccc",
                }}
              >
                Etapas
              </th>
              <th
                colspan="4"
                style={{
                  borderLeft: "1px solid #ccc",
                  borderRight: "1px solid #ccc",
                }}
              >
                Clasificaciones
              </th>
              <th>TF</th>
            </tr>
            <tr>
              <th></th>
              <th style={{ textAlign: "left", borderRight: "1px solid #ccc" }}>
                Corredor
              </th>
              {etapas.map((etapa) => (
                <th key={etapa}>{etapa}</th>
              ))}
              {descansos.map((descanso) => (
                <th key={descanso}>
                  D{descanso.match(/Descanso (\d+)/)?.[1] || ""}
                </th>
              ))}
              <th style={{ borderRight: "1px solid #ccc" }}>TP</th>
              <th>PG</th>
              <th>PR</th>
              <th>PM</th>
              <th style={{ borderRight: "1px solid #ccc" }}>TC</th>
              <th>TF</th>
            </tr>
          </thead>
        </>
        <tbody>
          {corredoresOrdenados.map((corredor, index) => {
            const puntuacion = corredorPuntuacionTotal[corredor];
            return (
              <tr key={corredor}>
                <td>{index + 1}</td>
                <td style={{ textAlign: "left" }}>{corredor}</td>
                {etapas.map((etapa) => (
                  <td key={`${corredor}-${etapa}`}>
                    {puntuacion.tpPorEtapa[etapa]}
                  </td>
                ))}
                {descansos.map((descanso) => (
                  <td key={`${corredor}-${descanso}`}>
                    {puntuacion.tpPorDescanso[descanso]}
                  </td>
                ))}
                <td className="total-parcial">{puntuacion.tpTotal}</td>
                <td>{puntuacion.puntosGeneral}</td>
                <td>{puntuacion.puntossprint}</td>
                <td>{puntuacion.puntosMontaña}</td>
                <td className="total-parcial">
                  {puntuacion.totalPuntosClasificacion}
                </td>
                <td className="total-final">{puntuacion.totalFinal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Clasificación por Equipos</h2>
      <table className="classificationTable">
        <thead>
          <tr>
            <th></th>
            <th style={{ textAlign: "left" }}>Equipo</th>
            <th>Tiempo Equipo</th>
            <th>Equipos</th>
            <th>Corredores</th>
            <th>Total </th>
          </tr>
        </thead>
        <tbody>
          {equiposOrdenadosPorPuntuacionFinal.map(
            ([nombreEquipo, totalPuntos], index) => {
              const puntosTiempo =
                puntuacionTiempoEquipoFinal[nombreEquipo] || 0;
              const sumaPuntosCorredores =
                puntuacionSumaCorredoresEquipo[nombreEquipo] || 0;
              const sumaTiempoEquipo =
                tiempoTotalEquipoFinal[nombreEquipo] || 0;
              return (
                <tr key={nombreEquipo}>
                  <td>{index + 1}</td>
                  <td style={{ textAlign: "left" }}>{nombreEquipo}</td>
                  <td>{formatTiempo(sumaTiempoEquipo)}</td>
                  <td>{puntosTiempo}</td>
                  <td>{sumaPuntosCorredores}</td>
                  <td className="total-final">{totalPuntos}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FinalClassificationTab;
