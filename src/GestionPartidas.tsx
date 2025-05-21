import React, { useReducer, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  cargarEstadoFirebase,
  buscarPartidaSoloLectura,
} from "./utils/firebaseUtils";
import ControlPanel from "./components/ControlPanel";
import StageTabs from "./components/StageTabs";
import TotalClassificationTab from "./components/TotalClassificationTab";
import FinalClassificationTab from "./components/FinalClassificationTab";
import { calcularClasificacionesTotales } from "./utils/clasificacionesTotales";
import { initialState, reducer } from "./state/reducer";
import { guardarEstadoFirebase } from "./utils/firebaseUtils";
import "./GestionPartidas.css";

const GestionPartidas: React.FC<{
  modoCarga: "inicio" | "seguir" | "lectura";
}> = ({ modoCarga }) => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Y luego en tu useEffect:
  useEffect(() => {
    const cargar = async () => {
      if (modoCarga === "inicio") {
        dispatch({ type: "REEMPLAZAR_ESTADO_COMPLETO", payload: initialState });
      } else if (modoCarga === "seguir" && id) {
        const datos = await cargarEstadoFirebase(id, initialState);
        if (datos)
          dispatch({ type: "REEMPLAZAR_ESTADO_COMPLETO", payload: datos });
      } else if (modoCarga === "lectura" && id) {
        const datos = await buscarPartidaSoloLectura(id, initialState);
        if (datos)
          dispatch({ type: "REEMPLAZAR_ESTADO_COMPLETO", payload: datos });
      }
    };
    cargar();
  }, [modoCarga, id]);

  // Resto de useEffect y lógica, ahora que state ya existe
  useEffect(() => {
    if (state.etapaActual > 0) {
      const totales = calcularClasificacionesTotales(
        state.equipos,
        state.resultadosPorEtapa,
        state.clasificacionesTotales.tour
      );

      const iguales =
        JSON.stringify(state.clasificacionesTotales) ===
        JSON.stringify(totales);

      if (!iguales) {
        dispatch({
          type: "ACTUALIZAR_CLASIFICACIONES_TOTALES",
          payload: totales,
        });
      }
    }
  }, [
    state.resultadosPorEtapa,
    state.equipos,
    state.etapaActual,
    state.clasificacionesTotales.tour,
  ]);

  useEffect(() => {
    const coloresUsados = state.equipos.map((equipo) => equipo.color);
    const disponibles = state.coloresDisponiblesInicial.filter(
      (color) => !coloresUsados.includes(color)
    );

    const sonIguales =
      disponibles.length === state.coloresDisponibles.length &&
      disponibles.every((color, i) => color === state.coloresDisponibles[i]);

    if (!sonIguales) {
      dispatch({
        type: "ACTUALIZAR_NUEVO_EQUIPO",
        payload: { campo: "color", valor: disponibles[0] },
      });
    }

    const colorActualNoDisponible =
      !state.nuevoEquipo.color ||
      !disponibles.includes(state.nuevoEquipo.color);

    if (
      state.mostrarFormularioEquipo &&
      colorActualNoDisponible &&
      disponibles.length > 0
    ) {
      if (state.nuevoEquipo.color !== disponibles[0]) {
        dispatch({
          type: "ACTUALIZAR_NUEVO_EQUIPO",
          payload: { campo: "color", valor: disponibles[0] },
        });
      }
    }
  }, [
    state.equipos,
    state.mostrarFormularioEquipo,
    state.coloresDisponiblesInicial,
    state.coloresDisponibles,
  ]);

  const comenzarCampeonato = () => {
    dispatch({ type: "COMENZAR_CAMPEONATO" });
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
    { puntosTour }
  ) => {
    dispatch({
      type: "ACTUALIZAR_TOUR_POINTS",
      payload: {
        etapa,
        puntosTour,
      },
    });
  };

  const procesarEtapa = (etapa) => {
    const resultadosEtapaAnterior = state.resultadosPorEtapa[etapa];
    if (!resultadosEtapaAnterior) return;

    const resultadosProcesados = asignarOrdenLlegadaYTourPoints(
      resultadosEtapaAnterior
    );
    console.log(resultadosProcesados);
    dispatch({
      type: "PROCESAR_RESULTADOS_ETAPA",
      payload: {
        etapa,
        resultadosProcesados,
      },
    });

    dispatch({
      type: "ACTUALIZAR_TOUR_POINTS",
      payload: {
        etapa,
        puntosTour: resultadosProcesados.puntosTour || {},
      },
    });
  };

  const avanzarEtapa = () => {
    procesarEtapa(state.etapaActual);
    dispatch({ type: "AVANZAR_ETAPA" });
  };

  const retrocederEtapa = () => {
    dispatch({ type: "RETROCEDER_ETAPA" });
  };

  const handleDescanso = () => {
    if (state.etapaActual > 0) {
      // 1. Simular el avance de etapa llamando a la función existente
      procesarEtapa(state.etapaActual);

      // 2. Calcular y otorgar puntos tour por liderato en la etapa de descanso
      const numeroDescanso =
        Object.keys(state.resultadosPorEtapa).filter((etapa) =>
          etapa.startsWith("Rest ")
        ).length + 1;
      const etapaDescanso = `Rest ${state.etapaActual} - Descanso ${numeroDescanso}`; // Usamos la etapa actual como referencia para el descanso
      const puntosDescanso = {};
      const lideresDescanso = [];

      // Determinar los líderes actuales (después de "avanzar" a la etapa de descanso)
      const liderGeneral = Object.keys(state.clasificacionesTotales.general)[0];
      const liderMontaña = Object.keys(
        state.clasificacionesTotales.montaña
      ).sort(
        (a, b) =>
          state.clasificacionesTotales.montaña[b] -
          state.clasificacionesTotales.montaña[a]
      )[0];
      const lidersprint = Object.keys(state.clasificacionesTotales.sprint).sort(
        (a, b) =>
          state.clasificacionesTotales.sprint[b] -
          state.clasificacionesTotales.sprint[a]
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
        lidersprint &&
        lidersprint !== liderGeneral &&
        lidersprint !== liderMontaña
      ) {
        puntosDescanso[lidersprint] = (puntosDescanso[lidersprint] || 0) + 1;
        lideresDescanso.push({
          clasificacion: "sprint",
          corredor: lidersprint,
          puntos: 1,
        });
      } else if (
        lidersprint &&
        (lidersprint === liderGeneral || lidersprint === liderMontaña)
      ) {
        puntosDescanso[lidersprint]++;
        lideresDescanso.push({
          clasificacion: "sprint",
          corredor: lidersprint,
          puntos: 1,
        });
      }

      dispatch({
        type: "PROCESAR_RESULTADOS_ETAPA",
        payload: {
          etapa: etapaDescanso,
          resultadosProcesados: {
            puntosTour: puntosDescanso,
            lideresDescanso: lideresDescanso,
          },
        },
      });

      dispatch({ type: "CAMBIAR_TAB", payload: etapaDescanso.split(" - ")[1] });

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
    dispatch({ type: "CAMBIAR_TAB", payload: tabName });
  };

  const handleAddTime = (etapa, corredorNombre, tiempo) => {
    dispatch({
      type: "AÑADIR_TIEMPO_CORREDOR",
      payload: { etapa, corredorNombre, tiempo },
    });
  };

  const handleAddScore = (etapa, corredorNombre, tipoPunto, puntos) => {
    dispatch({
      type: "AÑADIR_PUNTOS_CORREDOR",
      payload: { etapa, corredorNombre, tipoPunto, puntos },
    });
  };

  const handleSubtractScore = (etapa, corredorNombre, tipoPunto, puntos) => {
    dispatch({
      type: "RESTAR_PUNTOS_CORREDOR",
      payload: { etapa, corredorNombre, tipoPunto, puntos },
    });
  };

  const handleFinal = () => {
    procesarEtapa(state.etapaActual);
    dispatch({ type: "FINALIZAR_CAMPEONATO" });
  };

  const handleCrearEquipo = (event) => {
    event.preventDefault();

    if (!state.nuevoEquipo.color) {
      alert("Por favor, selecciona un color para el equipo.");
      return;
    }

    const nombreEquipo =
      state.nuevoEquipo.nombre ||
      `Equipo ${
        state.nuevoEquipo.color[0].toUpperCase() +
        state.nuevoEquipo.color.slice(1)
      }`;
    const nombreRodador =
      state.nuevoEquipo.rodador.trim() ||
      `Rodador ${
        state.nuevoEquipo.color[0].toUpperCase() +
        state.nuevoEquipo.color.slice(1)
      }`;
    const nombreSprinter =
      state.nuevoEquipo.sprinter.trim() ||
      `Sprinter ${
        state.nuevoEquipo.color[0].toUpperCase() +
        state.nuevoEquipo.color.slice(1)
      }`;

    dispatch({
      type: "CREAR_EQUIPO",
      payload: {
        nombre: nombreEquipo,
        color: state.nuevoEquipo.color,
        rodador: nombreRodador,
        sprinter: nombreSprinter,
      },
    });

    dispatch({ type: "RESETEAR_FORMULARIO_EQUIPO" });
  };

  const handleMostrarFormularioEquipo = () => {
    dispatch({ type: "TOGGLE_FORMULARIO_EQUIPO" });

    if (state.mostrarFormularioEquipo) {
      dispatch({
        type: "ACTUALIZAR_NUEVO_EQUIPO",
        payload: { campo: "color", valor: "" },
      });
    }
  };

  const handleGuardar = async () => {
    await guardarEstadoFirebase(state, dispatch);
  };

  const tabs = [
    {
      name: "Equipos",
      component: (
        <div>
          {state.faseCreacionEquipos && (
            <button onClick={handleMostrarFormularioEquipo}>
              {state.mostrarFormularioEquipo
                ? "Ocultar Formulario Equipo"
                : "Crear Nuevo Equipo"}
            </button>
          )}

          {state.mostrarFormularioEquipo && (
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
                  <span style={{ color: state.nuevoEquipo.color }}>
                    {state.nuevoEquipo.color
                      ? `(${state.nuevoEquipo.color})`
                      : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreEquipo"
                  value={state.nuevoEquipo.nombre}
                  onChange={(e) =>
                    dispatch({
                      type: "ACTUALIZAR_NUEVO_EQUIPO",
                      payload: { campo: "nombre", valor: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="colorEquipo">Color del Equipo:</label>
                <select
                  id="colorEquipo"
                  value={state.nuevoEquipo.color}
                  onChange={(e) =>
                    dispatch({
                      type: "ACTUALIZAR_NUEVO_EQUIPO",
                      payload: { campo: "color", valor: e.target.value },
                    })
                  }
                  required
                >
                  <option value="" disabled>
                    Selecciona un color
                  </option>
                  {state.coloresDisponibles.map((color) => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="nombreRodador">
                  Rodador{" "}
                  <span style={{ color: state.nuevoEquipo.color }}>
                    {state.nuevoEquipo.color
                      ? `(${state.nuevoEquipo.color})`
                      : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreRodador"
                  value={state.nuevoEquipo.rodador}
                  onChange={(e) =>
                    dispatch({
                      type: "ACTUALIZAR_NUEVO_EQUIPO",
                      payload: {
                        campo: "state.nuevoEquipo.rodador",
                        valor: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="nombreSprinter">
                  Sprinter{" "}
                  <span style={{ color: state.nuevoEquipo.color }}>
                    {state.nuevoEquipo.color
                      ? `(${state.nuevoEquipo.color})`
                      : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreSprinter"
                  value={state.nuevoEquipo.sprinter}
                  onChange={(e) =>
                    dispatch({
                      type: "ACTUALIZAR_NUEVO_EQUIPO",
                      payload: {
                        campo: "state.nuevoEquipo.sprinter",
                        valor: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <button type="submit">Crear Equipo</button>
            </form>
          )}

          <h2>Equipos Creados:</h2>
          <ul>
            {state.equipos.map((equipo) => (
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
                    color: equipo.color === "white" ? "black" : "white",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    fontSize: "0.8em",
                  }}
                >
                  ({equipo.color})
                </span>
                <ul>
                  <li key={equipo.rodador.nombre}>
                    {equipo.rodador.nombre} ({equipo.rodador.tipo})
                  </li>
                  <li key={equipo.sprinter.nombre}>
                    {equipo.sprinter.nombre} ({equipo.sprinter.tipo})
                  </li>
                </ul>
              </li>
            ))}
          </ul>

          {state.equipos.length > 0 && state.faseCreacionEquipos && (
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

  if (!state.faseCreacionEquipos) {
    for (let i = 1; i <= state.etapaActual; i++) {
      tabs.push({
        name: `Etapa ${i}`,
        component: (
          <StageTabs
            key={i}
            equipos={state.equipos}
            resultadosPorEtapa={state.resultadosPorEtapa}
            clasificacionesTotales={state.clasificacionesTotales}
            permisosEscritura={state.permisosEscritura}
            activeTab={state.activeTab}
            onAddTime={handleAddTime}
            onAddScore={handleAddScore}
          />
        ),
      });

      // Verificar si hay un descanso asociado a esta etapa para renderizar la pestaña después
      const descansoDespuesEtapa = Object.keys(state.resultadosPorEtapa).find(
        (key) => key.startsWith(`Rest ${i} - Descanso`)
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
                {state.resultadosPorEtapa[
                  descansoDespuesEtapa
                ]?.lideresDescanso?.map((lider) => (
                  <li
                    key={`${descansoDespuesEtapa}-${lider.corredor}-${lider.clasificacion}`}
                  >
                    <strong>{lider.clasificacion}:</strong> {lider.corredor}{" "}
                    (TP: {lider.puntos})
                  </li>
                ))}
              </ul>
            </div>
          ),
        });
      }
    }

    if (state.etapaActual > 1) {
      tabs.push({
        name: "Clasificaciones",
        component: (
          <TotalClassificationTab
            clasificacionesTotales={state.clasificacionesTotales}
            equipos={state.equipos}
          />
        ),
      });
    }

    if (state.mostrarClasificacionFinal) {
      tabs.push({
        name: "Clasificación Final",
        component: (
          <FinalClassificationTab
            resultadosPorEtapa={state.resultadosPorEtapa}
            clasificacionesFinales={state.clasificacionesFinales}
            equipos={state.equipos}
            numeroEtapas={state.etapaActual}
          />
        ),
      });
    }
  }
  const handleModalEnlaces = () => {
    dispatch({ type: "MOSTRAR_MODAL_ENLACES" });
  };

  return (
    <div className="app">
      <h1>Campeonato</h1>

      {state.faseCreacionEquipos ? (
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
              {state.mostrarFormularioEquipo
                ? "Ocultar Formulario Equipo"
                : "Crear Nuevo Equipo"}
            </button>
            {state.equipos.length > 0 && state.faseCreacionEquipos && (
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

          {state.mostrarFormularioEquipo && (
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
                  <span style={{ color: state.nuevoEquipo.color }}>
                    {state.nuevoEquipo.color
                      ? `(${state.nuevoEquipo.color})`
                      : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreEquipo"
                  value={state.nuevoEquipo.nombre}
                  onChange={(e) =>
                    dispatch({
                      type: "ACTUALIZAR_NUEVO_EQUIPO",
                      payload: { campo: "nombre", valor: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="colorEquipo">Color del Equipo:</label>
                <select
                  id="colorEquipo"
                  value={state.nuevoEquipo.color}
                  onChange={(e) =>
                    dispatch({
                      type: "ACTUALIZAR_NUEVO_EQUIPO",
                      payload: { campo: "color", valor: e.target.value },
                    })
                  }
                  required
                >
                  <option value="" disabled>
                    Selecciona un color
                  </option>
                  {state.coloresDisponibles.map((color) => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="nombreRodador">
                  Rodador{" "}
                  <span style={{ color: state.nuevoEquipo.color }}>
                    {state.nuevoEquipo.color
                      ? `(${state.nuevoEquipo.color})`
                      : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreRodador"
                  value={state.nuevoEquipo.rodador}
                  onChange={(e) =>
                    dispatch({
                      type: "ACTUALIZAR_NUEVO_EQUIPO",
                      payload: { campo: "rodador", valor: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="nombreSprinter">
                  Sprinter{" "}
                  <span style={{ color: state.nuevoEquipo.color }}>
                    {state.nuevoEquipo.color
                      ? `(${state.nuevoEquipo.color})`
                      : ""}
                  </span>
                  :
                </label>
                <input
                  type="text"
                  id="nombreSprinter"
                  value={state.nuevoEquipo.sprinter}
                  onChange={(e) =>
                    dispatch({
                      type: "ACTUALIZAR_NUEVO_EQUIPO",
                      payload: { campo: "sprinter", valor: e.target.value },
                    })
                  }
                />
              </div>
              <button type="submit">Crear Equipo</button>
            </form>
          )}

          <h2>Equipos Creados:</h2>
          <ul>
            {state.equipos.map((equipo) => (
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
                  <li key={equipo.rodador.nombre}>
                    {equipo.rodador.nombre} ({equipo.rodador.tipo})
                  </li>
                  <li key={equipo.sprinter.nombre}>
                    {equipo.sprinter.nombre} ({equipo.sprinter.tipo})
                  </li>
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
                className={state.activeTab === tab.name ? "active" : ""}
                onClick={() => handleTabClick(tab.name)}
              >
                {tab.name}
              </li>
            ))}
          </ul>
          <div className="tab-content">
            {tabs.map(
              (tab) =>
                state.activeTab === tab.name && (
                  <div key={tab.name}>{tab.component}</div>
                )
            )}
          </div>
          {state.mostrarModalEnlaces && (
            <div className="modal-backdrop">
              <div className="modal">
                <h2>Compartir partida</h2>
                <p>
                  <strong>Permisos de edición:</strong>
                </p>
                <a
                  href={`${window.location.origin}/seguir/${state.idPartida}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${window.location.origin}/seguir/${state.idPartida}`}
                </a>

                <p>
                  <strong>Solo lectura:</strong>
                </p>
                <a
                  href={`${window.location.origin}/lectura/${state.idSoloLectura}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${window.location.origin}/lectura/${state.idSoloLectura}`}
                </a>

                <div style={{ marginTop: "1rem" }}>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/seguir/${state.idPartida}`
                      )
                    }
                  >
                    Copiar enlace de edición
                  </button>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/lectura/${state.idSoloLectura}`
                      )
                    }
                  >
                    Copiar enlace de lectura
                  </button>
                </div>

                <button
                  style={{ marginTop: "1rem" }}
                  onClick={() => dispatch({ type: "OCULTAR_MODAL_ENLACES" })}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
          {state.permisosEscritura && (
            <ControlPanel
              etapaActual={state.etapaActual}
              idPartida={state.idPartida}
              mostrarClasificacionFinal={state.mostrarClasificacionFinal}
              onAvanzarEtapa={avanzarEtapa}
              onRetrocederEtapa={retrocederEtapa}
              onDescanso={handleDescanso}
              onFinal={handleFinal}
              onGuardar={handleGuardar}
              onModalEnlaces={handleModalEnlaces}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GestionPartidas;
