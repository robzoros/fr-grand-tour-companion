import { ResultadoEtapa, Action, State, Equipo } from "./definitions"; 

export const initialState = {
  idSoloLectura: "",
  idPartida: "",
  permisosEscritura: true, 
  etapaActual: 0,
  resultadosPorEtapa: {},
  clasificacionesTotales: {
    general: {},
    regularidad: {},
    montaña: {},  
    tour: {},
  },
  equipos: [],
  clasificacionesFinales: null,
  activeTab: "Equipos",
  mostrarClasificacionFinal: false,

  nuevoEquipo: {
    nombre: "",
    color: "",
    rodador: "",
    sprinter: "",
  },
  
  mostrarFormularioEquipo: false,
  faseCreacionEquipos: true,
  mostrarModalEnlaces: false,
  coloresDisponiblesInicial: ["black", "white", "blue", "green", "red", "pink"],
  coloresDisponibles: ["black", "white", "blue", "green", "red", "pink"],
};

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case "REEMPLAZAR_ESTADO_COMPLETO":
      return action.payload;
    case "ACTUALIZAR_CLASIFICACIONES_TOTALES":
      return {
        ...state,
        clasificacionesTotales: action.payload,
      };
    case "ACTUALIZAR_COLORES_DISPONIBLES":
      return {
        ...state,
        coloresDisponibles: action.payload, // string[]
      };
    case "ACTUALIZAR_NUEVO_EQUIPO":
      return {
        ...state,
        nuevoEquipo: {
          ...state.nuevoEquipo,
          [action.payload.campo]: action.payload.valor,
        },
      };
    case "CAMBIAR_TAB":
      return {
        ...state,
        activeTab: action.payload,
      };
    case "AÑADIR_TIEMPO_CORREDOR": {
      const { etapa, corredorNombre, tiempo } = action.payload;
      const resultadosPrevios = state.resultadosPorEtapa[etapa] || { individual: [] };
      const etapaResultados = { ...resultadosPrevios };
      const individual = [...etapaResultados.individual];
      const existingIndex = individual.findIndex((r) => r.corredor === corredorNombre);
      const now = Date.now();

      if (existingIndex > -1) {
        individual[existingIndex] = {
          ...individual[existingIndex],
          tiempo: (individual[existingIndex].tiempo || 0) + tiempo,
          ultimoUpdate: now,
        };
      } else {
        individual.push({
          corredor: corredorNombre,
          tiempo,
          ultimoUpdate: now,
          ordenLlegada: null,
        });
      }

      return {
        ...state,
        resultadosPorEtapa: {
          ...state.resultadosPorEtapa,
          [etapa]: {
            ...etapaResultados,
            individual,
          },
        },
      };
    }

    case "AÑADIR_PUNTOS_CORREDOR": {
      const { etapa, corredorNombre, tipoPunto, puntos } = action.payload;
      const etapaResultados = { ...state.resultadosPorEtapa[etapa] };
      if (!etapaResultados.puntos) {
        etapaResultados.puntos = { regularidad: [], montaña: [] };
      }

      const puntosArray = [...(etapaResultados.puntos[tipoPunto] || [])];
      const index = puntosArray.findIndex((s) => s.corredor === corredorNombre);

      if (index > -1) {
        puntosArray[index] = {
          ...puntosArray[index],
          puntos: puntosArray[index].puntos + puntos,
        };
      } else {
        puntosArray.push({ corredor: corredorNombre, puntos });
      }

      return {
        ...state,
        resultadosPorEtapa: {
          ...state.resultadosPorEtapa,
          [etapa]: {
            ...etapaResultados,
            puntos: {
              ...etapaResultados.puntos,
              [tipoPunto]: puntosArray,
            },
          },
        },
      };
    }

    case "RESTAR_PUNTOS_CORREDOR": {
      const { etapa, corredorNombre, tipoPunto, puntos } = action.payload;
      const etapaResultados = { ...state.resultadosPorEtapa[etapa] };
      const puntosArray = [...(etapaResultados.puntos?.[tipoPunto] || [])];
      const index = puntosArray.findIndex((s) => s.corredor === corredorNombre);

      if (index > -1) {
        const nuevosPuntos = Math.max(puntosArray[index].puntos - puntos, 0);
        puntosArray[index] = {
          ...puntosArray[index],
          puntos: nuevosPuntos,
        };
      }

      return {
        ...state,
        resultadosPorEtapa: {
          ...state.resultadosPorEtapa,
          [etapa]: {
            ...etapaResultados,
            puntos: {
              ...etapaResultados.puntos,
              [tipoPunto]: puntosArray,
            },
          },
        },
      };
    }

    case "FINALIZAR_CAMPEONATO": {
      const generalFinal = Object.entries(state.clasificacionesTotales.general)
        .sort(([, a], [, b]) => Number(a) - Number(b))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      const regularidadFinal = Object.entries(state.clasificacionesTotales.regularidad)
        .sort(([, a], [, b]) => Number(a) - Number(b))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      const montañaFinal = Object.entries(state.clasificacionesTotales.montaña)
        .sort(([, a], [, b]) => Number(a) - Number(b))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      const tourFinal = Object.entries(state.clasificacionesTotales.tour || {})
        .sort(([, a], [, b]) => Number(a) - Number(b))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      return {
        ...state,
        mostrarClasificacionFinal: true,
        clasificacionesFinales: {
          general: generalFinal,
          regularidad: regularidadFinal,
          montaña: montañaFinal,
          tour: tourFinal,
        },
        activeTab: "Clasificación Final",

      };
    }

    case "CREAR_EQUIPO": {
      const { nombre, color, rodador, sprinter } = action.payload;
      const nuevoEquipo: Equipo = {
        nombre,
        color,
        rodador: {
          nombre: rodador,
          tipo: 'rodador',
        },
        sprinter: {
          nombre: sprinter,
          tipo: 'sprinter',
        },

      };

      return {
        ...state,
        equipos: [...state.equipos, nuevoEquipo],
      };
    }

    case "COMENZAR_CAMPEONATO": {

      if (state.equipos.length < 2) {
        alert("Debes crear al menos dos equipos para comenzar el campeonato.");
        return state;
      }

      return {
        ...state,
        faseCreacionEquipos: false,
        etapaActual: 1,
        activeTab: "Etapa 1",
        resultadosPorEtapa: {
          ...state.resultadosPorEtapa,
          1: { individual: [], puntos: { regularidad: [], montaña: [] } },
        },
      };
    }

    case "ACTUALIZAR_TOUR_POINTS": {
      const { puntosTour } = action.payload;
      const nuevosTotales = { ...state.clasificacionesTotales };

      if (!nuevosTotales.tour) {
        nuevosTotales.tour = {};
      }

      for (const corredor in puntosTour) {
        console.log(corredor, nuevosTotales.tour[corredor], puntosTour[corredor]);
        nuevosTotales.tour[corredor] =
          (nuevosTotales.tour[corredor] || 0) + puntosTour[corredor];
      }

      return {
        ...state,
        clasificacionesTotales: nuevosTotales,
      };
    }

    case "PROCESAR_RESULTADOS_ETAPA": {
      const { etapa, resultadosProcesados } = action.payload;
      return {
        ...state,
        resultadosPorEtapa: {
          ...state.resultadosPorEtapa,
          [etapa]: {
            ...state.resultadosPorEtapa[etapa],
            ...resultadosProcesados,
          },
        },
      };
    }

    case "AVANZAR_ETAPA": {
      const etapaFinalizada = state.etapaActual;
      const nuevaEtapa = etapaFinalizada + 1;

      const nuevosResultados = { ...state.resultadosPorEtapa };
      if (!nuevosResultados[nuevaEtapa]) {
        nuevosResultados[nuevaEtapa] = {
          individual: [],
          puntos: { regularidad: [], montaña: [] },
        };
      }

      return {
        ...state,
        etapaActual: nuevaEtapa,
        activeTab: `Etapa ${nuevaEtapa}`,
        resultadosPorEtapa: nuevosResultados,
      };
    }

    case "RETROCEDER_ETAPA": {
      const nuevaEtapa = Math.max(1, state.etapaActual - 1);
      return {
        ...state,
        etapaActual: nuevaEtapa,
        activeTab: `Etapa ${nuevaEtapa}`,
      };
    }

    case "RESETEAR_FORMULARIO_EQUIPO": {
      return {
        ...state,
        nuevoEquipo: {
          nombre: "",
          color: "",
          rodador: "",
          sprinter: "",
        },
        mostrarFormularioEquipo: false,
      };
    }

    case "TOGGLE_FORMULARIO_EQUIPO": {
      return {
        ...state,
        mostrarFormularioEquipo: !state.mostrarFormularioEquipo,
      };
    }

    case "ACTUALIZAR_NUEVO_EQUIPO":
      return {
        ...state,
        nuevoEquipo: {
          ...state.nuevoEquipo,
          [action.payload.campo]: action.payload.valor,
        },
      };

    case "ASIGNAR_IDS_PARTIDA":
      return {
        ...state,
        idPartida: action.payload.idPartida,
        idSoloLectura: action.payload.idSoloLectura,
      };

    case "MOSTRAR_MODAL_ENLACES":
      return {
        ...state,
        mostrarModalEnlaces: true,
      };
    case "OCULTAR_MODAL_ENLACES":
      return {
        ...state,
        mostrarModalEnlaces: false,
      };
      // Más acciones luego...
    default:
      return state;
  }
}
