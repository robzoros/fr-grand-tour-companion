export const mockEquiposFinal = [
  {
    nombre: "Equipo Rojo",
    color: "red",
    corredores: [
      { nombre: "Rodador Rojo 1", tipo: "rodador" },
      { nombre: "Sprinter Rojo 2", tipo: "sprinter" },
    ],
  },
  {
    nombre: "Equipo Azul",
    color: "blue",
    corredores: [
      { nombre: "Escalador Azul 1", tipo: "rodador" },
      { nombre: "TodoTerreno Azul 2", tipo: "sprinter" },
    ],
  },
  {
    nombre: "Equipo Verde",
    color: "green",
    corredores: [
      { nombre: "Líder Verde 1", tipo: "rodador" },
      { nombre: "Ayudante Verde 2", tipo: "sprinter" },
    ],
  },
];

export const mockResultadosEtapasFinal = {
  "Etapa 1": {
    individual: [
      { corredor: "Rodador Rojo 1", tiempo: 0 },
      { corredor: "Escalador Azul 1", tiempo: 10 },
      { corredor: "Líder Verde 1", tiempo: 20 },
      { corredor: "Sprinter Rojo 2", tiempo: 40 },
      { corredor: "TodoTerreno Azul 2", tiempo: 70 },
      { corredor: "Ayudante Verde 2", tiempo: 90 },
    ],
    puntosTour: {
      "Rodador Rojo 1": 3,
      "Escalador Azul 1": 2,
      "Líder Verde 1": 1,
    },
    puntos: {
      sprint: [
        { corredor: "Sprinter Rojo 2", puntos: 5 },
        { corredor: "TodoTerreno Azul 2", puntos: 3 },
      ],
      montaña: [
        { corredor: "Escalador Azul 1", puntos: 7 },
        { corredor: "Rodador Rojo 1", puntos: 5 },
      ],
    },
  },
  "Etapa 2": {
    individual: [
      { corredor: "Sprinter Rojo 2", tiempo: 0 },
      { corredor: "TodoTerreno Azul 2", tiempo: 10 },
      { corredor: "Ayudante Verde 2", tiempo: 50 },
      { corredor: "Rodador Rojo 1", tiempo: 70 },
      { corredor: "Escalador Azul 1", tiempo: 80 },
      { corredor: "Líder Verde 1", tiempo: 100 },
    ],
    puntosTour: {
      "Sprinter Rojo 2": 3,
      "TodoTerreno Azul 2": 2,
      "Ayudante Verde 2": 1,
    },
    puntos: {
      sprint: [
        { corredor: "Sprinter Rojo 2", puntos: 7 },
        { corredor: "TodoTerreno Azul 2", puntos: 5 },
      ],
      montaña: [
        { corredor: "Escalador Azul 1", puntos: 3 },
        { corredor: "Rodador Rojo 1", puntos: 2 },
      ],
    },
  },
  "Rest 2 - Descanso 1": {
    puntosTour: {
      "Rodador Rojo 1": 1,
      "Sprinter Rojo 2": 1,
      "Escalador Azul 1": 1,
    },
    lideresDescanso: [
      { clasificacion: "General", corredor: "Rodador Rojo 1", puntos: 1 },
      { clasificacion: "sprint", corredor: "Sprinter Rojo 2", puntos: 1 },
      { clasificacion: "Montaña", corredor: "Escalador Azul 1", puntos: 1 },
    ],
  },
  "Etapa 3": {
    individual: [
      { corredor: "Escalador Azul 1", tiempo: 0 },
      { corredor: "Líder Verde 1", tiempo: 20 },
      { corredor: "Rodador Rojo 1", tiempo: 20 },
      { corredor: "Sprinter Rojo 2", tiempo: 40 },
      { corredor: "TodoTerreno Azul 2", tiempo: 100 },
      { corredor: "Ayudante Verde 2", tiempo: 100 },
    ],
    puntosTour: {
      "Escalador Azul 1": 3,
      "Líder Verde 1": 2,
      "Rodador Rojo 1": 1,
    },
    puntos: {
      sprint: [
        { corredor: "Sprinter Rojo 2", puntos: 3 },
        { corredor: "TodoTerreno Azul 2", puntos: 2 },
      ],
      montaña: [
        { corredor: "Escalador Azul 1", puntos: 10 },
        { corredor: "Líder Verde 1", puntos: 7 },
      ],
    },
  },
  "Etapa 4": {
    individual: [
      { corredor: "Líder Verde 1", tiempo: 0 },
      { corredor: "Ayudante Verde 2", tiempo: 10 },
      { corredor: "Escalador Azul 1", tiempo: 20 },
      { corredor: "Rodador Rojo 1", tiempo: 30 },
      { corredor: "Sprinter Rojo 2", tiempo: 80 },
      { corredor: "TodoTerreno Azul 2", tiempo: 90 },
    ],
    puntosTour: {
      "Líder Verde 1": 3,
      "Ayudante Verde 2": 2,
      "Escalador Azul 1": 1,
    },
    puntos: {
      sprint: [
        { corredor: "Sprinter Rojo 2", puntos: 4 },
        { corredor: "TodoTerreno Azul 2", puntos: 3 },
      ],
      montaña: [
        { corredor: "Escalador Azul 1", puntos: 5 },
        { corredor: "Líder Verde 1", puntos: 3 },
      ],
    },
  },
  "Rest 4 - Descanso 2": {
    puntosTour: {
      "Rodador Rojo 1": 1,
      "Escalador Azul 1": 1,
      "Líder Verde 1": 1,
    },
    lideresDescanso: [
      { clasificacion: "General", corredor: "Rodador Rojo 1", puntos: 1 },
      { clasificacion: "sprint", corredor: "Sprinter Rojo 2", puntos: 1 },
      { clasificacion: "Montaña", corredor: "Escalador Azul 1", puntos: 1 },
    ],
  },
  "Etapa 5": {
    individual: [
      { corredor: "TodoTerreno Azul 2", tiempo: 0 },
      { corredor: "Sprinter Rojo 2", tiempo: 10 },
      { corredor: "Rodador Rojo 1", tiempo: 10 },
      { corredor: "Escalador Azul 1", tiempo: 50 },
      { corredor: "Líder Verde 1", tiempo: 70 },
      { corredor: "Ayudante Verde 2", tiempo: 80 },
    ],
    puntosTour: {
      "TodoTerreno Azul 2": 3,
      "Sprinter Rojo 2": 2,
      "Rodador Rojo 1": 1,
    },
    puntos: {
      sprint: [
        { corredor: "Sprinter Rojo 2", puntos: 6 },
        { corredor: "TodoTerreno Azul 2", puntos: 4 },
      ],
      montaña: [
        { corredor: "Escalador Azul 1", puntos: 8 },
        { corredor: "Líder Verde 1", puntos: 5 },
      ],
    },
  },
  "Etapa 6": {
    individual: [
      { corredor: "Ayudante Verde 2", tiempo: 0 },
      { corredor: "Líder Verde 1", tiempo: 10 },
      { corredor: "Escalador Azul 1", tiempo: 20 },
      { corredor: "Rodador Rojo 1", tiempo: 80 },
      { corredor: "Sprinter Rojo 2", tiempo: 80 },
      { corredor: "TodoTerreno Azul 2", tiempo: 90 },
    ],
    puntosTour: {
      "Ayudante Verde 2": 3,
      "Líder Verde 1": 2,
      "Escalador Azul 1": 1,
    },
    puntos: {
      sprint: [
        { corredor: "Sprinter Rojo 2", puntos: 5 },
        { corredor: "TodoTerreno Azul 2", puntos: 3 },
      ],
      montaña: [
        { corredor: "Escalador Azul 1", puntos: 6 },
        { corredor: "Líder Verde 1", puntos: 4 },
      ],
    },
  },
};

export const mockClasificacionesFinales = {
  general: {
    "Rodador Rojo 1": { tiempoTotal: 21390 },
    "Escalador Azul 1": { tiempoTotal: 21465 },
    "Líder Verde 1": { tiempoTotal: 21510 },
    "Sprinter Rojo 2": { tiempoTotal: 21660 },
    "TodoTerreno Azul 2": { tiempoTotal: 21720 },
    "Ayudante Verde 2": { tiempoTotal: 21745 },
  },
  sprint: {
    "Sprinter Rojo 2": 30,
    "TodoTerreno Azul 2": 17,
    "Ayudante Verde 2": 1,
  },
  montaña: {
    "Escalador Azul 1": 39,
    "Líder Verde 1": 19,
    "Rodador Rojo 1": 7,
  },
};

export const mockNumeroEtapasFinal = 6;
