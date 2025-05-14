import React, { useState, useEffect } from "react";
import ControlPanel from "./components/ControlPanel";
import StageTabs from "./components/StageTabs";
import TotalClassificationTab from "./components/TotalClassificationTab";
import FinalClassificationTab from "./components/FinalClassificationTab";
import "./App.css";

// Mock import {  mockEquiposFinal,  mockResultadosEtapasFinal,  mockClasificacionesFinales,  mockNumeroEtapasFinal,} from "./mockData";

function App() {
  /* / *************************************************************************************************
  // Mock pruebas
  const [etapaActual, setEtapaActual] = useState(mockNumeroEtapasFinal); // Simula el final de la carrera
  const [resultadosPorEtapa, setResultadosPorEtapa] = useState(
    mockResultadosEtapasFinal
  );
  const [clasificacionesTotales, setClasificacionesTotales] = useState({
    general: {}, // Se calcularán con el useEffect
    regularidad: {},
    montaña: {},
    tour: {},
  });
  const [equipos, setEquipos] = useState(mockEquiposFinal);
  const [clasificacionesFinales, setClasificacionesFinales] = useState(
    mockClasificacionesFinales
  );
  const [activeTab, setActiveTab] = useState("Clasificación Final");
  const [mostrarFormularioEquipo, setMostrarFormularioEquipo] = useState(false);
  const [faseCreacionEquipos, setFaseCreacionEquipos] = useState(false);
  const [mostrarClasificacionFinal, setMostrarClasificacionFinal] = useState(false);

  useEffect(() => {
    if (etapaActual > 0) {
      const totales = calcularClasificacionesTotales(
        equipos,
        resultadosPorEtapa
      );
      setClasificacionesTotales(totales);
    }
  }, [resultadosPorEtapa, equipos, etapaActual]);

  // Fin Mock
  // ******************************************* */

  // Regular behavior
  const [etapaActual, setEtapaActual] = useState(0);
  const [resultadosPorEtapa, setResultadosPorEtapa] = useState({});
  const [clasificacionesTotales, setClasificacionesTotales] = useState({
    general: {},
    regularidad: {},
    montaña: {},
    tour: {},
  });
  const [equipos, setEquipos] = useState([]);
  const [clasificacionesFinales, setClasificacionesFinales] = useState({});
  const [activeTab, setActiveTab] = useState("Equipos");
  const [mostrarClasificacionFinal, setMostrarClasificacionFinal] =
    useState(false);

  useEffect(() => {
    if (etapaActual > 0) {
      const totales = calcularClasificacionesTotales(
        equipos,
        resultadosPorEtapa
      );
      setClasificacionesTotales((prev) => {
        const iguales = JSON.stringify(prev) === JSON.stringify(totales);
        return iguales ? prev : totales;
      });
    }
  }, [resultadosPorEtapa, equipos, etapaActual]);
  const [nuevoNombreEquipo, setNuevoNombreEquipo] = useState("");
  const [nuevoColorEquipo, setNuevoColorEquipo] = useState("");
  const [nuevoNombreRodador, setNuevoNombreRodador] = useState("");
  const [nuevoNombreSprinter, setNuevoNombreSprinter] = useState("");
  const [mostrarFormularioEquipo, setMostrarFormularioEquipo] = useState(false);
  const [faseCreacionEquipos, setFaseCreacionEquipos] = useState(true);
  const coloresDisponiblesInicial = [
    "black",
    "white",
    "blue",
    "green",
    "red",
    "pink",
  ];
  const [coloresDisponibles, setColoresDisponibles] = useState(
    coloresDisponiblesInicial
  );

  useEffect(() => {
    const coloresUsados = equipos.map((equipo) => equipo.color);
    const disponibles = coloresDisponiblesInicial.filter(
      (color) => !coloresUsados.includes(color)
    );

    // Solo actualizar si hay diferencia real en los arrays
    setColoresDisponibles((prevDisponibles) => {
      const sonIguales =
        prevDisponibles.length === disponibles.length &&
        prevDisponibles.every((color, i) => color === disponibles[i]);

      return sonIguales ? prevDisponibles : disponibles;
    });

    // Solo establecer nuevo color si no está ya establecido o no es válido
    if (
      mostrarFormularioEquipo &&
      (!nuevoColorEquipo || !disponibles.includes(nuevoColorEquipo)) &&
      disponibles.length > 0
    ) {
      setNuevoColorEquipo(disponibles[0]);
    }
  }, [
    equipos,
    mostrarFormularioEquipo,
    coloresDisponiblesInicial,
    nuevoColorEquipo,
  ]);
  // Fin Regular Behaviour *

  const comenzarCampeonato = () => {
    if (
      equipos.length > 0 &&
      equipos.every((equipo) => equipo.corredores.length === 2)
    ) {
      setFaseCreacionEquipos(false);
      setEtapaActual(1);
      setActiveTab("Etapa 1");
      if (!resultadosPorEtapa[1]) {
        setResultadosPorEtapa({
          1: { individual: [], puntos: { regularidad: [], montaña: [] } },
        });
      }
    } else if (equipos.length === 0) {
      alert("Debes crear al menos un equipo para comenzar el campeonato.");
    } else {
      alert("Todos los equipos deben tener dos corredores para comenzar.");
    }
  };

  const asignarOrdenLlegadaYTourPoints = (etapaResultados) => {
    if (!etapaResultados?.individual) {
      return etapaResultados;
    }

    // 1. Ordenar por tiempo y luego por ultimoUpdate
    const clasificacionEtapa = [...etapaResultados.individual].sort((a, b) => {
      if (a.tiempo !== b.tiempo) {
        return a.tiempo - b.tiempo;
      }
      return a.ultimoUpdate - b.ultimoUpdate;
    });

    // 2. Asignar orden de llegada
    const resultadosConOrden = clasificacionEtapa.map((resultado, index) => ({
      ...resultado,
      ordenLlegada: index + 1,
    }));

    // 3. Asignar Tour Points a los tres primeros
    const puntosTour = {};
    if (resultadosConOrden.length > 0)
      puntosTour[resultadosConOrden[0].corredor] = 3;
    if (resultadosConOrden.length > 1)
      puntosTour[resultadosConOrden[1].corredor] = 2;
    if (resultadosConOrden.length > 2)
      puntosTour[resultadosConOrden[2].corredor] = 1;

    return {
      ...etapaResultados,
      individual: resultadosConOrden,
      puntosTour: puntosTour, // Guardamos los puntos Tour de esta etapa
    };
  };

  const actualizarClasificacionesTotalesConTourPoints = (
    etapa,
    resultadosEtapaConPuntosTour
  ) => {
    console.log("Actualizando puntos tour para la etapa:", etapa);
    console.log(
      "Resultados de la etapa con puntos tour:",
      resultadosEtapaConPuntosTour
    );

    setClasificacionesTotales((prevTotales) => {
      const nuevosTotales = { ...prevTotales };
      const puntosEtapa = resultadosEtapaConPuntosTour?.puntosTour || {};
      console.log("Puntos de la etapa a aplicar:", puntosEtapa);

      if (!nuevosTotales.tour) {
        nuevosTotales.tour = {};
      }

      for (const corredor in puntosEtapa) {
        nuevosTotales.tour[corredor] =
          (nuevosTotales.tour[corredor] || 0) + puntosEtapa[corredor];
      }
      console.log("Nuevos Totales (con tour points):", nuevosTotales);
      return nuevosTotales;
    });
  };

  const procesarEtapa = (etapa) => {
    const resultadosEtapaAnterior = resultadosPorEtapa[etapa];

    if (resultadosEtapaAnterior) {
      const resultadosProcesados = asignarOrdenLlegadaYTourPoints(
        resultadosEtapaAnterior
      );

      setResultadosPorEtapa((prev) => ({
        ...prev,
        [etapa]: {
          ...prev[etapa],
          ...resultadosProcesados,
        },
      }));

      actualizarClasificacionesTotalesConTourPoints(
        etapa,
        resultadosProcesados
      );
    }
  };

  const avanzarEtapa = () => {
    setEtapaActual((prevEtapa) => {
      const etapaFinalizada = prevEtapa;
      const nuevaEtapa = prevEtapa + 1;

      if (etapaFinalizada > 0) {
        procesarEtapa(etapaFinalizada);
      }

      setActiveTab(`Etapa ${nuevaEtapa}`);
      if (!resultadosPorEtapa[nuevaEtapa]) {
        setResultadosPorEtapa((prev) => ({
          ...prev,
          [nuevaEtapa]: {
            individual: [],
            puntos: { regularidad: [], montaña: [] },
          },
        }));
      }
      return nuevaEtapa;
    });
  };

  const retrocederEtapa = () => {
    setEtapaActual((prevEtapa) => {
      const nuevaEtapa = Math.max(1, prevEtapa - 1); // Aseguramos no bajar de la etapa 1
      setActiveTab(`Etapa ${nuevaEtapa}`);
      return nuevaEtapa;
    });
  };

  const handleDescanso = () => {
    if (etapaActual > 0) {
      // 1. Simular el avance de etapa llamando a la función existente
      avanzarEtapa();

      // 2. Calcular y otorgar puntos tour por liderato en la etapa de descanso
      const numeroDescanso =
        Object.keys(resultadosPorEtapa).filter((etapa) =>
          etapa.startsWith("Rest ")
        ).length + 1;
      const etapaDescanso = `Rest ${etapaActual} - Descanso ${numeroDescanso}`; // Usamos la etapa actual como referencia para el descanso
      const puntosDescanso = {};
      const lideresDescanso = [];

      // Determinar los líderes actuales (después de "avanzar" a la etapa de descanso)
      const liderGeneral = Object.keys(clasificacionesTotales.general)[0];
      const liderMontaña = Object.keys(clasificacionesTotales.montaña).sort(
        (a, b) =>
          clasificacionesTotales.montaña[b] - clasificacionesTotales.montaña[a]
      )[0];
      const liderRegularidad = Object.keys(
        clasificacionesTotales.regularidad
      ).sort(
        (a, b) =>
          clasificacionesTotales.regularidad[b] -
          clasificacionesTotales.regularidad[a]
      )[0];

      if (liderGeneral) {
        puntosDescanso[liderGeneral] = (puntosDescanso[liderGeneral] || 0) + 1;
        lideresDescanso.push({
          clasificacion: "General",
          corredor: liderGeneral,
          puntos: 1,
        });
      }
      if (liderMontaña && liderMontaña !== liderGeneral) {
        puntosDescanso[liderMontaña] = (puntosDescanso[liderMontaña] || 0) + 1;
        lideresDescanso.push({
          clasificacion: "Montaña",
          corredor: liderMontaña,
          puntos: 1,
        });
      } else if (liderMontaña && liderMontaña === liderGeneral) {
        puntosDescanso[liderMontaña]++;
        lideresDescanso.push({
          clasificacion: "Montaña",
          corredor: liderMontaña,
          puntos: 1,
        });
      }
      if (
        liderRegularidad &&
        liderRegularidad !== liderGeneral &&
        liderRegularidad !== liderMontaña
      ) {
        puntosDescanso[liderRegularidad] =
          (puntosDescanso[liderRegularidad] || 0) + 1;
        lideresDescanso.push({
          clasificacion: "Regularidad",
          corredor: liderRegularidad,
          puntos: 1,
        });
      } else if (
        liderRegularidad &&
        (liderRegularidad === liderGeneral || liderRegularidad === liderMontaña)
      ) {
        puntosDescanso[liderRegularidad]++;
        lideresDescanso.push({
          clasificacion: "Regularidad",
          corredor: liderRegularidad,
          puntos: 1,
        });
      }

      setResultadosPorEtapa((prevResultados) => ({
        ...prevResultados,
        [etapaDescanso]: {
          puntosTour: puntosDescanso,
          lideresDescanso: lideresDescanso,
        },
      }));

      setActiveTab(etapaDescanso);

      // Actualizar las clasificaciones totales con los puntos del descanso
      actualizarClasificacionesTotalesConTourPoints(etapaDescanso, {
        puntosTour: puntosDescanso,
      });
    } else {
      alert(
        "Debes avanzar al menos una etapa antes de poder tener un descanso."
      );
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleAddTime = (etapa, corredorNombre, tiempo) => {
    setResultadosPorEtapa((prev) => {
      const etapaResultados = { ...prev[etapa] };
      const existingResultadoIndex = etapaResultados.individual?.findIndex(
        (r) => r.corredor === corredorNombre
      );
      const now = Date.now(); // Registrar el timestamp de la actualización

      if (existingResultadoIndex > -1) {
        etapaResultados.individual[existingResultadoIndex].tiempo =
          (etapaResultados.individual[existingResultadoIndex].tiempo || 0) +
          tiempo;
        etapaResultados.individual[existingResultadoIndex].ultimoUpdate = now; // Guardar el timestamp
      } else {
        etapaResultados.individual?.push({
          corredor: corredorNombre,
          tiempo: tiempo,
          ultimoUpdate: now, // Guardar el timestamp
          ordenLlegada: null, // Inicializar orden de llegada
        });
      }
      return { ...prev, [etapa]: etapaResultados };
    });
  };

  const calcularClasificacionesTotales = (equipos, resultados) => {
    const totales = { general: {}, regularidad: {}, montaña: {} };

    equipos.forEach((equipo) => {
      equipo.corredores.forEach((corredor) => {
        totales.general[corredor.nombre] = { tiempoTotal: 0 };
        totales.regularidad[corredor.nombre] = 0;
        totales.montaña[corredor.nombre] = 0;
      });
    });

    for (const etapa in resultados) {
      const resultadosEtapa = resultados[etapa];
      resultadosEtapa?.individual?.forEach((resultado) => {
        if (totales.general[resultado.corredor]) {
          totales.general[resultado.corredor].tiempoTotal +=
            resultado.tiempo || 0;
        }
      });
      resultadosEtapa?.puntos?.regularidad?.forEach(({ corredor, puntos }) => {
        if (totales.regularidad[corredor] !== undefined) {
          totales.regularidad[corredor] += puntos;
        }
      });
      resultadosEtapa?.puntos?.montaña?.forEach(({ corredor, puntos }) => {
        if (totales.montaña[corredor] !== undefined) {
          totales.montaña[corredor] += puntos;
        }
      });
    }

    // Ordenar las clasificaciones (como antes)
    totales.general = Object.entries(totales.general)
      .sort(([, a], [, b]) => a.tiempoTotal - b.tiempoTotal)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    totales.regularidad = Object.entries(totales.regularidad)
      .sort(([, a], [, b]) => b - a)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    totales.montaña = Object.entries(totales.montaña)
      .sort(([, a], [, b]) => b - a)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    // **MODIFICACIÓN CRUCIAL: Incluir los Tour Points acumulados**
    return { ...totales, tour: clasificacionesTotales.tour };
  };

  const handleAddScore = (etapa, corredorNombre, tipoPunto, puntos) => {
    setResultadosPorEtapa((prev) => {
      const etapaResultados = { ...prev[etapa] };
      if (!etapaResultados.puntos) {
        etapaResultados.puntos = { regularidad: [], montaña: [] };
      }
      const existingScoreIndex = etapaResultados.puntos[tipoPunto]?.findIndex(
        (s) => s.corredor === corredorNombre
      );
      if (existingScoreIndex > -1) {
        etapaResultados.puntos[tipoPunto][existingScoreIndex].puntos += puntos;
      } else {
        etapaResultados.puntos[tipoPunto]?.push({
          corredor: corredorNombre,
          puntos,
        });
      }
      return { ...prev, [etapa]: etapaResultados };
    });
  };

  const handleSubtractScore = (etapa, corredorNombre, tipoPunto, puntos) => {
    setResultadosPorEtapa((prev) => {
      const etapaResultados = { ...prev[etapa] };
      if (etapaResultados.puntos?.[tipoPunto]) {
        const existingScoreIndex = etapaResultados.puntos[tipoPunto].findIndex(
          (s) => s.corredor === corredorNombre
        );
        if (existingScoreIndex > -1) {
          etapaResultados.puntos[tipoPunto][existingScoreIndex].puntos -=
            puntos;
          if (
            etapaResultados.puntos[tipoPunto][existingScoreIndex].puntos < 0
          ) {
            etapaResultados.puntos[tipoPunto][existingScoreIndex].puntos = 0; // Evitar puntos negativos
          }
        }
      }
      return { ...prev, [etapa]: etapaResultados };
    });
  };

  const handleFinal = () => {
    procesarEtapa(etapaActual);
    setMostrarClasificacionFinal(true);
    useState(false);

    const generalFinal = Object.entries(clasificacionesTotales.general)
      .sort(([, a], [, b]) => a - b) // Ordenar por tiempo ascendente
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    const regularidadFinal = Object.entries(clasificacionesTotales.regularidad)
      .sort(([, a], [, b]) => b - a) // Ordenar por puntos descendente
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    const montañaFinal = Object.entries(clasificacionesTotales.montaña)
      .sort(([, a], [, b]) => b - a) // Ordenar por puntos descendente
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    setClasificacionesFinales({
      general: generalFinal,
      regularidad: regularidadFinal,
      montaña: montañaFinal,
    });

    setActiveTab("Clasificación Final");
  };

  const handleCrearEquipo = (event) => {
    event.preventDefault();
    if (nuevoColorEquipo) {
      const nombreEquipo =
        nuevoNombreEquipo.trim() === ""
          ? `Equipo ${
              nuevoColorEquipo.charAt(0).toUpperCase() +
              nuevoColorEquipo.slice(1)
            }`
          : nuevoNombreEquipo;
      const nombreRodador =
        nuevoNombreRodador.trim() === ""
          ? `Rodador ${
              nuevoColorEquipo.charAt(0).toUpperCase() +
              nuevoColorEquipo.slice(1)
            }`
          : nuevoNombreRodador;
      const nombreSprinter =
        nuevoNombreSprinter.trim() === ""
          ? `Sprinter ${
              nuevoColorEquipo.charAt(0).toUpperCase() +
              nuevoColorEquipo.slice(1)
            }`
          : nuevoNombreSprinter;

      const nuevoEquipo = {
        nombre: nombreEquipo,
        color: nuevoColorEquipo,
        corredores: [
          {
            nombre: nombreSprinter,
            tipo: "sprinter",
            tiempos: [],
            puntos: { tour: [], regularidad: [], montaña: [] },
          },
          {
            nombre: nombreRodador,
            tipo: "rodador",
            tiempos: [],
            puntos: { tour: [], regularidad: [], montaña: [] },
          },
        ],
      };

      setEquipos((prevEquipos) => {
        const updatedEquipos = [...prevEquipos, nuevoEquipo];
        return updatedEquipos;
      });

      setNuevoNombreEquipo("");
      setNuevoColorEquipo("");
      setNuevoNombreRodador("");
      setNuevoNombreSprinter("");
      setMostrarFormularioEquipo(false);
    } else {
      alert("Por favor, selecciona un color para el equipo.");
    }
  };

  const handleMostrarFormularioEquipo = () => {
    setMostrarFormularioEquipo((prev) => !prev);
    if (mostrarFormularioEquipo) {
      setNuevoColorEquipo(""); // Resetea el color al ocultar el formulario (opcional)
    }
  };

  const tabs = [
    {
      name: "Equipos",
      component: (
        <div>
          <button onClick={handleMostrarFormularioEquipo}>
            {mostrarFormularioEquipo
              ? "Ocultar Formulario Equipo"
              : "Crear Nuevo Equipo"}
          </button>

          {mostrarFormularioEquipo && (
            <form
              onSubmit={handleCrearEquipo}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>Crear Nuevo Equipo</h3>
              <div>
                <label htmlFor="nombreEquipo">
                  Nombre del Equipo{" "}
                  <span style={{ color: nuevoColorEquipo }}>
                    {nuevoColorEquipo ? `(${nuevoColorEquipo})` : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreEquipo"
                  value={nuevoNombreEquipo}
                  onChange={(e) => setNuevoNombreEquipo(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="colorEquipo">Color del Equipo:</label>
                <select
                  id="colorEquipo"
                  value={nuevoColorEquipo}
                  onChange={(e) => setNuevoColorEquipo(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecciona un color
                  </option>
                  {coloresDisponibles.map((color) => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="nombreRodador">
                  Rodador{" "}
                  <span style={{ color: nuevoColorEquipo }}>
                    {nuevoColorEquipo ? `(${nuevoColorEquipo})` : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreRodador"
                  value={nuevoNombreRodador}
                  onChange={(e) => setNuevoNombreRodador(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="nombreSprinter">
                  Sprinter{" "}
                  <span style={{ color: nuevoColorEquipo }}>
                    {nuevoColorEquipo ? `(${nuevoColorEquipo})` : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreSprinter"
                  value={nuevoNombreSprinter}
                  onChange={(e) => setNuevoNombreSprinter(e.target.value)}
                />
              </div>
              <button type="submit">Crear Equipo</button>
            </form>
          )}

          <h2>Equipos Creados:</h2>
          <ul>
            {equipos.map((equipo) => (
              <li
                key={equipo.nombre}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: "bold", marginRight: "5px" }}>
                  {equipo.nombre}
                </span>
                <div
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    backgroundColor: equipo.color,
                    border: "1px solid #ccc",
                    marginRight: "5px",
                  }}
                ></div>
                <span
                  style={{
                    backgroundColor: equipo.color,
                    color: equipo.color === "blanco" ? "black" : "white",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    fontSize: "0.8em",
                  }}
                >
                  ({equipo.color})
                </span>
                <ul>
                  {equipo.corredores.map((corredor) => (
                    <li key={corredor.nombre}>
                      {corredor.nombre} ({corredor.tipo})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {equipos.length > 0 && faseCreacionEquipos && (
            <button
              onClick={comenzarCampeonato}
              style={{
                padding: "10px 15px",
                fontSize: "1.1em",
                cursor: "pointer",
              }}
            >
              Comenzar Campeonato
            </button>
          )}
        </div>
      ),
    },
  ];

  if (!faseCreacionEquipos) {
    for (let i = 1; i <= etapaActual; i++) {
      tabs.push({
        name: `Etapa ${i}`,
        component: (
          <StageTabs
            key={i}
            etapaActual={etapaActual}
            equipos={equipos}
            resultadosPorEtapa={resultadosPorEtapa}
            clasificacionesTotales={clasificacionesTotales}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            onAddTime={handleAddTime}
            onAddScore={handleAddScore}
            onSubtractScore={handleSubtractScore}
          />
        ),
      });

      // Verificar si hay un descanso asociado a esta etapa para renderizar la pestaña después
      const descansoDespuesEtapa = Object.keys(resultadosPorEtapa).find((key) =>
        key.startsWith(`Rest ${i} - Descanso`)
      );
      if (descansoDespuesEtapa) {
        const nombrePestanaDescanso =
          descansoDespuesEtapa.split(" - ")[1] || "Descanso";
        tabs.push({
          name: nombrePestanaDescanso,
          component: (
            <div key={descansoDespuesEtapa}>
              <h3>{nombrePestanaDescanso}</h3>
              <h4>Líderes de las clasificaciones y puntos Tour obtenidos:</h4>
              <ul>
                {resultadosPorEtapa[descansoDespuesEtapa]?.lideresDescanso?.map(
                  (lider) => (
                    <li
                      key={`${descansoDespuesEtapa}-${lider.corredor}-${lider.clasificacion}`}
                    >
                      <strong>{lider.clasificacion}:</strong> {lider.corredor}{" "}
                      (TP: {lider.puntos})
                    </li>
                  )
                )}
              </ul>
            </div>
          ),
        });
      }
    }

    if (etapaActual > 1) {
      tabs.push({
        name: "Clasificaciones",
        component: (
          <TotalClassificationTab
            clasificacionesTotales={clasificacionesTotales}
            equipos={equipos}
          />
        ),
      });
    }

    if (mostrarClasificacionFinal) {
      tabs.push({
        name: "Clasificación Final",
        component: (
          <FinalClassificationTab
            resultadosPorEtapa={resultadosPorEtapa}
            clasificacionesFinales={clasificacionesFinales}
            equipos={equipos}
            numeroEtapas={etapaActual}
          />
        ),
      });
    }
  }

  return (
    <div className="app">
      <h1>Campeonato</h1>

      {faseCreacionEquipos ? (
        <div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              alignItems: "center",
            }}
          >
            <button onClick={handleMostrarFormularioEquipo}>
              {mostrarFormularioEquipo
                ? "Ocultar Formulario Equipo"
                : "Crear Nuevo Equipo"}
            </button>
            {equipos.length > 0 && faseCreacionEquipos && (
              <button
                onClick={comenzarCampeonato}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  fontSize: "0.9em",
                }}
              >
                Comenzar Campeonato
              </button>
            )}
          </div>

          {mostrarFormularioEquipo && (
            <form
              onSubmit={handleCrearEquipo}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>Crear Nuevo Equipo</h3>
              <div>
                <label htmlFor="nombreEquipo">
                  Nombre del Equipo{" "}
                  <span style={{ color: nuevoColorEquipo }}>
                    {nuevoColorEquipo ? `(${nuevoColorEquipo})` : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreEquipo"
                  value={nuevoNombreEquipo}
                  onChange={(e) => setNuevoNombreEquipo(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="colorEquipo">Color del Equipo:</label>
                <select
                  id="colorEquipo"
                  value={nuevoColorEquipo}
                  onChange={(e) => setNuevoColorEquipo(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecciona un color
                  </option>
                  {coloresDisponibles.map((color) => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="nombreRodador">
                  Rodador{" "}
                  <span style={{ color: nuevoColorEquipo }}>
                    {nuevoColorEquipo ? `(${nuevoColorEquipo})` : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreRodador"
                  value={nuevoNombreRodador}
                  onChange={(e) => setNuevoNombreRodador(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="nombreSprinter">
                  Sprinter{" "}
                  <span style={{ color: nuevoColorEquipo }}>
                    {nuevoColorEquipo ? `(${nuevoColorEquipo})` : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreSprinter"
                  value={nuevoNombreSprinter}
                  onChange={(e) => setNuevoNombreSprinter(e.target.value)}
                />
              </div>
              <button type="submit">Crear Equipo</button>
            </form>
          )}

          <h2>Equipos Creados:</h2>
          <ul>
            {equipos.map((equipo) => (
              <li key={equipo.nombre}>
                <span style={{ fontWeight: "bold" }}>{equipo.nombre} </span>
                <span
                  style={{
                    backgroundColor: equipo.color,
                    color: equipo.color === "white" ? "black" : "white",
                    padding: "2px 5px",
                  }}
                >
                  ({equipo.color})
                </span>
                <ul>
                  {equipo.corredores.map((corredor) => (
                    <li key={corredor.nombre}>
                      {corredor.nombre} ({corredor.tipo})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <ul className="stage-tabs">
            {tabs.map((tab) => (
              <li
                key={tab.name}
                className={activeTab === tab.name ? "active" : ""}
                onClick={() => handleTabClick(tab.name)}
              >
                {tab.name}
              </li>
            ))}
          </ul>
          <div className="tab-content">
            {tabs.map(
              (tab) =>
                activeTab === tab.name && (
                  <div key={tab.name}>{tab.component}</div>
                )
            )}
          </div>
          {!mostrarClasificacionFinal > 0 && (
            <ControlPanel
              etapaActual={etapaActual}
              onAvanzarEtapa={avanzarEtapa}
              onRetrocederEtapa={retrocederEtapa}
              onDescanso={handleDescanso}
              onFinal={handleFinal}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
