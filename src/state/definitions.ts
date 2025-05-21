export type Action =
  | { type: "REEMPLAZAR_ESTADO_COMPLETO"; payload: State }
  | { type: "AÑADIR_EQUIPO"; payload: Equipo }
  | { type: "CAMBIAR_TAB"; payload: string }
  | { type: "AVANZAR_ETAPA" }
  | { type: "MOSTRAR_MODAL_ENLACES" }
  | { type: "OCULTAR_MODAL_ENLACES" }
  | { type: "RETROCEDER_ETAPA" }
  | {
      type: "ACTUALIZAR_NUEVO_EQUIPO";
      payload: { campo: string; valor: string };
    }
  | { type: "TOGGLE_FORMULARIO_EQUIPO" }
  | { type: "CAMBIAR_FASE_CREACION"; payload: boolean }
  | {
      type: "ACTUALIZAR_CLASIFICACIONES_TOTALES";
      payload: ClasificacionesTotales;
    }
  | { type: "ACTUALIZAR_COLORES_DISPONIBLES"; payload: string[] }
  | {
      type: "AÑADIR_TIEMPO_CORREDOR";
      payload: { etapa: string; corredorNombre: string; tiempo: number };
    }
  | {
      type: "AÑADIR_PUNTOS_CORREDOR";
      payload: {
        etapa: string;
        corredorNombre: string;
        tipoPunto: "sprint" | "montaña";
        puntos: number;
      };
    }
  | {
      type: "RESTAR_PUNTOS_CORREDOR";
      payload: {
        etapa: string;
        corredorNombre: string;
        tipoPunto: "sprint" | "montaña";
        puntos: number;
      };
    }
  | { type: "FINALIZAR_CAMPEONATO" }
  | {
      type: "CREAR_EQUIPO";
      payload: {
        nombre: string;
        color: string;
        rodador: string;
        sprinter: string;
      };
    }
  | { type: "COMENZAR_CAMPEONATO" }
  | {
      type: "ACTUALIZAR_TOUR_POINTS";
      payload: { etapa: string; puntosTour: Record<string, number> };
    }
  | {
      type: "PROCESAR_RESULTADOS_ETAPA";
      payload: { etapa: string; resultadosProcesados: ResultadoEtapa };
    }
  | { type: "RESETEAR_FORMULARIO_EQUIPO" }
  | {
      type: "ACTUALIZAR_NUEVO_EQUIPO";
      payload: { campo: string; valor: string };
    }
  | {
      type: "ASIGNAR_IDS_PARTIDA";
      payload: { idPartida: string; idSoloLectura: string };
    };

export interface Corredor {
  nombre: string;
  tipo: "rodador" | "sprinter";
}

export interface Equipo {
  nombre: string;
  color: string;
  rodador: Corredor;
  sprinter: Corredor;
}

export interface ResultadoEtapa {
  individual?: {
    corredor: string;
    tiempo: number;
    ordenLlegada: number | null;
    ultimoUpdate: number;
  }[];
  puntos?: {
    sprint?: { corredor: string; puntos: number }[];
    montaña?: { corredor: string; puntos: number }[];
  };
  puntosTour?: Record<string, number>;
  lideresDescanso?: {
    clasificacion: string;
    corredor: string;
    puntos: number;
  }[];
}

export interface ClasificacionesTotales {
  general: Record<string, { tiempoTotal: number }>;
  sprint: Record<string, number>;
  montaña: Record<string, number>;
  tour: Record<string, number>;
}

export interface State {
  idPartida: string;
  idSoloLectura: string;
  permisosEscritura: boolean;
  equipos: Equipo[];
  resultadosPorEtapa: Record<string, ResultadoEtapa>;
  clasificacionesTotales: ClasificacionesTotales;
  etapaActual: number;
  clasificacionesFinales: ClasificacionesTotales | null;
  faseCreacionEquipos: boolean;
  activeTab: string;
  nuevoEquipo: {
    nombre: string;
    color: string;
    rodador: string;
    sprinter: string;
  };

  mostrarClasificacionFinal: boolean;
  mostrarFormularioEquipo: boolean;
  mostrarModalEnlaces: boolean;
  coloresDisponibles: string[];
  coloresDisponiblesInicial: string[];
}

export const TABLE_NAME = "flamme_rouge_partidas";
